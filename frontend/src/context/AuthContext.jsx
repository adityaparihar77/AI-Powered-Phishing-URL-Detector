import { createContext, useContext, useState, useEffect } from 'react'
import axios from '../utils/axios'

const AuthContext = createContext()

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [token, setToken] = useState(localStorage.getItem('token'))
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (token) {
      fetchUser()
    } else {
      setLoading(false)
    }
  }, [token])

  const fetchUser = async () => {
    try {
      const response = await axios.get('/auth/me')
      setUser(response.data.user)
    } catch (error) {
      console.error('Failed to fetch user:', error)
      logout()
    } finally {
      setLoading(false)
    }
  }

  const login = async (email, password) => {
    const response = await axios.post('/auth/login', { email, password })
    const { token, user } = response.data
    
    localStorage.setItem('token', token)
    setToken(token)
    setUser(user)
    
    return response.data
  }

  const register = async (username, email, password) => {
    const response = await axios.post('/auth/register', { 
      username, 
      email, 
      password 
    })
    const { token, user } = response.data
    
    localStorage.setItem('token', token)
    setToken(token)
    setUser(user)
    
    return response.data
  }

  const logout = () => {
    localStorage.removeItem('token')
    setToken(null)
    setUser(null)
  }

  const value = {
    user,
    token,
    login,
    register,
    logout,
    isAuthenticated: !!token,
    loading
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
