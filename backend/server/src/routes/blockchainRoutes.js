import express from 'express';
import blockchainService from '../services/blockchainService.js';

const router = express.Router();

// Middleware to check if blockchain service is ready
const checkBlockchainReady = (req, res, next) => {
    if (!blockchainService.isReady()) {
        return res.status(503).json({
            error: 'Blockchain service not initialized',
            message: 'Please ensure contracts are deployed and blockchain connection is configured'
        });
    }
    next();
};

// Medical Records Routes
router.post('/records', checkBlockchainReady, async (req, res) => {
    try {
        const { patientAddress, ipfsHash, recordType, encryptedKey } = req.body;

        if (!patientAddress || !ipfsHash || !recordType) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        const receipt = await blockchainService.createMedicalRecord(
            patientAddress,
            ipfsHash,
            recordType,
            encryptedKey || ''
        );

        res.json({
            success: true,
            transactionHash: receipt.transactionHash,
            blockNumber: receipt.blockNumber
        });
    } catch (error) {
        console.error('Error creating medical record:', error);
        res.status(500).json({ error: error.message });
    }
});

router.get('/records/:patientAddress', checkBlockchainReady, async (req, res) => {
    try {
        const { patientAddress } = req.params;
        const records = await blockchainService.getPatientRecords(patientAddress);

        res.json({
            success: true,
            records: records.map(record => ({
                ipfsHash: record.ipfsHash,
                recordType: record.recordType,
                timestamp: record.timestamp.toNumber(),
                provider: record.provider,
                isActive: record.isActive,
                encryptedKey: record.encryptedKey
            }))
        });
    } catch (error) {
        console.error('Error getting patient records:', error);
        res.status(500).json({ error: error.message });
    }
});

// Consent Management Routes
router.post('/consent/grant', checkBlockchainReady, async (req, res) => {
    try {
        const { providerAddress, purpose, duration } = req.body;

        if (!providerAddress || !purpose || !duration) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        const receipt = await blockchainService.grantConsent(
            providerAddress,
            purpose,
            duration
        );

        res.json({
            success: true,
            transactionHash: receipt.transactionHash,
            message: 'Consent granted successfully'
        });
    } catch (error) {
        console.error('Error granting consent:', error);
        res.status(500).json({ error: error.message });
    }
});

router.post('/consent/revoke', checkBlockchainReady, async (req, res) => {
    try {
        const { providerAddress } = req.body;

        if (!providerAddress) {
            return res.status(400).json({ error: 'Provider address is required' });
        }

        const receipt = await blockchainService.revokeConsent(providerAddress);

        res.json({
            success: true,
            transactionHash: receipt.transactionHash,
            message: 'Consent revoked successfully'
        });
    } catch (error) {
        console.error('Error revoking consent:', error);
        res.status(500).json({ error: error.message });
    }
});

// Emergency Access Routes
router.post('/emergency-access', checkBlockchainReady, async (req, res) => {
    try {
        const { patientAddress, accessCode } = req.body;

        if (!patientAddress || !accessCode) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        const receipt = await blockchainService.emergencyAccess(patientAddress, accessCode);

        res.json({
            success: true,
            transactionHash: receipt.transactionHash,
            message: 'Emergency access granted'
        });
    } catch (error) {
        console.error('Error with emergency access:', error);
        res.status(500).json({ error: error.message });
    }
});

// Audit Trail Routes
router.get('/audit-trail', checkBlockchainReady, async (req, res) => {
    try {
        const { startIndex = 0, count = 50 } = req.query;

        const auditLogs = await blockchainService.getAuditTrail(
            parseInt(startIndex),
            parseInt(count)
        );

        res.json({
            success: true,
            auditTrail: auditLogs.map(log => ({
                actor: log.actor,
                action: log.action,
                timestamp: log.timestamp.toNumber(),
                details: log.details,
                targetAddress: log.targetAddress
            }))
        });
    } catch (error) {
        console.error('Error getting audit trail:', error);
        res.status(500).json({ error: error.message });
    }
});

// Health Data Token Routes
router.post('/tokens/stake', checkBlockchainReady, async (req, res) => {
    try {
        const { amount } = req.body;

        if (!amount || amount <= 0) {
            return res.status(400).json({ error: 'Valid amount is required' });
        }

        const receipt = await blockchainService.stakeTokens(amount);

        res.json({
            success: true,
            transactionHash: receipt.transactionHash,
            message: 'Tokens staked successfully'
        });
    } catch (error) {
        console.error('Error staking tokens:', error);
        res.status(500).json({ error: error.message });
    }
});

router.post('/tokens/unstake', checkBlockchainReady, async (req, res) => {
    try {
        const { amount } = req.body;

        if (!amount || amount <= 0) {
            return res.status(400).json({ error: 'Valid amount is required' });
        }

        const receipt = await blockchainService.unstakeTokens(amount);

        res.json({
            success: true,
            transactionHash: receipt.transactionHash,
            message: 'Tokens unstaked successfully'
        });
    } catch (error) {
        console.error('Error unstaking tokens:', error);
        res.status(500).json({ error: error.message });
    }
});

router.post('/tokens/claim-reward', checkBlockchainReady, async (req, res) => {
    try {
        const receipt = await blockchainService.claimStakingReward();

        res.json({
            success: true,
            transactionHash: receipt.transactionHash,
            message: 'Reward claimed successfully'
        });
    } catch (error) {
        console.error('Error claiming reward:', error);
        res.status(500).json({ error: error.message });
    }
});

router.get('/tokens/balance/:address', checkBlockchainReady, async (req, res) => {
    try {
        const { address } = req.params;
        const balance = await blockchainService.getTokenBalance(address);

        res.json({
            success: true,
            balance: balance,
            address: address
        });
    } catch (error) {
        console.error('Error getting token balance:', error);
        res.status(500).json({ error: error.message });
    }
});

router.get('/tokens/stake-info/:address', checkBlockchainReady, async (req, res) => {
    try {
        const { address } = req.params;
        const stakeInfo = await blockchainService.getStakeInfo(address);

        res.json({
            success: true,
            stakeInfo: stakeInfo,
            address: address
        });
    } catch (error) {
        console.error('Error getting stake info:', error);
        res.status(500).json({ error: error.message });
    }
});

// Utility Routes
router.get('/status', async (req, res) => {
    const status = {
        blockchain: blockchainService.isReady(),
        blockNumber: null,
        gasPrice: null
    };

    if (status.blockchain) {
        try {
            status.blockNumber = await blockchainService.getBlockNumber();
            status.gasPrice = await blockchainService.getGasPrice();
        } catch (error) {
            console.error('Error getting blockchain status:', error);
        }
    }

    res.json({
        success: true,
        status: status
    });
});

export default router;
