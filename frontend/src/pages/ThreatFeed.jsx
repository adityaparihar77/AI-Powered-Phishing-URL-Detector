import { useState, useEffect } from 'react'
import axios from '../utils/axios'
import { AlertTriangle, Shield, ExternalLink, ChevronLeft, ChevronRight } from 'lucide-react'

export default function ThreatFeed() {
  const [threats, setThreats] = useState([])
  const [loading, setLoading] = useState(true)
  const [pagination, setPagination] = useState({ page: 1, limit: 20, total: 0, pages: 1 })
  const [filters, setFilters] = useState({ severity: '', threatType: '' })

  useEffect(() => {
    fetchThreats()
  }, [pagination.page, filters])

  const fetchThreats = async () => {
    try {
      const params = new URLSearchParams({
        page: pagination.page,
        limit: pagination.limit,
        ...(filters.severity && { severity: filters.severity }),
        ...(filters.threatType && { threatType: filters.threatType })
      })

      const response = await axios.get(`/threat/feed?${params}`)
      setThreats(response.data.threats)
      setPagination(response.data.pagination)
    } catch (error) {
      console.error('Failed to fetch threats:', error)
    } finally {
      setLoading(false)
    }
  }

  const handlePageChange = (newPage) => {
    setPagination(prev => ({ ...prev, page: newPage }))
    setLoading(true)
  }

  const getSeverityColor = (severity) => {
    const colors = {
      critical: 'bg-red-100 text-red-800 border-red-200',
      high: 'bg-orange-100 text-orange-800 border-orange-200',
      medium: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      low: 'bg-blue-100 text-blue-800 border-blue-200'
    }
    return colors[severity] || colors.medium
  }

  const getThreatIcon = (threatType) => {
    return <AlertTriangle className="w-5 h-5" />
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Threat Intelligence Feed</h1>
        <p className="text-gray-500 mt-1">Real-time threat data from multiple sources</p>
      </div>

      {/* Filters */}
      <div className="card">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Severity
            </label>
            <select
              value={filters.severity}
              onChange={(e) => setFilters({ ...filters, severity: e.target.value })}
              className="input-field"
            >
              <option value="">All Severities</option>
              <option value="critical">Critical</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Threat Type
            </label>
            <select
              value={filters.threatType}
              onChange={(e) => setFilters({ ...filters, threatType: e.target.value })}
              className="input-field"
            >
              <option value="">All Types</option>
              <option value="phishing">Phishing</option>
              <option value="malware">Malware</option>
              <option value="spam">Spam</option>
              <option value="suspicious">Suspicious</option>
            </select>
          </div>
        </div>
      </div>

      {/* Threat List */}
      {threats.length === 0 ? (
        <div className="card text-center py-12">
          <Shield className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500">No threats found matching your criteria</p>
        </div>
      ) : (
        <>
          <div className="space-y-4">
            {threats.map((threat) => (
              <div key={threat._id} className="card border-l-4 border-red-500">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-4 flex-1">
                    <div className="p-2 bg-red-50 rounded-lg">
                      {getThreatIcon(threat.threatType)}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-2">
                        <span className={`px-2 py-1 text-xs font-semibold rounded border ${getSeverityColor(threat.severity)}`}>
                          {threat.severity.toUpperCase()}
                        </span>
                        <span className="px-2 py-1 text-xs font-semibold rounded bg-gray-100 text-gray-800">
                          {threat.threatType}
                        </span>
                        <span className="px-2 py-1 text-xs font-semibold rounded bg-blue-100 text-blue-800">
                          {threat.source}
                        </span>
                      </div>
                      
                      <div className="flex items-center gap-2 mb-2">
                        <ExternalLink className="w-4 h-4 text-gray-400 flex-shrink-0" />
                        <span className="text-sm font-mono text-gray-900 break-all">
                          {threat.url}
                        </span>
                      </div>
                      
                      {threat.description && (
                        <p className="text-sm text-gray-600 mb-2">{threat.description}</p>
                      )}
                      
                      <div className="flex items-center gap-4 text-xs text-gray-500">
                        <span>Discovered: {new Date(threat.discoveredAt).toLocaleDateString()}</span>
                        <span>Last seen: {new Date(threat.lastSeenAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>

                  <div className={`px-2 py-1 text-xs font-semibold rounded ${
                    threat.isActive 
                      ? 'bg-red-100 text-red-800' 
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    {threat.isActive ? 'Active' : 'Inactive'}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-500">
              Showing {((pagination.page - 1) * pagination.limit) + 1} to{' '}
              {Math.min(pagination.page * pagination.limit, pagination.total)} of{' '}
              {pagination.total} threats
            </p>
            
            <div className="flex gap-2">
              <button
                onClick={() => handlePageChange(pagination.page - 1)}
                disabled={pagination.page === 1}
                className="btn-secondary disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1"
              >
                <ChevronLeft className="w-4 h-4" />
                Previous
              </button>
              
              <button
                onClick={() => handlePageChange(pagination.page + 1)}
                disabled={pagination.page >= pagination.pages}
                className="btn-secondary disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1"
              >
                Next
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
