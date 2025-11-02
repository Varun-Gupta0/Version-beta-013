"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import MedicalRecordCard from '../../components/MedicalRecordCard';
import HealthMetricsChart from '../../components/HealthMetricsChart';
import ConsentManagement from '../../components/ConsentManagement';
import AiInsights from '../../components/AiInsights';
import WalletConnect from '../../components/WalletConnect';
import { Wallet, Coins, TrendingUp, Shield } from 'lucide-react';

interface MedicalRecord {
  id: string;
  type: string;
  date: string;
  doctor: string;
  diagnosis: string;
  status: 'active' | 'completed' | 'pending';
  description?: string;
  attachments?: string[];
}

interface HealthMetric {
  id: string;
  type: string;
  value: string;
  unit: string;
  date: string;
  status: 'normal' | 'warning' | 'critical';
}

interface Appointment {
  id: string;
  doctor: string;
  specialty: string;
  date: string;
  time: string;
  type: 'consultation' | 'follow-up' | 'emergency';
  status: 'scheduled' | 'confirmed' | 'completed' | 'cancelled';
}

interface BlockchainStats {
  walletAddress: string;
  tokenBalance: string;
  stakedAmount: string;
  rewardsEarned: string;
}

export default function Dashboard() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('overview');
  const [userRole, setUserRole] = useState<'patient' | 'doctor' | 'lab'>('patient');
  const [blockchainStats, setBlockchainStats] = useState<BlockchainStats>({
    walletAddress: '',
    tokenBalance: '0',
    stakedAmount: '0',
    rewardsEarned: '0'
  });

  // Enhanced mock data - in real app, this would come from API
  const [medicalRecords] = useState<MedicalRecord[]>([
    {
      id: '1',
      type: 'Consultation',
      date: '2024-01-15',
      doctor: 'Dr. Sarah Johnson',
      diagnosis: 'Hypertension',
      status: 'active',
      description: 'Patient presented with elevated blood pressure readings. Recommended lifestyle modifications and monitoring.',
      attachments: ['blood_pressure_chart.pdf', 'consultation_notes.pdf']
    },
    {
      id: '2',
      type: 'Lab Test',
      date: '2024-01-10',
      doctor: 'Dr. Michael Chen',
      diagnosis: 'Blood Work',
      status: 'completed',
      description: 'Complete blood count and metabolic panel. All values within normal range except slightly elevated cholesterol.',
      attachments: ['lab_results.pdf', 'cholesterol_report.pdf']
    },
    {
      id: '3',
      type: 'Imaging',
      date: '2024-01-05',
      doctor: 'Dr. Emily Davis',
      diagnosis: 'Chest X-Ray',
      status: 'completed',
      description: 'Routine chest X-ray as part of annual physical. No abnormalities detected.',
      attachments: ['chest_xray.pdf', 'radiology_report.pdf']
    }
  ]);

  const [healthMetrics] = useState<HealthMetric[]>([
    {
      id: '1',
      type: 'Blood Pressure',
      value: '120/80',
      unit: 'mmHg',
      date: '2024-01-15',
      status: 'normal'
    },
    {
      id: '2',
      type: 'Blood Pressure',
      value: '125/82',
      unit: 'mmHg',
      date: '2024-01-10',
      status: 'normal'
    },
    {
      id: '3',
      type: 'Blood Pressure',
      value: '118/78',
      unit: 'mmHg',
      date: '2024-01-05',
      status: 'normal'
    },
    {
      id: '4',
      type: 'Heart Rate',
      value: '72',
      unit: 'bpm',
      date: '2024-01-15',
      status: 'normal'
    },
    {
      id: '5',
      type: 'Heart Rate',
      value: '75',
      unit: 'bpm',
      date: '2024-01-10',
      status: 'normal'
    },
    {
      id: '6',
      type: 'Temperature',
      value: '98.6',
      unit: '°F',
      date: '2024-01-15',
      status: 'normal'
    },
    {
      id: '7',
      type: 'Temperature',
      value: '98.4',
      unit: '°F',
      date: '2024-01-10',
      status: 'normal'
    }
  ]);

  const [appointments] = useState<Appointment[]>([
    {
      id: '1',
      doctor: 'Dr. Sarah Johnson',
      specialty: 'Cardiology',
      date: '2024-01-20',
      time: '10:00 AM',
      type: 'follow-up',
      status: 'scheduled'
    },
    {
      id: '2',
      doctor: 'Dr. Michael Chen',
      specialty: 'General Medicine',
      date: '2024-01-25',
      time: '2:30 PM',
      type: 'consultation',
      status: 'confirmed'
    }
  ]);

  useEffect(() => {
    // Check user authentication and role
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('userRole') as 'patient' | 'doctor' | 'lab';

    if (!token) {
      router.push('/auth');
      return;
    }

    if (role) {
      setUserRole(role);
    }

    // Load blockchain stats (mock data for now)
    loadBlockchainStats();
  }, [router]);

  const loadBlockchainStats = async () => {
    // In real app, this would connect to blockchain
    setBlockchainStats({
      walletAddress: '0x742d35Cc6634C0532925a3b844Bc454e4438f44e',
      tokenBalance: '1,250.50',
      stakedAmount: '500.00',
      rewardsEarned: '45.25'
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'normal':
      case 'completed':
      case 'confirmed':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'warning':
      case 'pending':
      case 'scheduled':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'critical':
      case 'cancelled':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200';
    }
  };

  const handleViewRecordDetails = (record: MedicalRecord) => {
    // In real app, this would open a modal or navigate to detailed view
    console.log('Viewing record details:', record);
  };

  const handleDownloadRecord = (record: MedicalRecord) => {
    // In real app, this would trigger download
    console.log('Downloading record:', record);
  };

  const handleStakeTokens = async () => {
    // In real app, this would call blockchain service
    console.log('Staking tokens...');
  };

  const handleClaimRewards = async () => {
    // In real app, this would call blockchain service
    console.log('Claiming rewards...');
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            {userRole === 'patient' ? 'Patient Dashboard' :
             userRole === 'doctor' ? 'Doctor Dashboard' : 'Lab Dashboard'}
          </h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            Welcome back! Here's your health overview.
          </p>
        </div>

        {/* Wallet Connection */}
        <div className="mb-8">
          <WalletConnect />
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-6 mb-8">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Records</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{medicalRecords.length}</p>
              </div>
              <div className="text-blue-500 text-2xl">📄</div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Active Conditions</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {medicalRecords.filter(r => r.status === 'active').length}
                </p>
              </div>
              <div className="text-red-500 text-2xl">❤️</div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Upcoming Appointments</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{appointments.length}</p>
              </div>
              <div className="text-green-500 text-2xl">📅</div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Token Balance</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{blockchainStats.tokenBalance}</p>
              </div>
              <Coins className="w-8 h-8 text-yellow-500" />
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Staked Amount</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{blockchainStats.stakedAmount}</p>
              </div>
              <Shield className="w-8 h-8 text-purple-500" />
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Rewards Earned</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{blockchainStats.rewardsEarned}</p>
              </div>
              <TrendingUp className="w-8 h-8 text-green-500" />
            </div>
          </div>
        </div>

        {/* Main Content Tabs */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
          <div className="border-b border-gray-200 dark:border-gray-700">
            <nav className="flex">
              <button
                onClick={() => setActiveTab('overview')}
                className={`px-6 py-3 text-sm font-medium ${
                  activeTab === 'overview'
                    ? 'border-b-2 border-blue-500 text-blue-600 dark:text-blue-400'
                    : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
                }`}
              >
                Overview
              </button>
              <button
                onClick={() => setActiveTab('records')}
                className={`px-6 py-3 text-sm font-medium ${
                  activeTab === 'records'
                    ? 'border-b-2 border-blue-500 text-blue-600 dark:text-blue-400'
                    : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
                }`}
              >
                Medical Records
              </button>
              <button
                onClick={() => setActiveTab('appointments')}
                className={`px-6 py-3 text-sm font-medium ${
                  activeTab === 'appointments'
                    ? 'border-b-2 border-blue-500 text-blue-600 dark:text-blue-400'
                    : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
                }`}
              >
                Appointments
              </button>
              <button
                onClick={() => setActiveTab('analytics')}
                className={`px-6 py-3 text-sm font-medium ${
                  activeTab === 'analytics'
                    ? 'border-b-2 border-blue-500 text-blue-600 dark:text-blue-400'
                    : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
                }`}
              >
                Analytics
              </button>
              <button
                onClick={() => setActiveTab('consent')}
                className={`px-6 py-3 text-sm font-medium ${
                  activeTab === 'consent'
                    ? 'border-b-2 border-blue-500 text-blue-600 dark:text-blue-400'
                    : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
                }`}
              >
                Consent
              </button>
              <button
                onClick={() => setActiveTab('blockchain')}
                className={`px-6 py-3 text-sm font-medium ${
                  activeTab === 'blockchain'
                    ? 'border-b-2 border-blue-500 text-blue-600 dark:text-blue-400'
                    : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
                }`}
              >
                Blockchain
              </button>
            </nav>
          </div>

          <div className="p-6">
            {activeTab === 'overview' && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Recent Health Metrics */}
                  <div className="bg-gray-50 dark:bg-gray-700 p-6 rounded-lg">
                    <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white flex items-center gap-2">
                      <span className="text-2xl">📊</span>
                      Recent Health Metrics
                    </h3>
                    <div className="space-y-4">
                      {healthMetrics.slice(0, 3).map((metric) => (
                        <div key={metric.id} className="flex items-center justify-between p-3 bg-white dark:bg-gray-800 rounded-lg">
                          <div className="flex items-center gap-3">
                            <div className="text-2xl">
                              {metric.type === 'Blood Pressure' && '🩸'}
                              {metric.type === 'Heart Rate' && '❤️'}
                              {metric.type === 'Temperature' && '🌡️'}
                            </div>
                            <div>
                              <p className="font-medium text-gray-900 dark:text-white">{metric.type}</p>
                              <p className="text-sm text-gray-500 dark:text-gray-400">{metric.date}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="font-semibold text-gray-900 dark:text-white">{metric.value} {metric.unit}</p>
                            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(metric.status)}`}>
                              {metric.status}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Upcoming Appointments */}
                  <div className="bg-gray-50 dark:bg-gray-700 p-6 rounded-lg">
                    <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white flex items-center gap-2">
                      <span className="text-2xl">📅</span>
                      Upcoming Appointments
                    </h3>
                    <div className="space-y-4">
                      {appointments.map((appointment) => (
                        <div key={appointment.id} className="flex items-center justify-between p-3 bg-white dark:bg-gray-800 rounded-lg">
                          <div className="flex items-center gap-3">
                            <div className="text-2xl">👨‍⚕️</div>
                            <div>
                              <p className="font-medium text-gray-900 dark:text-white">{appointment.doctor}</p>
                              <p className="text-sm text-gray-500 dark:text-gray-400">{appointment.specialty}</p>
                              <p className="text-sm text-gray-500 dark:text-gray-400">{appointment.date} at {appointment.time}</p>
                            </div>
                          </div>
                          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(appointment.status)}`}>
                            {appointment.status}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* AI Insights */}
                <AiInsights limit={3} />

                {/* Quick Actions */}
                <div className="bg-gray-50 dark:bg-gray-700 p-6 rounded-lg">
                  <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Quick Actions</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <button className="p-4 bg-white dark:bg-gray-800 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors">
                      <div className="text-center">
                        <div className="text-2xl mb-2">📅</div>
                        <p className="text-sm font-medium text-gray-900 dark:text-white">Schedule Appointment</p>
                      </div>
                    </button>
                    <button className="p-4 bg-white dark:bg-gray-800 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors">
                      <div className="text-center">
                        <div className="text-2xl mb-2">📄</div>
                        <p className="text-sm font-medium text-gray-900 dark:text-white">View Records</p>
                      </div>
                    </button>
                    <button className="p-4 bg-white dark:bg-gray-800 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors">
                      <div className="text-center">
                        <div className="text-2xl mb-2">🛡️</div>
                        <p className="text-sm font-medium text-gray-900 dark:text-white">Manage Consent</p>
                      </div>
                    </button>
                    <button className="p-4 bg-white dark:bg-gray-800 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors">
                      <div className="text-center">
                        <div className="text-2xl mb-2">👥</div>
                        <p className="text-sm font-medium text-gray-900 dark:text-white">Share Data</p>
                      </div>
                    </button>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'records' && (
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Medical Records</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {medicalRecords.map((record) => (
                    <MedicalRecordCard
                      key={record.id}
                      record={record}
                      onViewDetails={handleViewRecordDetails}
                      onDownload={handleDownloadRecord}
                    />
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'appointments' && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Appointments</h3>
                {appointments.map((appointment) => (
                  <div key={appointment.id} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <div className="flex items-center gap-4">
                      <div className="text-2xl">👨‍⚕️</div>
                      <div>
                        <h4 className="font-semibold text-gray-900 dark:text-white">{appointment.doctor}</h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{appointment.specialty}</p>
                        <p className="text-sm text-gray-500 dark:text-gray-500">{appointment.date} at {appointment.time}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(appointment.status)}`}>
                        {appointment.status}
                      </span>
                      <button className="px-3 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors">
                        {appointment.status === 'scheduled' ? 'Confirm' : 'View Details'}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'analytics' && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <HealthMetricsChart metrics={healthMetrics} type="Blood Pressure" />
                  <HealthMetricsChart metrics={healthMetrics} type="Heart Rate" />
                </div>

                <AiInsights />
              </div>
            )}

            {activeTab === 'consent' && (
              <ConsentManagement userRole={userRole} />
            )}

            {activeTab === 'blockchain' && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Wallet Information */}
                  <div className="bg-gray-50 dark:bg-gray-700 p-6 rounded-lg">
                    <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white flex items-center gap-2">
                      <Wallet className="w-6 h-6 text-blue-500" />
                      Wallet Information
                    </h3>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600 dark:text-gray-400">Address:</span>
                        <span className="font-mono text-sm text-gray-900 dark:text-white">
                          {blockchainStats.walletAddress.slice(0, 6)}...{blockchainStats.walletAddress.slice(-4)}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600 dark:text-gray-400">Token Balance:</span>
                        <span className="font-semibold text-gray-900 dark:text-white">{blockchainStats.tokenBalance} HDT</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600 dark:text-gray-400">Staked Amount:</span>
                        <span className="font-semibold text-gray-900 dark:text-white">{blockchainStats.stakedAmount} HDT</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600 dark:text-gray-400">Rewards Earned:</span>
                        <span className="font-semibold text-green-600 dark:text-green-400">{blockchainStats.rewardsEarned} HDT</span>
                      </div>
                    </div>
                  </div>

                  {/* Staking Actions */}
                  <div className="bg-gray-50 dark:bg-gray-700 p-6 rounded-lg">
                    <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white flex items-center gap-2">
                      <Shield className="w-6 h-6 text-purple-500" />
                      Staking Actions
                    </h3>
                    <div className="space-y-4">
                      <button
                        onClick={handleStakeTokens}
                        className="w-full px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600 transition-colors"
                      >
                        Stake Tokens
                      </button>
                      <button
                        onClick={handleClaimRewards}
                        className="w-full px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors"
                      >
                        Claim Rewards
                      </button>
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        Earn rewards by staking your Health Data Tokens and contributing to the network security.
                      </div>
                    </div>
                  </div>
                </div>

                {/* Transaction History */}
                <div className="bg-gray-50 dark:bg-gray-700 p-6 rounded-lg">
                  <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Recent Transactions</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center p-3 bg-white dark:bg-gray-800 rounded">
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">Staked 100 HDT</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">2024-01-15 14:30</p>
                      </div>
                      <span className="text-green-600 dark:text-green-400">+100 HDT</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-white dark:bg-gray-800 rounded">
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">Reward Claimed</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">2024-01-10 09:15</p>
                      </div>
                      <span className="text-green-600 dark:text-green-400">+5.25 HDT</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-white dark:bg-gray-800 rounded">
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">Data Shared</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">2024-01-05 16:45</p>
                      </div>
                      <span className="text-blue-600 dark:text-blue-400">+2.50 HDT</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
