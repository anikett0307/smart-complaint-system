import React, { useEffect, useState } from 'react'
import client from '../api'
import { Link } from 'react-router-dom'

export default function Track(){
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
  const load = async () => {
    try {
      setLoading(true)
      const res = await client.get('/complaints')
      setItems(res.data.complaints || [])
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  load()
  const interval = setInterval(load, 5000) // refresh every 5s
  return () => clearInterval(interval)
}, [])


  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-2 text-gray-800">📋 My Complaints</h1>
        <p className="text-gray-600 mb-6">Track the status and AI priority of your submitted complaints</p>
        
        {loading ? (
          <div className="text-center py-8">Loading your complaints...</div>
        ) : items.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg">
            <p className="text-gray-500 text-lg">No complaints submitted yet</p>
            <p className="text-gray-400 mt-2">Submit your first complaint to see it here</p>
          </div>
        ) : (
          <div className="grid gap-4">
            {items.map(complaint => (
              <Link key={complaint.id} to={`/complaint/${complaint.id}`} className="block hover:no-underline">
                <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition cursor-pointer">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-gray-800">{complaint.title}</h3>
                      <p className="text-gray-600 mt-2 line-clamp-2">{complaint.description}</p>

                      {/* ✅ PHOTO DISPLAY (ADDED) */}
                      {complaint.photo && (
                        <img
                          src={`http://localhost:4000/uploads/${complaint.photo}`}
                          alt="complaint"
                          className="mt-3 w-32 h-32 object-cover rounded border"
                        />
                      )}
                    </div>

                    <div className="ml-4 flex gap-2 flex-col items-end">
                      <span className={`px-4 py-2 rounded-full text-white font-bold text-sm ${
                        complaint.priority === 'High' ? 'bg-red-600' : 
                        complaint.priority === 'Medium' ? 'bg-orange-600' : 
                        'bg-green-600'
                      }`}>
                        Priority: {complaint.priority}
                      </span>
                      <span className={`px-4 py-2 rounded-full text-sm font-semibold ${
                        complaint.status === 'Resolved' ? 'bg-green-100 text-green-800' :
                        complaint.status === 'In Progress' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {complaint.status}
                      </span>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-4 text-sm text-gray-600">
                    <div><strong>Category:</strong> {complaint.category}</div>
                    <div><strong>Location:</strong> {complaint.location}</div>
                    <div>
                      <strong>Submitted:</strong>{" "}
                      {new Date(complaint.created_at).toLocaleDateString()}

                    </div>
                  </div>

                  <div className="mt-4 text-blue-600 font-semibold hover:underline">
                    View Details & Timeline →
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
