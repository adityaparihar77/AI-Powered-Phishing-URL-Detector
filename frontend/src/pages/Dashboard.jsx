import { useState, useEffect } from 'react'
import axios from '../utils/axios'
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { Shield, AlertTriangle, CheckCircle, Activity } from 'lucide-react'

export default function Dashboard() {
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchStats()
  }, [])

  const fetchStats = async () => {
    try {
      const response = await axios.get('/stats/dashboard')
      setStats(response.data.stats)
    } catch (error) {
      console.error('Failed to fetch stats:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  const statCards = [
    {
      title: 'Total Scans',
      value: stats?.totalScans || 0,
      icon: Activity,
      color: 'blue',
      bgColor: 'bg-blue-50',
      textColor: 'text-blue-600'
    },
    {
      title: 'Phishing Detected',
      value: stats?.phishingDetected || 0,
      icon: AlertTriangle,
      color: 'red',
      bgColor: 'bg-red-50',
      textColor: 'text-red-600'
    },
    {
      title: 'Safe URLs',
      value: stats?.safeUrls || 0,
      icon: CheckCircle,
      color: 'green',
      bgColor: 'bg-green-50',
      textColor: 'text-green-600'
    },
    {
      title: 'Active Threats',
      value: stats?.activeThreats || 0,
      icon: Shield,
      color: 'orange',
      bgColor: 'bg-orange-50',
      textColor: 'text-orange-600'
    }
  ]

  const COLORS = ['#ef4444', '#f59e0b', '#10b981', '#3b82f6']

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-500 mt-1">Overview of your security analytics</p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat) => {
          const Icon = stat.icon
          return (
            <div key={stat.title} className="card">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500 mb-1">{stat.title}</p>
                  <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
                </div>
                <div className={`${stat.bgColor} p-3 rounded-lg`}>
                  <Icon className={`w-6 h-6 ${stat.textColor}`} />
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Scans Over Time */}
        <div className="card">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Scans Over Time</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={stats?.scansByDay || []}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="_id" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="count" stroke="#3b82f6" name="Total Scans" />
              <Line type="monotone" dataKey="phishing" stroke="#ef4444" name="Phishing" />
              <Line type="monotone" dataKey="safe" stroke="#10b981" name="Safe" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Threat Distribution */}
        <div className="card">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Threat Distribution</h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={stats?.threatDistribution || []}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ _id, count }) => `${_id}: ${count}`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="count"
              >
                {(stats?.threatDistribution || []).map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="card">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Stats</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="border-l-4 border-blue-500 pl-4">
            <p className="text-sm text-gray-500">Recent Scans (7 days)</p>
            <p className="text-2xl font-bold text-gray-900">{stats?.recentScans || 0}</p>
          </div>
          <div className="border-l-4 border-red-500 pl-4">
            <p className="text-sm text-gray-500">Detection Rate</p>
            <p className="text-2xl font-bold text-gray-900">
              {stats?.totalScans > 0 
                ? ((stats.phishingDetected / stats.totalScans) * 100).toFixed(1) 
                : 0}%
            </p>
          </div>
          <div className="border-l-4 border-green-500 pl-4">
            <p className="text-sm text-gray-500">Safety Rate</p>
            <p className="text-2xl font-bold text-gray-900">
              {stats?.totalScans > 0 
                ? ((stats.safeUrls / stats.totalScans) * 100).toFixed(1) 
                : 0}%
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
