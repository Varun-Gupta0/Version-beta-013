// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

contract MedicalRecords is Ownable, ReentrancyGuard {
    struct Record {
        string ipfsHash;
        string recordType; // "lab_result", "prescription", "imaging", etc.
        uint256 timestamp;
        address provider;
        bool isActive;
        string encryptedKey; // For encrypted records
    }

    struct Consent {
        address patient;
        address provider;
        string purpose;
        uint256 expiry;
        bool isActive;
        uint256 grantedAt;
    }

    struct AuditLog {
        address actor;
        string action; // "CREATE", "READ", "UPDATE", "DELETE", "GRANT_CONSENT", "REVOKE_CONSENT"
        uint256 timestamp;
        string details;
        address targetAddress;
    }

    // Mappings
    mapping(address => Record[]) private patientRecords;
    mapping(address => mapping(address => Consent[])) private consents; // patient => provider => consents
    mapping(bytes32 => bool) private emergencyAccessCodes;
    AuditLog[] private auditTrail;

    // Events
    event RecordCreated(address indexed patient, address indexed provider, string recordType, uint256 timestamp);
    event RecordAccessed(address indexed accessor, address indexed patient, uint256 recordIndex);
    event ConsentGranted(address indexed patient, address indexed provider, string purpose);
    event ConsentRevoked(address indexed patient, address indexed provider);
    event EmergencyAccess(address indexed emergencyProvider, address indexed patient, bytes32 accessCode);

    //
    // v-- THIS IS THE FIX (NEW CONSTRUCTOR) --v
    //
    constructor() Ownable(msg.sender) {
        // This constructor is now required to set the initial owner
    }
    //
    // ^-- THIS IS THE FIX (NEW CONSTRUCTOR) --^
    //

    // Modifiers
    modifier onlyAuthorized(address patient) {
        require(
            msg.sender == patient ||
            hasActiveConsent(patient, msg.sender) ||
            isEmergencyAccessActive(patient), // Note: Relies on placeholder logic
            "Unauthorized access"
        );
        _;
    }

    modifier validConsent(address patient, address provider) {
        require(hasActiveConsent(patient, provider), "No active consent");
        _;
    }

    // Core Functions
    function createRecord(
        address patient,
        string memory ipfsHash,
        string memory recordType,
        string memory encryptedKey
    ) public onlyAuthorized(patient) {
        Record memory newRecord = Record({
            ipfsHash: ipfsHash,
            recordType: recordType,
            timestamp: block.timestamp,
            provider: msg.sender,
            isActive: true,
            encryptedKey: encryptedKey
        });

        patientRecords[patient].push(newRecord);

        // Log audit event
        auditTrail.push(AuditLog({
            actor: msg.sender,
            action: "CREATE",
            timestamp: block.timestamp,
            details: string(abi.encodePacked("Created ", recordType, " record")),
            targetAddress: patient
        }));

        emit RecordCreated(patient, msg.sender, recordType, block.timestamp);
    }

    function getPatientRecords(address patient)
        public
        view
        onlyAuthorized(patient)
        returns (Record[] memory)
    {
        return patientRecords[patient];
    }

    function grantConsent(
        address provider,
        string memory purpose,
        uint256 duration
    ) public {
        require(duration > 0 && duration <= 365 days, "Invalid duration");

        Consent memory newConsent = Consent({
            patient: msg.sender,
            provider: provider,
            purpose: purpose,
            expiry: block.timestamp + duration,
            isActive: true,
            grantedAt: block.timestamp
        });

        consents[msg.sender][provider].push(newConsent);

        // Log audit event
        auditTrail.push(AuditLog({
            actor: msg.sender,
            action: "GRANT_CONSENT",
            timestamp: block.timestamp,
            details: purpose,
            targetAddress: provider
        }));

        emit ConsentGranted(msg.sender, provider, purpose);
    }

    function revokeConsent(address provider) public {
        Consent[] storage patientConsents = consents[msg.sender][provider];

        for (uint i = 0; i < patientConsents.length; i++) {
            if (patientConsents[i].isActive) {
                patientConsents[i].isActive = false;

                // Log audit event
                auditTrail.push(AuditLog({
                    actor: msg.sender,
                    action: "REVOKE_CONSENT",
                    timestamp: block.timestamp,
                    details: "Consent revoked",
                    targetAddress: provider
                }));

                emit ConsentRevoked(msg.sender, provider);
                break;
            }
        }
    }

    function emergencyAccess(address patient, bytes32 accessCode) public {
        require(emergencyAccessCodes[accessCode], "Invalid emergency access code");
        
        // Note: isEmergencyAccessActive(patient) is just a placeholder in this file
        // The onlyAuthorized modifier also uses it.
        // We'll keep the require check as it was in the original file.
        require(isEmergencyAccessActive(patient), "Emergency access not active");

        // Log emergency access
        auditTrail.push(AuditLog({
            actor: msg.sender,
            action: "EMERGENCY_ACCESS",
            timestamp: block.timestamp,
            details: "Emergency access granted",
            targetAddress: patient
        }));

        emit EmergencyAccess(msg.sender, patient, accessCode);

        // Deactivate the emergency code after use
        emergencyAccessCodes[accessCode] = false;
    }

    // Utility Functions
    function hasActiveConsent(address patient, address provider) public view returns (bool) {
        Consent[] memory patientConsents = consents[patient][provider];

        for (uint i = 0; i < patientConsents.length; i++) {
            if (patientConsents[i].isActive && patientConsents[i].expiry > block.timestamp) {
                return true;
            }
        }
        return false;
    }

    function isEmergencyAccessActive(address patient) public view returns (bool) {
        // Emergency access is active for 24 hours after activation
        // This is a simplified implementation - in production, this would be more sophisticated
        return true; // Placeholder - implement proper emergency logic
    }

    function getAuditTrail(uint256 startIndex, uint256 count)
        public
        view
        returns (AuditLog[] memory)
    {
        require(startIndex < auditTrail.length, "Invalid start index");

        uint256 endIndex = startIndex + count;
        if (endIndex > auditTrail.length) {
            endIndex = auditTrail.length;
        }

        AuditLog[] memory result = new AuditLog[](endIndex - startIndex);
        for (uint256 i = startIndex; i < endIndex; i++) {
            result[i - startIndex] = auditTrail[i];
        }

        return result;
    }

    // Admin Functions
    function generateEmergencyCode() public onlyOwner returns (bytes32) {
        bytes32 code = keccak256(abi.encodePacked(block.timestamp, block.prevrandao, msg.sender));
        emergencyAccessCodes[code] = true;
        return code;
    }

    function deactivateRecord(address patient, uint256 recordIndex) public onlyAuthorized(patient) {
        require(recordIndex < patientRecords[patient].length, "Invalid record index");
        patientRecords[patient][recordIndex].isActive = false;

        // Log audit event
        auditTrail.push(AuditLog({
            actor: msg.sender,
            action: "DELETE",
            timestamp: block.timestamp,
            details: "Record deactivated",
            targetAddress: patient
        }));
    }
}