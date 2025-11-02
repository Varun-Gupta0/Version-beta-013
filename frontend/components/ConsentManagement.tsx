import React, { useState, useEffect } from 'react';
import { Shield, Eye, EyeOff, UserCheck, UserX, Clock, CheckCircle, XCircle } from 'lucide-react';

interface ConsentRecord {
  id: string;
  requester: string;
  requesterType: 'doctor' | 'lab' | 'researcher' | 'insurance';
  purpose: string;
  dataTypes: string[];
  status: 'pending' | 'approved' | 'denied' | 'expired';
  requestedAt: string;
  expiresAt?: string;
  approvedAt?: string;
}

interface ConsentManagementProps {
  userRole?: 'patient' | 'doctor' | 'lab';
}

export default function ConsentManagement({ userRole = 'patient' }: ConsentManagementProps) {
  const [consents, setConsents] = useState<ConsentRecord[]>([]);
  const [activeTab, setActiveTab] = useState<'active' | 'pending' | 'history'>('active');
  const [showDetails, setShowDetails] = useState<string | null>(null);

  useEffect(() => {
    // Mock data - in real app, this would come from API
    const mockConsents: ConsentRecord[] = [
      {
        id: '1',
        requester: 'Dr. Sarah Johnson',
        requesterType: 'doctor',
        purpose: 'Cardiology consultation and treatment',
        dataTypes: ['Medical History', 'Vital Signs', 'Lab Results'],
        status: 'approved',
        requestedAt: '2024-01-10',
        approvedAt: '2024-01-10',
        expiresAt: '2024-07-10'
      },
      {
        id: '2',
        requester: 'City General Hospital Lab',
        requesterType: 'lab',
        purpose: 'Blood work analysis',
        dataTypes: ['Blood Samples', 'Test Results'],
        status: 'pending',
        requestedAt: '2024-01-15'
      },
      {
        id: '3',
        requester: 'MediResearch Institute',
        requesterType: 'researcher',
        purpose: 'Cardiovascular disease study',
        dataTypes: ['Anonymized Health Data', 'Demographics'],
        status: 'denied',
        requestedAt: '2024-01-05'
      }
    ];
    setConsents(mockConsents);
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'denied':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      case 'expired':
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved':
        return <CheckCircle className="w-4 h-4" />;
      case 'pending':
        return <Clock className="w-4 h-4" />;
      case 'denied':
        return <XCircle className="w-4 h-4" />;
      case 'expired':
        return <Clock className="w-4 h-4" />;
      default:
        return <Shield className="w-4 h-4" />;
    }
  };

  const getRequesterIcon = (type: string) => {
    switch (type) {
      case 'doctor':
        return '👨‍⚕️';
      case 'lab':
        return '🧪';
      case 'researcher':
        return '🔬';
      case 'insurance':
        return '🏛️';
      default:
        return '👤';
    }
  };

  const handleConsentAction = (consentId: string, action: 'approve' | 'deny' | 'revoke') => {
    setConsents(prev => prev.map(consent =>
      consent.id === consentId
        ? {
            ...consent,
            status: action === 'approve' ? 'approved' :
                   action === 'deny' ? 'denied' :
                   action === 'revoke' ? 'expired' : consent.status,
            approvedAt: action === 'approve' ? new Date().toISOString().split('T')[0] : consent.approvedAt
          }
        : consent
    ));
  };

  const filteredConsents = consents.filter(consent => {
    switch (activeTab) {
      case 'active':
        return consent.status === 'approved';
      case 'pending':
        return consent.status === 'pending';
      case 'history':
        return consent.status === 'denied' || consent.status === 'expired';
      default:
        return true;
    }
  });

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
      <div className="border-b border-gray-200 dark:border-gray-700">
        <nav className="flex">
          <button
            onClick={() => setActiveTab('active')}
            className={`px-6 py-3 text-sm font-medium ${
              activeTab === 'active'
                ? 'border-b-2 border-blue-500 text-blue-600 dark:text-blue-400'
                : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
            }`}
          >
            Active Consents ({consents.filter(c => c.status === 'approved').length})
          </button>
          <button
            onClick={() => setActiveTab('pending')}
            className={`px-6 py-3 text-sm font-medium ${
              activeTab === 'pending'
                ? 'border-b-2 border-blue-500 text-blue-600 dark:text-blue-400'
                : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
            }`}
          >
            Pending Requests ({consents.filter(c => c.status === 'pending').length})
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className={`px-6 py-3 text-sm font-medium ${
              activeTab === 'history'
                ? 'border-b-2 border-blue-500 text-blue-600 dark:text-blue-400'
                : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
            }`}
          >
            History ({consents.filter(c => c.status === 'denied' || c.status === 'expired').length})
          </button>
        </nav>
      </div>

      <div className="p-6">
        <div className="space-y-4">
          {filteredConsents.length === 0 ? (
            <div className="text-center py-8 text-gray-500 dark:text-gray-400">
              <Shield className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>No {activeTab} consents found</p>
            </div>
          ) : (
            filteredConsents.map((consent) => (
              <div key={consent.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="text-2xl">{getRequesterIcon(consent.requesterType)}</div>
                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-white">{consent.requester}</h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400 capitalize">{consent.requesterType}</p>
                    </div>
                  </div>
                  <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(consent.status)}`}>
                    {getStatusIcon(consent.status)}
                    {consent.status}
                  </span>
                </div>

                <div className="mb-3">
                  <p className="text-gray-700 dark:text-gray-300 mb-2">
                    <strong>Purpose:</strong> {consent.purpose}
                  </p>
                  <div className="flex flex-wrap gap-2 mb-2">
                    <span className="text-sm text-gray-500 dark:text-gray-400">Data Types:</span>
                    {consent.dataTypes.map((type, index) => (
                      <span key={index} className="inline-flex items-center px-2 py-1 bg-gray-100 dark:bg-gray-700 text-xs rounded">
                        {type}
                      </span>
                    ))}
                  </div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    Requested: {new Date(consent.requestedAt).toLocaleDateString()}
                    {consent.approvedAt && ` • Approved: ${new Date(consent.approvedAt).toLocaleDateString()}`}
                    {consent.expiresAt && ` • Expires: ${new Date(consent.expiresAt).toLocaleDateString()}`}
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <button
                    onClick={() => setShowDetails(showDetails === consent.id ? null : consent.id)}
                    className="flex items-center gap-2 text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 text-sm"
                  >
                    {showDetails === consent.id ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    {showDetails === consent.id ? 'Hide Details' : 'View Details'}
                  </button>

                  <div className="flex gap-2">
                    {consent.status === 'pending' && (
                      <>
                        <button
                          onClick={() => handleConsentAction(consent.id, 'approve')}
                          className="flex items-center gap-2 px-3 py-1 bg-green-500 text-white text-sm rounded hover:bg-green-600 transition-colors"
                        >
                          <UserCheck className="w-4 h-4" />
                          Approve
                        </button>
                        <button
                          onClick={() => handleConsentAction(consent.id, 'deny')}
                          className="flex items-center gap-2 px-3 py-1 bg-red-500 text-white text-sm rounded hover:bg-red-600 transition-colors"
                        >
                          <UserX className="w-4 h-4" />
                          Deny
                        </button>
                      </>
                    )}
                    {consent.status === 'approved' && (
                      <button
                        onClick={() => handleConsentAction(consent.id, 'revoke')}
                        className="flex items-center gap-2 px-3 py-1 bg-orange-500 text-white text-sm rounded hover:bg-orange-600 transition-colors"
                      >
                        <UserX className="w-4 h-4" />
                        Revoke
                      </button>
                    )}
                  </div>
                </div>

                {showDetails === consent.id && (
                  <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Detailed Information</h4>
                    <div className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
                      <p><strong>Consent ID:</strong> {consent.id}</p>
                      <p><strong>Requester Type:</strong> {consent.requesterType}</p>
                      <p><strong>Requested Data:</strong> {consent.dataTypes.join(', ')}</p>
                      <p><strong>Request Date:</strong> {new Date(consent.requestedAt).toLocaleString()}</p>
                      {consent.approvedAt && (
                        <p><strong>Approval Date:</strong> {new Date(consent.approvedAt).toLocaleString()}</p>
                      )}
                      {consent.expiresAt && (
                        <p><strong>Expiration Date:</strong> {new Date(consent.expiresAt).toLocaleString()}</p>
                      )}
                    </div>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
