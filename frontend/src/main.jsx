import React, { useState, useEffect } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route, useNavigate, Link, useLocation } from 'react-router-dom'
import Login from './pages/Login'
import SubmitComplaint from './pages/SubmitComplaint'
import Track from './pages/Track'
import ComplaintDetail from './pages/ComplaintDetail'
import AdminDashboard from './pages/AdminDashboard'
import './index.css'

function Nav({ user, onLogout }) {
  const location = useLocation()
  if (location.pathname === '/') return null // No nav on login page

  return (
    <nav className="bg-blue-600 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
        <Link to={user?.role === 'admin' ? '/admin' : '/submit'} className="text-2xl font-bold">
          📱 Smart Complaints
        </Link>
        
        <div className="flex gap-6 items-center">
          {user?.role === 'admin' ? (
            <>
              <Link to="/admin" className={`px-4 py-2 rounded ${location.pathname === '/admin' ? 'bg-blue-700' : 'hover:bg-blue-700'}`}>
                📊 Dashboard
              </Link>
            </>
          ) : (
            <>
              <Link to="/submit" className={`px-4 py-2 rounded ${location.pathname === '/submit' ? 'bg-blue-700' : 'hover:bg-blue-700'}`}>
                📝 Submit Complaint
              </Link>
              <Link to="/track" className={`px-4 py-2 rounded ${location.pathname === '/track' ? 'bg-blue-700' : 'hover:bg-blue-700'}`}>
                📋 My Complaints
              </Link>
            </>
          )}
          
          <div className="flex items-center gap-3 border-l border-blue-400 pl-6">
            <span className="text-sm">{user?.email}</span>
            <span className="text-xs bg-blue-700 px-2 py-1 rounded">{user?.role === 'admin' ? '👨‍💼 Admin' : '👤 User'}</span>
            <button onClick={onLogout} className="bg-red-600 px-3 py-1 rounded hover:bg-red-700">
              Logout
            </button>
          </div>
        </div>
      </div>
    </nav>
  )
}

function App(){
  const [user, setUser] = useState(null)
  const nav = useNavigate()

  useEffect(() => {
    // Check if user token exists in localStorage
    const token = localStorage.getItem('token')
    const userData = localStorage.getItem('user')
    if (token && userData) {
      setUser(JSON.parse(userData))
    }
  }, [])

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    setUser(null)
    nav('/')
  }

  const handleLoginSuccess = (user) => {
    setUser(user)
    localStorage.setItem('user', JSON.stringify(user))
  }

  return (
    <>
      <Nav user={user} onLogout={handleLogout} />
      <Routes>
        <Route path='/' element={<Login onSuccess={handleLoginSuccess} />} />
        <Route path='/submit' element={user ? <SubmitComplaint /> : <Login onSuccess={handleLoginSuccess} />} />
        <Route path='/track' element={user && user.role === 'user' ? <Track /> : user && user.role === 'admin' ? <AdminDashboard /> : <Login onSuccess={handleLoginSuccess} />} />
        <Route path='/complaint/:id' element={user ? <ComplaintDetail /> : <Login onSuccess={handleLoginSuccess} />} />
        <Route path='/admin' element={user && user.role === 'admin' ? <AdminDashboard /> : <Login onSuccess={handleLoginSuccess} />} />
      </Routes>
    </>
  )
}

createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <App />
  </BrowserRouter>
)
