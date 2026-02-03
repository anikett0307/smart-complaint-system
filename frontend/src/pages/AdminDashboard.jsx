import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import client from '../api'

function StatusForm({ complaint, onUpdate }) {
  const [status, setStatus] = useState(complaint.status)
  const [remark, setRemark] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    onUpdate(status, remark)
    setRemark('')
  }

  return (
    <form onSubmit={handleSubmit} className="flex gap-2">
      <select value={status} onChange={(e) => setStatus(e.target.value)} className="border px-2 py-1 text-sm">
        <option>Pending</option>
        <option>In Progress</option>
        <option>Resolved</option>
      </select>
      <input value={remark} onChange={(e) => setRemark(e.target.value)} placeholder="Remark" className="border px-2 py-1 text-sm w-48" />
      <button type="submit" className="bg-blue-600 text-white px-3 py-1 text-sm rounded">Update</button>
    </form>
  )
}

function ImageModal({ images, onClose }) {
  const [currentIndex, setCurrentIndex] = useState(0)

  if (!images || images.length === 0) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50" onClick={onClose}>
      <div className="bg-white p-6 rounded-lg max-w-2xl w-full mx-4" onClick={(e) => e.stopPropagation()}>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Complaint Images</h2>
          <button onClick={onClose} className="text-2xl font-bold text-gray-600">×</button>
        </div>

        <div className="mb-4">
          <img src={images[currentIndex]} alt="complaint" className="w-full max-h-96 object-contain rounded" />
        </div>

        <div className="flex justify-between items-center">
          <div className="text-sm text-gray-600">
            Image {currentIndex + 1} of {images.length}
          </div>
          <div className="flex gap-2">
            {images.length > 1 && (
              <>
                <button
                  onClick={() => setCurrentIndex((currentIndex - 1 + images.length) % images.length)}
                  className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
                >
                  ← Previous
                </button>
                <button
                  onClick={() => setCurrentIndex((currentIndex + 1) % images.length)}
                  className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
                >
                  Next →
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default function AdminDashboard() {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(false)
  const [selectedImages, setSelectedImages] = useState(null)

  const load = async () => {
    setLoading(true)
    try {
      const res = await client.get('/complaints')   // ✅ changed
      setItems(res.data.complaints || [])           // ✅ changed
    } catch (e) {
      console.error('[ADMIN LOAD ERROR]', e)
    }
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  const updateStatus = async (id, status, remark) => {
  try {
    await client.put(`/complaints/${id}/status`, {
      status,
      remark
    })
    load() // refresh admin list
  } catch (err) {
    console.error('Status update failed', err)
    alert('Failed to update status')
  }
}

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-2 text-gray-800">📊 Admin Dashboard</h1>
        <p className="text-gray-600 mb-6">Manage all complaints sorted by priority</p>

        {loading ? (
          <div className="text-center py-8">Loading complaints...</div>
        ) : items.length === 0 ? (
          <div className="text-center py-8 text-gray-500">No complaints yet</div>
        ) : (
          <div className="space-y-4">
            {items.map((complaint) => (
              <div key={complaint.id} className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition">
                <div className="grid grid-cols-4 gap-4 mb-4">
                  <div>
                    <p className="text-xs text-gray-500 font-semibold">TITLE</p>
                    <p className="text-lg font-bold text-gray-800">{complaint.title}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 font-semibold">CATEGORY</p>
                    <p className="text-lg font-bold text-blue-600">{complaint.category}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 font-semibold">PRIORITY (AI)</p>
                    <span className={`inline-block px-4 py-2 rounded text-white text-sm font-bold ${
                      complaint.priority === 'High' ? 'bg-red-600' :
                      complaint.priority === 'Medium' ? 'bg-orange-600' :
                      'bg-green-600'
                    }`}>
                      {complaint.priority}
                    </span>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 font-semibold">STATUS</p>
                    <span className={`inline-block px-3 py-2 rounded text-sm font-semibold ${
                      complaint.status === 'Resolved' ? 'bg-green-100 text-green-800' :
                      complaint.status === 'In Progress' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {complaint.status}
                    </span>
                  </div>
                </div>

                <div className="mb-4 pb-4 border-b">
                  <p className="text-sm text-gray-700"><strong>Description:</strong> {complaint.description}</p>
                  <p className="text-sm text-gray-600 mt-2"><strong>Location:</strong> {complaint.location}</p>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <p className="text-xs text-gray-500 font-semibold mb-2">
                      IMAGES ({complaint.photo ? 1 : 0})
                    </p>

                    {complaint.photo ? (
                      <img
                        src={`http://localhost:4000/uploads/${complaint.photo}`}
                        alt="complaint"
                        className="w-24 h-24 object-cover rounded border-2 border-gray-300 cursor-pointer"
                        onClick={() =>
                          setSelectedImages([`http://localhost:4000/uploads/${complaint.photo}`])
                        }
                      />
                    ) : (
                      <div className="text-sm text-gray-500 p-3 bg-gray-100 rounded">
                        No images attached
                      </div>
                    )}
                  </div>

                  <div>
                    <p className="text-xs text-gray-500 font-semibold mb-2">UPDATE STATUS</p>
                    <StatusForm
                      complaint={complaint}
                      onUpdate={(status, remark) =>
                      updateStatus(complaint.id, status, remark)
                      }
                    />

                    <Link
                      to={`/complaint/${complaint.id}`}
                      className="inline-block mt-3 text-sm text-blue-600 hover:underline"
                    >
                      📋 View Full Timeline →
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {selectedImages && (
        <ImageModal images={selectedImages} onClose={() => setSelectedImages(null)} />
      )}
    </div>
  )
}
