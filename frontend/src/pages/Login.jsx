import React, { useState } from 'react'
import client, { setToken } from '../api'
import { useNavigate } from 'react-router-dom'

export default function Login({ onSuccess }){
  const [isLogin, setIsLogin] = useState(true)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [error, setError] = useState('')
  const nav = useNavigate()

  const handleAuth = async (e) => {
    e.preventDefault()
    setError('')
    try {
      const endpoint = isLogin ? '/auth/login' : '/auth/register'
      const body = isLogin 
        ? { email, password }
        : { name , email, password}
      console.log('Attempting', endpoint, 'with:', body)
      const res = await client.post(endpoint, body)
      console.log('Success:', res.data)
      setToken(res.data.token)
      
      // Store user info and determine role
      const user = res.data.user || { email, role: 'user' }
      localStorage.setItem('token', res.data.token)
      localStorage.setItem('user', JSON.stringify(user))
      
      if (onSuccess) onSuccess(user)
      
      // Route based on role
      if (user.role === 'admin') {
        nav('/admin')
      } else {
        nav('/submit')
      }
    } catch (err) {
      const msg = err.response?.data?.message || err.message || 'Unknown error'
      console.error('Auth error:', msg)
      setError(msg)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 to-blue-800 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl p-8 max-w-md w-full">
        <h1 className="text-4xl font-bold text-center mb-2 text-blue-600">
          📱 Smart Complaints
        </h1>
        <p className="text-center text-gray-600 mb-8 text-sm">
          Report and track public complaints easily
        </p>

        <div className="flex gap-2 mb-6 border-b-2">
          <button
            onClick={() => { setIsLogin(true); setError(''); }}
            className={`flex-1 py-3 text-center font-semibold transition ${
              isLogin
                ? 'border-b-4 border-blue-600 text-blue-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Login
          </button>
          <button
            onClick={() => { setIsLogin(false); setError(''); }}
            className={`flex-1 py-3 text-center font-semibold transition ${
              !isLogin
                ? 'border-b-4 border-blue-600 text-blue-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Register
          </button>
        </div>

        {error && (
          <div className="bg-red-100 border-l-4 border-red-600 text-red-700 px-4 py-3 rounded mb-4">
            ❌ {error}
          </div>
        )}

        <form onSubmit={handleAuth} className="flex flex-col gap-4">
          {!isLogin && (
            <div>
              <label className="text-sm font-semibold text-gray-700 block mb-1">Full Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="John Doe"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
          )}
          
          <div>
            <label className="text-sm font-semibold text-gray-700 block mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          
          <div>
            <label className="text-sm font-semibold text-gray-700 block mb-1">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white font-semibold py-2 rounded-lg hover:bg-blue-700 transition mt-2"
          >
            {isLogin ? '🔓 Login' : '✅ Create Account'}
          </button>
        </form>

        <div className="mt-6 p-4 bg-yellow-50 rounded-lg border-l-4 border-yellow-600">
          <p className="text-sm font-semibold text-yellow-800 mb-2">📌 Demo Credentials:</p>
          <div className="text-xs text-yellow-700 space-y-1">
            <p><strong>Regular User:</strong></p>
            <p>Email: <code className="bg-white px-2 py-1 rounded">testuser@example.com</code></p>
            <p>Password: <code className="bg-white px-2 py-1 rounded">test123</code></p>
          </div>
          
          <hr className="my-3 border-yellow-300" />
          
          <div className="text-xs text-yellow-700 space-y-1">
            <p><strong>Admin User:</strong></p>
            <p>Email: <code className="bg-white px-2 py-1 rounded">admin@example.com</code></p>
            <p>Password: <code className="bg-white px-2 py-1 rounded">admin123</code></p>
          </div>
        </div>
      </div>
    </div>
  )
}
