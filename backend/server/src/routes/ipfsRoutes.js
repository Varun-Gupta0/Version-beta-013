import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import ipfsService from '../services/ipfsService.js';

const router = express.Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadDir = path.join(process.cwd(), 'uploads');
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
        }
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    }
});

const upload = multer({
    storage: storage,
    limits: {
        fileSize: 50 * 1024 * 1024 // 50MB limit
    },
    fileFilter: (req, file, cb) => {
        // Allow medical file types
        const allowedTypes = [
            'image/jpeg', 'image/png', 'image/gif', 'image/bmp', 'image/tiff',
            'application/pdf',
            'application/dicom', // DICOM files
            'application/octet-stream' // Generic binary for medical formats
        ];

        if (allowedTypes.includes(file.mimetype) ||
            file.originalname.toLowerCase().endsWith('.dcm') ||
            file.originalname.toLowerCase().endsWith('.dicom')) {
            cb(null, true);
        } else {
            cb(new Error('Invalid file type. Only medical images, PDFs, and DICOM files are allowed.'));
        }
    }
});

// Middleware to check if IPFS service is ready
const checkIPFSReady = (req, res, next) => {
    if (!ipfsService.isReady()) {
        return res.status(503).json({
            error: 'IPFS service not initialized',
            message: 'Please ensure IPFS node is running and configured'
        });
    }
    next();
};

// Store medical record data on IPFS
router.post('/store-record', checkIPFSReady, async (req, res) => {
    try {
        const { recordData, encrypt = false } = req.body;

        if (!recordData) {
            return res.status(400).json({ error: 'Record data is required' });
        }

        let encryptionKey = null;
        if (encrypt) {
            encryptionKey = ipfsService.generateEncryptionKey();
        }

        const result = await ipfsService.storeMedicalRecord(recordData, encryptionKey);

        res.json({
            success: true,
            ipfsHash: result.ipfsHash,
            encryptionKey: encryptionKey,
            size: result.size,
            encrypted: encrypt
        });
    } catch (error) {
        console.error('Error storing medical record:', error);
        res.status(500).json({ error: error.message });
    }
});

// Retrieve medical record data from IPFS
router.get('/retrieve-record/:ipfsHash', checkIPFSReady, async (req, res) => {
    try {
        const { ipfsHash } = req.params;
        const { encryptionKey } = req.query;

        const result = await ipfsService.retrieveMedicalRecord(ipfsHash, encryptionKey);

        res.json({
            success: true,
            data: result.data,
            metadata: result.metadata
        });
    } catch (error) {
        console.error('Error retrieving medical record:', error);
        res.status(500).json({ error: error.message });
    }
});

// Upload and store file on IPFS
router.post('/upload-file', checkIPFSReady, upload.single('file'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'No file uploaded' });
        }

        const { encrypt = false } = req.body;
        let encryptionKey = null;

        if (encrypt) {
            encryptionKey = ipfsService.generateEncryptionKey();
        }

        const result = await ipfsService.storeFile(req.file.path, encryptionKey);

        // Clean up uploaded file
        fs.unlinkSync(req.file.path);

        res.json({
            success: true,
            ipfsHash: result.ipfsHash,
            encryptionKey: encryptionKey,
            size: result.size,
            originalSize: result.originalSize,
            encrypted: encrypt,
            filename: req.file.originalname,
            mimetype: req.file.mimetype
        });
    } catch (error) {
        console.error('Error uploading file:', error);

        // Clean up uploaded file if it exists
        if (req.file && fs.existsSync(req.file.path)) {
            fs.unlinkSync(req.file.path);
        }

        res.status(500).json({ error: error.message });
    }
});

// Download file from IPFS
router.get('/download-file/:ipfsHash', checkIPFSReady, async (req, res) => {
    try {
        const { ipfsHash } = req.params;
        const { encryptionKey, filename = 'downloaded-file' } = req.query;

        const tempPath = path.join(process.cwd(), 'temp', `${Date.now()}-${filename}`);

        // Ensure temp directory exists
        const tempDir = path.dirname(tempPath);
        if (!fs.existsSync(tempDir)) {
            fs.mkdirSync(tempDir, { recursive: true });
        }

        const result = await ipfsService.retrieveFile(ipfsHash, tempPath, encryptionKey);

        // Set appropriate headers and send file
        res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
        res.setHeader('Content-Type', 'application/octet-stream');

        const fileStream = fs.createReadStream(tempPath);
        fileStream.pipe(res);

        // Clean up temp file after sending
        fileStream.on('end', () => {
            fs.unlinkSync(tempPath);
        });

    } catch (error) {
        console.error('Error downloading file:', error);
        res.status(500).json({ error: error.message });
    }
});

// Pin content on IPFS
router.post('/pin/:ipfsHash', checkIPFSReady, async (req, res) => {
    try {
        const { ipfsHash } = req.params;

        await ipfsService.pinContent(ipfsHash);

        res.json({
            success: true,
            message: 'Content pinned successfully',
            ipfsHash: ipfsHash
        });
    } catch (error) {
        console.error('Error pinning content:', error);
        res.status(500).json({ error: error.message });
    }
});

// Unpin content on IPFS
router.post('/unpin/:ipfsHash', checkIPFSReady, async (req, res) => {
    try {
        const { ipfsHash } = req.params;

        await ipfsService.unpinContent(ipfsHash);

        res.json({
            success: true,
            message: 'Content unpinned successfully',
            ipfsHash: ipfsHash
        });
    } catch (error) {
        console.error('Error unpinning content:', error);
        res.status(500).json({ error: error.message });
    }
});

// Get content statistics
router.get('/stats/:ipfsHash', checkIPFSReady, async (req, res) => {
    try {
        const { ipfsHash } = req.params;

        const stats = await ipfsService.getContentStats(ipfsHash);

        res.json({
            success: true,
            stats: stats
        });
    } catch (error) {
        console.error('Error getting content stats:', error);
        res.status(500).json({ error: error.message });
    }
});

// Generate encryption key
router.get('/generate-key', (req, res) => {
    try {
        const encryptionKey = ipfsService.generateEncryptionKey();

        res.json({
            success: true,
            encryptionKey: encryptionKey
        });
    } catch (error) {
        console.error('Error generating encryption key:', error);
        res.status(500).json({ error: error.message });
    }
});

// Health check
router.get('/health', async (req, res) => {
    const isHealthy = await ipfsService.healthCheck();

    res.json({
        success: true,
        healthy: isHealthy,
        service: 'IPFS'
    });
});

// Bulk upload multiple files
router.post('/upload-multiple', checkIPFSReady, upload.array('files', 10), async (req, res) => {
    try {
        if (!req.files || req.files.length === 0) {
            return res.status(400).json({ error: 'No files uploaded' });
        }

        const { encrypt = false } = req.body;
        const results = [];

        for (const file of req.files) {
            let encryptionKey = null;
            if (encrypt) {
                encryptionKey = ipfsService.generateEncryptionKey();
            }

            const result = await ipfsService.storeFile(file.path, encryptionKey);
            results.push({
                filename: file.originalname,
                ipfsHash: result.ipfsHash,
                encryptionKey: encryptionKey,
                size: result.size,
                encrypted: encrypt
            });

            // Clean up uploaded file
            fs.unlinkSync(file.path);
        }

        res.json({
            success: true,
            files: results,
            count: results.length
        });
    } catch (error) {
        console.error('Error uploading multiple files:', error);

        // Clean up any uploaded files
        if (req.files) {
            req.files.forEach(file => {
                if (fs.existsSync(file.path)) {
                    fs.unlinkSync(file.path);
                }
            });
        }

        res.status(500).json({ error: error.message });
    }
});

export default router;
