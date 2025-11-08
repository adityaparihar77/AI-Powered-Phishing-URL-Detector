import { useState } from 'react'
import axios from '../utils/axios'
import { toast } from 'react-toastify'
import { Search, AlertTriangle, CheckCircle, Shield, ExternalLink } from 'lucide-react'

export default function URLAnalyzer() {
  const [url, setUrl] = useState('')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)
  const [scanId, setScanId] = useState(null)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setResult(null)

    try {
      // Start analysis
      const response = await axios.post('/url/analyze', { url })
      setScanId(response.data.scanId)
      toast.info('Analysis started. Fetching results...')

      // Poll for results
      setTimeout(() => fetchResult(response.data.scanId), 2000)
    } catch (error) {
      toast.error(error.response?.data?.message || 'Analysis failed')
      setLoading(false)
    }
  }

  const fetchResult = async (id) => {
    try {
      const response = await axios.get(`/url/scan/${id}`)
      const scan = response.data.scan

      if (scan.status === 'completed') {
        setResult(scan)
        setLoading(false)
        
        if (scan.prediction.isPhishing) {
          toast.error('⚠️ Phishing URL detected!')
        } else {
          toast.success('✅ URL appears safe')
        }
      } else if (scan.status === 'failed') {
        toast.error('Analysis failed: ' + scan.error)
        setLoading(false)
      } else {
        // Still pending, poll again
        setTimeout(() => fetchResult(id), 2000)
      }
    } catch (error) {
      toast.error('Failed to fetch results')
      setLoading(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">URL Analyzer</h1>
        <p className="text-gray-500 mt-1">Check if a URL is safe or potentially malicious</p>
      </div>

      {/* Input Form */}
      <div className="card">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Enter URL to analyze
            </label>
            <div className="flex gap-3">
              <input
                type="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                className="input-field flex-1"
                placeholder="https://example.com"
                required
                disabled={loading}
              />
              <button
                type="submit"
                disabled={loading}
                className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                <Search className="w-4 h-4" />
                {loading ? 'Analyzing...' : 'Analyze'}
              </button>
            </div>
          </div>
        </form>
      </div>

      {/* Results */}
      {result && (
        <div className="space-y-6">
          {/* Main Result */}
          <div className={`card border-l-4 ${
            result.prediction.isPhishing 
              ? 'border-red-500 bg-red-50' 
              : 'border-green-500 bg-green-50'
          }`}>
            <div className="flex items-start gap-4">
              {result.prediction.isPhishing ? (
                <AlertTriangle className="w-12 h-12 text-red-600 flex-shrink-0" />
              ) : (
                <CheckCircle className="w-12 h-12 text-green-600 flex-shrink-0" />
              )}
              
              <div className="flex-1">
                <h2 className={`text-2xl font-bold mb-2 ${
                  result.prediction.isPhishing ? 'text-red-900' : 'text-green-900'
                }`}>
                  {result.prediction.isPhishing ? 'Phishing Detected' : 'URL Appears Safe'}
                </h2>
                <p className={`mb-4 ${
                  result.prediction.isPhishing ? 'text-red-700' : 'text-green-700'
                }`}>
                  Confidence: {(result.prediction.confidence * 100).toFixed(1)}%
                </p>
                
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <ExternalLink className="w-4 h-4" />
                  <span className="font-mono break-all">{result.url}</span>
                </div>
              </div>
            </div>
          </div>

          {/* URL Details */}
          <div className="card">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">URL Details</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500">Domain</p>
                <p className="font-medium">{result.domain}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Protocol</p>
                <p className="font-medium">{result.protocol}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Scan Date</p>
                <p className="font-medium">{new Date(result.scanDate).toLocaleString()}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Status</p>
                <p className="font-medium capitalize">{result.status}</p>
              </div>
            </div>
          </div>

          {/* Threat Intelligence */}
          {(result.threatIntel?.virusTotal || result.threatIntel?.phishTank) && (
            <div className="card">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Shield className="w-5 h-5" />
                Threat Intelligence
              </h3>
              
              <div className="space-y-4">
                {result.threatIntel.virusTotal && (
                  <div className="border-l-4 border-blue-500 pl-4">
                    <h4 className="font-medium text-gray-900 mb-2">VirusTotal</h4>
                    <div className="grid grid-cols-4 gap-3 text-sm">
                      <div>
                        <p className="text-gray-500">Malicious</p>
                        <p className="font-bold text-red-600">{result.threatIntel.virusTotal.malicious}</p>
                      </div>
                      <div>
                        <p className="text-gray-500">Suspicious</p>
                        <p className="font-bold text-orange-600">{result.threatIntel.virusTotal.suspicious}</p>
                      </div>
                      <div>
                        <p className="text-gray-500">Harmless</p>
                        <p className="font-bold text-green-600">{result.threatIntel.virusTotal.harmless}</p>
                      </div>
                      <div>
                        <p className="text-gray-500">Undetected</p>
                        <p className="font-bold text-gray-600">{result.threatIntel.virusTotal.undetected}</p>
                      </div>
                    </div>
                  </div>
                )}

                {result.threatIntel.phishTank && (
                  <div className="border-l-4 border-purple-500 pl-4">
                    <h4 className="font-medium text-gray-900 mb-2">PhishTank</h4>
                    <p className={`text-sm ${
                      result.threatIntel.phishTank.isPhishing ? 'text-red-600' : 'text-green-600'
                    }`}>
                      {result.threatIntel.phishTank.isPhishing 
                        ? '⚠️ Identified as phishing' 
                        : '✅ Not in phishing database'}
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
