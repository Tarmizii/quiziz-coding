import React, { useState, useEffect } from 'react';
import { Shield, AlertTriangle, CheckCircle, XCircle, Filter } from 'lucide-react';
import { getAccessLogs } from '../../services/accessLogger';
import { AccessLog } from '../../types/auth';

export function AccessLogsViewer() {
  const [logs, setLogs] = useState<AccessLog[]>([]);
  const [filter, setFilter] = useState<'all' | 'success' | 'failed'>('all');

  useEffect(() => {
    const accessLogs = getAccessLogs();
    setLogs(accessLogs.reverse()); // Show newest first
  }, []);

  const filteredLogs = logs.filter(log => {
    if (filter === 'success') return log.success;
    if (filter === 'failed') return !log.success;
    return true;
  });

  const getActionIcon = (action: string, success: boolean) => {
    if (!success) return <XCircle className="w-4 h-4 text-red-500" />;
    
    switch (action) {
      case 'LOGIN':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'LOGOUT':
        return <CheckCircle className="w-4 h-4 text-blue-500" />;
      case 'REGISTER':
        return <CheckCircle className="w-4 h-4 text-purple-500" />;
      default:
        return <Shield className="w-4 h-4 text-gray-500" />;
    }
  };

  const getActionColor = (action: string, success: boolean) => {
    if (!success) return 'text-red-600 bg-red-50';
    
    switch (action) {
      case 'LOGIN':
        return 'text-green-600 bg-green-50';
      case 'LOGOUT':
        return 'text-blue-600 bg-blue-50';
      case 'REGISTER':
        return 'text-purple-600 bg-purple-50';
      default:
        return 'text-gray-600 bg-gray-50';
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-200">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Shield className="w-6 h-6 text-blue-600" />
            <h2 className="text-xl font-bold text-gray-900">Access Logs</h2>
          </div>
          <div className="flex items-center space-x-2">
            <Filter className="w-4 h-4 text-gray-400" />
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value as any)}
              className="px-3 py-1 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Events</option>
              <option value="success">Successful</option>
              <option value="failed">Failed</option>
            </select>
          </div>
        </div>
      </div>

      <div className="p-6">
        {filteredLogs.length === 0 ? (
          <div className="text-center py-8">
            <Shield className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">No access logs found</p>
          </div>
        ) : (
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {filteredLogs.map((log) => (
              <div
                key={log.id}
                className={`p-4 rounded-lg border ${
                  log.success ? 'border-gray-200' : 'border-red-200 bg-red-50'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-3">
                    {getActionIcon(log.action, log.success)}
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getActionColor(log.action, log.success)}`}>
                          {log.action.replace(/_/g, ' ')}
                        </span>
                        <span className="text-sm text-gray-600">
                          User: {log.userId}
                        </span>
                      </div>
                      <div className="text-xs text-gray-500 space-y-1">
                        <div>Time: {new Date(log.timestamp).toLocaleString()}</div>
                        <div>IP: {log.ipAddress}</div>
                        {log.errorMessage && (
                          <div className="text-red-600 font-medium">
                            Error: {log.errorMessage}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  {!log.success && (
                    <AlertTriangle className="w-5 h-5 text-red-500 flex-shrink-0" />
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}