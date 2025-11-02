import { ethers } from 'ethers';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load contract ABIs
const medicalRecordsABI = JSON.parse(fs.readFileSync(path.join(__dirname, '../../artifacts/contracts/MedicalRecords.sol/MedicalRecords.json'))).abi;
const healthDataTokenABI = JSON.parse(fs.readFileSync(path.join(__dirname, '../../artifacts/contracts/HealthDataToken.sol/HealthDataToken.json'))).abi;

// Load deployment addresses
let deploymentInfo;
try {
    deploymentInfo = JSON.parse(fs.readFileSync(path.join(__dirname, '../../../deployment.json')));
} catch (error) {
    console.warn('Deployment info not found. Please deploy contracts first.');
    deploymentInfo = {
        medicalRecords: process.env.MEDICAL_RECORDS_CONTRACT_ADDRESS,
        healthDataToken: process.env.HEALTH_DATA_TOKEN_CONTRACT_ADDRESS
    };
}

class BlockchainService {
    constructor() {
        this.provider = null;
        this.signer = null;
        this.medicalRecordsContract = null;
        this.healthDataTokenContract = null;
        this.isInitialized = false;
    }

    async initialize() {
        try {
            // Connect to blockchain network
            const rpcUrl = process.env.BLOCKCHAIN_RPC_URL || 'http://127.0.0.1:8545';
            this.provider = new ethers.JsonRpcProvider(rpcUrl);

            // Use private key for server-side signing
            const privateKey = process.env.BLOCKCHAIN_PRIVATE_KEY;
            if (privateKey) {
                this.signer = new ethers.Wallet(privateKey, this.provider);
            }

            // Initialize contracts
            if (deploymentInfo.medicalRecords) {
                this.medicalRecordsContract = new ethers.Contract(
                    deploymentInfo.medicalRecords,
                    medicalRecordsABI,
                    this.signer || this.provider
                );
            }

            if (deploymentInfo.healthDataToken) {
                this.healthDataTokenContract = new ethers.Contract(
                    deploymentInfo.healthDataToken,
                    healthDataTokenABI,
                    this.signer || this.provider
                );
            }

            this.isInitialized = true;
            console.log('Blockchain service initialized successfully');
        } catch (error) {
            console.error('Failed to initialize blockchain service:', error);
            throw error;
        }
    }

    // Medical Records Functions
    async createMedicalRecord(patientAddress, ipfsHash, recordType, encryptedKey) {
        if (!this.medicalRecordsContract) throw new Error('MedicalRecords contract not initialized');

        try {
            const tx = await this.medicalRecordsContract.createRecord(
                patientAddress,
                ipfsHash,
                recordType,
                encryptedKey
            );
            const receipt = await tx.wait();
            return receipt;
        } catch (error) {
            console.error('Error creating medical record:', error);
            throw error;
        }
    }

    async getPatientRecords(patientAddress) {
        if (!this.medicalRecordsContract) throw new Error('MedicalRecords contract not initialized');

        try {
            const records = await this.medicalRecordsContract.getPatientRecords(patientAddress);
            return records;
        } catch (error) {
            console.error('Error getting patient records:', error);
            throw error;
        }
    }

    async grantConsent(providerAddress, purpose, duration) {
        if (!this.medicalRecordsContract) throw new Error('MedicalRecords contract not initialized');

        try {
            const tx = await this.medicalRecordsContract.grantConsent(
                providerAddress,
                purpose,
                duration
            );
            const receipt = await tx.wait();
            return receipt;
        } catch (error) {
            console.error('Error granting consent:', error);
            throw error;
        }
    }

    async revokeConsent(providerAddress) {
        if (!this.medicalRecordsContract) throw new Error('MedicalRecords contract not initialized');

        try {
            const tx = await this.medicalRecordsContract.revokeConsent(providerAddress);
            const receipt = await tx.wait();
            return receipt;
        } catch (error) {
            console.error('Error revoking consent:', error);
            throw error;
        }
    }

    async emergencyAccess(patientAddress, accessCode) {
        if (!this.medicalRecordsContract) throw new Error('MedicalRecords contract not initialized');

        try {
            const tx = await this.medicalRecordsContract.emergencyAccess(patientAddress, accessCode);
            const receipt = await tx.wait();
            return receipt;
        } catch (error) {
            console.error('Error with emergency access:', error);
            throw error;
        }
    }

    async getAuditTrail(startIndex, count) {
        if (!this.medicalRecordsContract) throw new Error('MedicalRecords contract not initialized');

        try {
            const auditLogs = await this.medicalRecordsContract.getAuditTrail(startIndex, count);
            return auditLogs;
        } catch (error) {
            console.error('Error getting audit trail:', error);
            throw error;
        }
    }

    // Health Data Token Functions
    async stakeTokens(amount) {
        if (!this.healthDataTokenContract) throw new Error('HealthDataToken contract not initialized');

        try {
            const tx = await this.healthDataTokenContract.stake(amount);
            const receipt = await tx.wait();
            return receipt;
        } catch (error) {
            console.error('Error staking tokens:', error);
            throw error;
        }
    }

    async unstakeTokens(amount) {
        if (!this.healthDataTokenContract) throw new Error('HealthDataToken contract not initialized');

        try {
            const tx = await this.healthDataTokenContract.unstake(amount);
            const receipt = await tx.wait();
            return receipt;
        } catch (error) {
            console.error('Error unstaking tokens:', error);
            throw error;
        }
    }

    async claimStakingReward() {
        if (!this.healthDataTokenContract) throw new Error('HealthDataToken contract not initialized');

        try {
            const tx = await this.healthDataTokenContract.claimReward();
            const receipt = await tx.wait();
            return receipt;
        } catch (error) {
            console.error('Error claiming reward:', error);
            throw error;
        }
    }

    async rewardDataSharing(userAddress, recordsShared) {
        if (!this.healthDataTokenContract) throw new Error('HealthDataToken contract not initialized');

        try {
            const tx = await this.healthDataTokenContract.rewardDataSharing(userAddress, recordsShared);
            const receipt = await tx.wait();
            return receipt;
        } catch (error) {
            console.error('Error rewarding data sharing:', error);
            throw error;
        }
    }

    async getTokenBalance(address) {
        if (!this.healthDataTokenContract) throw new Error('HealthDataToken contract not initialized');

        try {
            const balance = await this.healthDataTokenContract.balanceOf(address);
            return ethers.utils.formatEther(balance);
        } catch (error) {
            console.error('Error getting token balance:', error);
            throw error;
        }
    }

    async getStakeInfo(address) {
        if (!this.healthDataTokenContract) throw new Error('HealthDataToken contract not initialized');

        try {
            const stakeInfo = await this.healthDataTokenContract.getStakeInfo(address);
            return {
                amount: ethers.utils.formatEther(stakeInfo.amount),
                startTime: stakeInfo.startTime.toNumber(),
                pendingReward: ethers.utils.formatEther(stakeInfo.pendingReward)
            };
        } catch (error) {
            console.error('Error getting stake info:', error);
            throw error;
        }
    }

    // Utility Functions
    async getBlockNumber() {
        if (!this.provider) throw new Error('Provider not initialized');
        return await this.provider.getBlockNumber();
    }

    async getGasPrice() {
        if (!this.provider) throw new Error('Provider not initialized');
        const gasPrice = await this.provider.getGasPrice();
        return ethers.utils.formatUnits(gasPrice, 'gwei');
    }

    isReady() {
        return this.isInitialized && this.medicalRecordsContract && this.healthDataTokenContract;
    }
}

// Export singleton instance
const blockchainService = new BlockchainService();

export default blockchainService;
