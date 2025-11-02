import { ethers } from 'ethers';
// import Web3 from 'web3'; // <-- Removed, was not used

// Contract ABIs (these will be generated after deployment)
import medicalRecordsABI from '../contracts/MedicalRecords.json';
import healthDataTokenABI from '../contracts/HealthDataToken.json';

declare global {
  interface Window {
    ethereum?: any;
  }
}

export class Web3Service {
  // ✅ FIX: Switched from BrowserProvider (v6) to Web3Provider (v5)
  private provider: ethers.providers.Web3Provider | null = null;
  private signer: ethers.Signer | null = null;
  // private web3: Web3 | null = null; // <-- Removed, was not used
  private medicalRecordsContract: ethers.Contract | null = null;
  private healthDataTokenContract: ethers.Contract | null = null;
  private isInitialized = false;

  // Contract addresses (will be loaded from deployment)
  private contractAddresses = {
    medicalRecords: process.env.NEXT_PUBLIC_MEDICAL_RECORDS_CONTRACT || '',
    healthDataToken: process.env.NEXT_PUBLIC_HEALTH_DATA_TOKEN_CONTRACT || ''
  };

  async initialize() {
    if (typeof window === 'undefined' || !window.ethereum) {
      throw new Error('MetaMask not detected. Please install MetaMask.');
    }

    try {
      // Request account access
      await window.ethereum.request({ method: 'eth_requestAccounts' });

      // ✅ FIX: Switched from BrowserProvider (v6) to Web3Provider (v5)
      this.provider = new ethers.providers.Web3Provider(window.ethereum);
      
      // This is correct for v5 (it's synchronous)
      this.signer = this.provider.getSigner();

      // this.web3 = new Web3(window.ethereum); // <-- Removed, was not used

      // Initialize contracts if addresses are available
      if (this.contractAddresses.medicalRecords) {
        this.medicalRecordsContract = new ethers.Contract(
          this.contractAddresses.medicalRecords,
          medicalRecordsABI,
          this.signer
        );
      }

      if (this.contractAddresses.healthDataToken) {
        this.healthDataTokenContract = new ethers.Contract(
          this.contractAddresses.healthDataToken,
          healthDataTokenABI,
          this.signer
        );
      }

      this.isInitialized = true;
      console.log('Web3 service initialized successfully');
    } catch (error) {
      console.error('Failed to initialize Web3 service:', error);
      throw error;
    }
  }

  async getAccount(): Promise<string> {
    if (!this.signer) throw new Error('Web3 not initialized');
    return await this.signer.getAddress();
  }

  async getBalance(): Promise<string> {
    if (!this.signer) throw new Error('Web3 not initialized');
    const address = await this.getAccount();
    const balance = await this.provider!.getBalance(address);
    // Correct for v5
    return ethers.utils.formatEther(balance);
  }

  async switchToNetwork(chainId: string) {
    if (!window.ethereum) throw new Error('MetaMask not available');

    try {
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: chainId }],
      });
    } catch (switchError: any) {
      // This error code indicates that the chain has not been added to MetaMask
      if (switchError.code === 4902) {
        throw new Error('Please add the network to MetaMask first');
      }
      throw switchError;
    }
  }

  // Medical Records Contract Functions
  async createMedicalRecord(
    patientAddress: string,
    ipfsHash: string,
    recordType: string,
    encryptedKey: string = ''
  ) {
    if (!this.medicalRecordsContract) throw new Error('MedicalRecords contract not initialized');

    try {
      const tx = await this.medicalRecordsContract.createRecord(
        patientAddress,
        ipfsHash,
        recordType,
        encryptedKey
      );
      return await tx.wait();
    } catch (error) {
      console.error('Error creating medical record:', error);
      throw error;
    }
  }

  async getPatientRecords(patientAddress: string) {
    if (!this.medicalRecordsContract) throw new Error('MedicalRecords contract not initialized');

    try {
      const records = await this.medicalRecordsContract.getPatientRecords(patientAddress);
      // .toNumber() is correct for v5 (BigNumber)
      return records.map((record: any) => ({
        ipfsHash: record.ipfsHash,
        recordType: record.recordType,
        timestamp: record.timestamp.toNumber(), 
        provider: record.provider,
        isActive: record.isActive,
        encryptedKey: record.encryptedKey
      }));
    } catch (error) {
      console.error('Error getting patient records:', error);
      throw error;
    }
  }

  async grantConsent(providerAddress: string, purpose: string, duration: number) {
    if (!this.medicalRecordsContract) throw new Error('MedicalRecords contract not initialized');

    try {
      const tx = await this.medicalRecordsContract.grantConsent(
        providerAddress,
        purpose,
        duration
      );
      return await tx.wait();
    } catch (error) {
      console.error('Error granting consent:', error);
      throw error;
    }
  }

  async revokeConsent(providerAddress: string) {
    if (!this.medicalRecordsContract) throw new Error('MedicalRecords contract not initialized');

    try {
      const tx = await this.medicalRecordsContract.revokeConsent(providerAddress);
      return await tx.wait();
    } catch (error) {
      console.error('Error revoking consent:', error);
      throw error;
    }
  }

  async hasActiveConsent(patientAddress: string, providerAddress: string): Promise<boolean> {
    if (!this.medicalRecordsContract) throw new Error('MedicalRecords contract not initialized');

    try {
      return await this.medicalRecordsContract.hasActiveConsent(patientAddress, providerAddress);
    } catch (error) {
      console.error('Error checking consent:', error);
      throw error;
    }
  }

  // Health Data Token Functions
  async stakeTokens(amount: string) {
    if (!this.healthDataTokenContract) throw new Error('HealthDataToken contract not initialized');

    try {
      // ethers.utils is correct for v5
      const amountWei = ethers.utils.parseEther(amount);
      const tx = await this.healthDataTokenContract.stake(amountWei);
      return await tx.wait();
    } catch (error) {
      console.error('Error staking tokens:', error);
      throw error;
    }
  }

  async unstakeTokens(amount: string) {
    if (!this.healthDataTokenContract) throw new Error('HealthDataToken contract not initialized');

    try {
      // ethers.utils is correct for v5
      const amountWei = ethers.utils.parseEther(amount);
      const tx = await this.healthDataTokenContract.unstake(amountWei);
      return await tx.wait();
    } catch (error) {
      console.error('Error unstaking tokens:', error);
      throw error;
    }
  }

  async claimStakingReward() {
    if (!this.healthDataTokenContract) throw new Error('HealthDataToken contract not initialized');

    try {
      const tx = await this.healthDataTokenContract.claimReward();
      return await tx.wait();
    } catch (error) {
      console.error('Error claiming reward:', error);
      throw error;
    }
  }

  async getTokenBalance(address?: string): Promise<string> {
    if (!this.healthDataTokenContract) throw new Error('HealthDataToken contract not initialized');

    try {
      const accountAddress = address || await this.getAccount();
      const balance = await this.healthDataTokenContract.balanceOf(accountAddress);
      // ethers.utils is correct for v5
      return ethers.utils.formatEther(balance);
    } catch (error) {
      console.error('Error getting token balance:', error);
      throw error;
    }
  }

  async getStakeInfo(address?: string) {
    if (!this.healthDataTokenContract) throw new Error('HealthDataToken contract not initialized');

    try {
      const accountAddress = address || await this.getAccount();
      const stakeInfo = await this.healthDataTokenContract.getStakeInfo(accountAddress);
      // .toNumber() and ethers.utils are correct for v5
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
  async getNetwork() {
    if (!this.provider) throw new Error('Provider not initialized');
    return await this.provider.getNetwork();
  }

  async getGasPrice() {
    if (!this.provider) throw new Error('Provider not initialized');
    const gasPrice = await this.provider.getGasPrice();
    // ethers.utils is correct for v5
    return ethers.utils.formatUnits(gasPrice, 'gwei');
  }

  // Event Listeners
  onAccountsChanged(callback: (accounts: string[]) => void) {
    if (window.ethereum) {
      window.ethereum.on('accountsChanged', callback);
    }
  }

  onChainChanged(callback: (chainId: string) => void) {
    if (window.ethereum) {
      window.ethereum.on('chainChanged', callback);
    }
  }

  removeAllListeners() {
    if (window.ethereum) {
      window.ethereum.removeAllListeners();
    }
  }

  isReady(): boolean {
    return this.isInitialized;
  }

  disconnect() {
    this.provider = null;
    this.signer = null;
    // this.web3 = null; // <-- Removed
    this.medicalRecordsContract = null;
    this.healthDataTokenContract = null;
    this.isInitialized = false;
  }
}

// Export singleton instance
export const web3Service = new Web3Service();
export default web3Service;