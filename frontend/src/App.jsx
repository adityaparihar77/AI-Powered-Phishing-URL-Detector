import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './context/AuthContext'
import Layout from './components/Layout'
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import URLAnalyzer from './pages/URLAnalyzer'
import ScanHistory from './pages/ScanHistory'
import ThreatFeed from './pages/ThreatFeed'

function PrivateRoute({ children }) {
  const { isAuthenticated } = useAuth()
  return isAuthenticated ? children : <Navigate to="/login" />
}

function App() {
  return (
    <BrowserRouter
      future={{
        v7_startTransition: true,
        v7_relativeSplatPath: true
      }}
    >
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        
        <Route path="/" element={<PrivateRoute><Layout /></PrivateRoute>}>
          <Route index element={<Dashboard />} />
          <Route path="analyze" element={<URLAnalyzer />} />
          <Route path="history" element={<ScanHistory />} />
          <Route path="threats" element={<ThreatFeed />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
