import React from 'react';
import { FileText, Calendar, User, Activity } from 'lucide-react';

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

interface MedicalRecordCardProps {
  record: MedicalRecord;
  onViewDetails?: (record: MedicalRecord) => void;
  onDownload?: (record: MedicalRecord) => void;
}

export default function MedicalRecordCard({ record, onViewDetails, onDownload }: MedicalRecordCardProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      case 'completed':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case 'consultation':
        return '👨‍⚕️';
      case 'lab test':
        return '🧪';
      case 'prescription':
        return '💊';
      case 'imaging':
        return '📷';
      case 'surgery':
        return '🏥';
      default:
        return '📄';
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="text-2xl">{getTypeIcon(record.type)}</div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{record.type}</h3>
            <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400 mt-1">
              <div className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                {new Date(record.date).toLocaleDateString()}
              </div>
              <div className="flex items-center gap-1">
                <User className="w-4 h-4" />
                {record.doctor}
              </div>
            </div>
          </div>
        </div>
        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(record.status)}`}>
          {record.status}
        </span>
      </div>

      <div className="mb-4">
        <p className="text-gray-700 dark:text-gray-300">
          <strong>Diagnosis:</strong> {record.diagnosis}
        </p>
        {record.description && (
          <p className="text-gray-600 dark:text-gray-400 text-sm mt-2">{record.description}</p>
        )}
      </div>

      {record.attachments && record.attachments.length > 0 && (
        <div className="mb-4">
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
            Attachments: {record.attachments.length} file(s)
          </p>
          <div className="flex flex-wrap gap-2">
            {record.attachments.slice(0, 3).map((attachment, index) => (
              <span key={index} className="inline-flex items-center px-2 py-1 bg-gray-100 dark:bg-gray-700 text-xs rounded">
                📎 {attachment}
              </span>
            ))}
            {record.attachments.length > 3 && (
              <span className="inline-flex items-center px-2 py-1 bg-gray-100 dark:bg-gray-700 text-xs rounded">
                +{record.attachments.length - 3} more
              </span>
            )}
          </div>
        </div>
      )}

      <div className="flex gap-2">
        {onViewDetails && (
          <button
            onClick={() => onViewDetails(record)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white text-sm rounded-lg hover:bg-blue-600 transition-colors"
          >
            <FileText className="w-4 h-4" />
            View Details
          </button>
        )}
        {onDownload && (
          <button
            onClick={() => onDownload(record)}
            className="flex items-center gap-2 px-4 py-2 bg-gray-500 text-white text-sm rounded-lg hover:bg-gray-600 transition-colors"
          >
            <Activity className="w-4 h-4" />
            Download
          </button>
        )}
      </div>
    </div>
  );
}
