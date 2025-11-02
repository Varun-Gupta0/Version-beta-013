import { create } from 'ipfs-http-client';
import fs from 'fs/promises';
import crypto from 'crypto';
import { fileURLToPath } from 'url';
import path from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

class IPFSService {
    constructor() {
        this.ipfs = null;
        this.isInitialized = false;
    }

    async initialize() {
        try {
            // Connect to IPFS node
            const ipfsUrl = process.env.IPFS_URL || 'http://127.0.0.1:5001';
            this.ipfs = create({ url: ipfsUrl });

            // Test connection
            await this.ipfs.id();
            this.isInitialized = true;
            console.log('IPFS service initialized successfully');
        } catch (error) {
            console.error('Failed to initialize IPFS service:', error);
            // Fallback to public IPFS gateway for read-only operations
            this.ipfs = create({ url: 'https://ipfs.infura.io:5001' });
            console.log('Using public IPFS gateway as fallback');
        }
    }

    // Encrypt data before storing on IPFS
    encryptData(data, key) {
        const cipher = crypto.createCipher('aes-256-cbc', key);
        let encrypted = cipher.update(JSON.stringify(data), 'utf8', 'hex');
        encrypted += cipher.final('hex');
        return encrypted;
    }

    // Decrypt data retrieved from IPFS
    decryptData(encryptedData, key) {
        const decipher = crypto.createDecipher('aes-256-cbc', key);
        let decrypted = decipher.update(encryptedData, 'hex', 'utf8');
        decrypted += decipher.final('utf8');
        return JSON.parse(decrypted);
    }

    // Generate encryption key
    generateEncryptionKey() {
        return crypto.randomBytes(32).toString('hex');
    }

    // Store medical record on IPFS
    async storeMedicalRecord(recordData, encryptionKey = null) {
        if (!this.isInitialized) throw new Error('IPFS service not initialized');

        try {
            let dataToStore = recordData;

            // Encrypt data if key provided
            if (encryptionKey) {
                dataToStore = this.encryptData(recordData, encryptionKey);
            }

            // Add metadata
            const recordWithMetadata = {
                data: dataToStore,
                timestamp: new Date().toISOString(),
                version: '1.0',
                encrypted: !!encryptionKey
            };

            // Convert to buffer and add to IPFS
            const buffer = Buffer.from(JSON.stringify(recordWithMetadata));
            const result = await this.ipfs.add(buffer);

            return {
                ipfsHash: result.cid.toString(),
                encryptionKey: encryptionKey,
                size: result.size
            };
        } catch (error) {
            console.error('Error storing medical record on IPFS:', error);
            throw error;
        }
    }

    // Retrieve medical record from IPFS
    async retrieveMedicalRecord(ipfsHash, encryptionKey = null) {
        if (!this.isInitialized) throw new Error('IPFS service not initialized');

        try {
            // Retrieve data from IPFS
            const stream = this.ipfs.cat(ipfsHash);
            let data = '';

            for await (const chunk of stream) {
                data += chunk.toString();
            }

            const recordWithMetadata = JSON.parse(data);

            let recordData = recordWithMetadata.data;

            // Decrypt if encrypted
            if (recordWithMetadata.encrypted && encryptionKey) {
                recordData = this.decryptData(recordData, encryptionKey);
            }

            return {
                data: recordData,
                metadata: {
                    timestamp: recordWithMetadata.timestamp,
                    version: recordWithMetadata.version,
                    encrypted: recordWithMetadata.encrypted
                }
            };
        } catch (error) {
            console.error('Error retrieving medical record from IPFS:', error);
            throw error;
        }
    }

    // Store file on IPFS (for medical images, documents, etc.)
    async storeFile(filePath, encryptionKey = null) {
        if (!this.isInitialized) throw new Error('IPFS service not initialized');

        try {
            // Read file
            const fileBuffer = await fs.readFile(filePath);

            let dataToStore = fileBuffer;

            // Encrypt if key provided
            if (encryptionKey) {
                const cipher = crypto.createCipher('aes-256-cbc', encryptionKey);
                dataToStore = Buffer.concat([
                    cipher.update(fileBuffer),
                    cipher.final()
                ]);
            }

            // Add to IPFS
            const result = await this.ipfs.add(dataToStore);

            return {
                ipfsHash: result.cid.toString(),
                encryptionKey: encryptionKey,
                size: result.size,
                originalSize: fileBuffer.length
            };
        } catch (error) {
            console.error('Error storing file on IPFS:', error);
            throw error;
        }
    }

    // Retrieve file from IPFS
    async retrieveFile(ipfsHash, outputPath, encryptionKey = null) {
        if (!this.isInitialized) throw new Error('IPFS service not initialized');

        try {
            // Retrieve data from IPFS
            const stream = this.ipfs.cat(ipfsHash);
            let data = Buffer.alloc(0);

            for await (const chunk of stream) {
                data = Buffer.concat([data, chunk]);
            }

            let fileData = data;

            // Decrypt if encrypted
            if (encryptionKey) {
                const decipher = crypto.createDecipher('aes-256-cbc', encryptionKey);
                fileData = Buffer.concat([
                    decipher.update(data),
                    decipher.final()
                ]);
            }

            // Write to file
            await fs.writeFile(outputPath, fileData);

            return {
                path: outputPath,
                size: fileData.length
            };
        } catch (error) {
            console.error('Error retrieving file from IPFS:', error);
            throw error;
        }
    }

    // Pin content to ensure persistence
    async pinContent(ipfsHash) {
        if (!this.isInitialized) throw new Error('IPFS service not initialized');

        try {
            await this.ipfs.pin.add(ipfsHash);
            return true;
        } catch (error) {
            console.error('Error pinning content:', error);
            throw error;
        }
    }

    // Unpin content
    async unpinContent(ipfsHash) {
        if (!this.isInitialized) throw new Error('IPFS service not initialized');

        try {
            await this.ipfs.pin.rm(ipfsHash);
            return true;
        } catch (error) {
            console.error('Error unpinning content:', error);
            throw error;
        }
    }

    // Get content stats
    async getContentStats(ipfsHash) {
        if (!this.isInitialized) throw new Error('IPFS service not initialized');

        try {
            const stats = await this.ipfs.object.stat(ipfsHash);
            return {
                hash: ipfsHash,
                size: stats.CumulativeSize,
                links: stats.NumLinks
            };
        } catch (error) {
            console.error('Error getting content stats:', error);
            throw error;
        }
    }

    // Create directory structure for organized storage
    async createDirectory(files) {
        if (!this.isInitialized) throw new Error('IPFS service not initialized');

        try {
            const result = await this.ipfs.addAll(files, { wrapWithDirectory: true });
            let rootHash = '';

            for await (const file of result) {
                if (file.path === '') {
                    rootHash = file.cid.toString();
                }
            }

            return rootHash;
        } catch (error) {
            console.error('Error creating directory:', error);
            throw error;
        }
    }

    // Health check
    async healthCheck() {
        try {
            if (!this.isInitialized) return false;
            await this.ipfs.id();
            return true;
        } catch (error) {
            return false;
        }
    }

    isReady() {
        return this.isInitialized;
    }
}

// Export singleton instance
const ipfsService = new IPFSService();

export default ipfsService;
