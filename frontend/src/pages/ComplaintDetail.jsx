import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import client from '../api'

export default function ComplaintDetail() {
  const { id } = useParams()
  const nav = useNavigate()
  const [complaint, setComplaint] = useState(null)
  const [history, setHistory] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedImages, setSelectedImages] = useState(null)

  useEffect(() => {
    const fetch = async () => {
      setLoading(true)
      try {
        const cRes = await client.get(`/complaints/${id}`)
        setComplaint(cRes.data.complaint)

        const hRes = await client.get(`/complaints/${id}/history`)
        setHistory(hRes.data.history || [])
      } catch (e) {
        console.error(e)
        alert('Failed to load complaint')
        nav('/track')
      }
      setLoading(false)
    }
    fetch()
  }, [id, nav])

  if (loading) return <div className="p-6 text-center">Loading...</div>
  if (!complaint) return <div className="p-6 text-center text-gray-500">Complaint not found</div>

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-4xl mx-auto">
        <button onClick={() => nav('/track')} className="mb-6 px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700">
          ← Back to My Complaints
        </button>

        <div className="bg-white p-6 rounded-lg shadow-lg mb-6">
          <div className="flex justify-between items-start mb-6">
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-gray-800">{complaint.title}</h1>
              <p className="text-gray-500 text-sm mt-2">Complaint ID: #{complaint.id}</p>
            </div>
            <div className="flex gap-2 flex-col items-end">
              <span className={`px-4 py-2 rounded-full text-white font-bold ${
                complaint.priority === 'High' ? 'bg-red-600' :
                complaint.priority === 'Medium' ? 'bg-orange-600' :
                'bg-green-600'
              }`}>
                {complaint.priority} Priority
              </span>
              <span className={`px-4 py-2 rounded-full text-sm font-semibold ${
                complaint.status === 'Resolved' ? 'bg-green-100 text-green-800' :
                complaint.status === 'In Progress' ? 'bg-yellow-100 text-yellow-800' :
                'bg-gray-100 text-gray-800'
              }`}>
                Status: {complaint.status}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6 mb-6">
            <div>
              <p className="text-sm text-gray-500 font-semibold">CATEGORY</p>
              <p className="text-lg font-bold text-gray-800">{complaint.category}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500 font-semibold">LOCATION</p>
              <p className="text-lg font-bold text-gray-800">{complaint.location}</p>
            </div>
          </div>

          <div className="mb-6">
            <p className="text-sm text-gray-500 font-semibold mb-2">DESCRIPTION</p>
            <p className="text-gray-700 leading-relaxed">{complaint.description}</p>
          </div>

          {complaint.images && complaint.images.length > 0 && (
            <div className="mb-6">
              <p className="text-sm text-gray-500 font-semibold mb-3">ATTACHMENTS ({complaint.images.length})</p>
              <div className="grid grid-cols-4 gap-3">
                {complaint.images.map((img, idx) => (
                  <div 
                    key={idx}
                    onClick={() => setSelectedImages(complaint.images)}
                    className="cursor-pointer hover:opacity-80 transition"
                  >
                    <img src={img} alt={`attachment-${idx}`} className="w-full h-24 object-cover rounded border-2 border-gray-300 hover:border-blue-500" />
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="text-sm text-gray-500">
            Submitted on {new Date(complaint.created_at).toLocaleString()}
          </div>
        </div>

        {/* Status Timeline / Memory Bank */}
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">📅 Status Timeline (Memory Bank)</h2>

          {history.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <p>No status updates yet. Complaint is awaiting admin review.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {history.map((record, idx) => (
                <div key={record.id} className="flex gap-4">
                  <div className="flex flex-col items-center">
                    <div className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-sm">
                      {idx + 1}
                    </div>
                    {idx < history.length - 1 && <div className="w-1 h-12 bg-gray-300 mt-2"></div>}
                  </div>

                  <div className="flex-1 pb-4 border-b border-gray-200">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-semibold text-gray-800">
                          {record.old_status} → <span className="text-green-600">{record.new_status}</span>
                        </p>
                        <p className="text-sm text-gray-600 mt-1">
                          Updated by: <span className="font-semibold">{record.admin_email}</span>
                        </p>
                        {record.remark && (
                          <p className="text-sm text-gray-700 mt-2 p-2 bg-gray-50 rounded italic">
                            💬 "{record.remark}"
                          </p>
                        )}
                      </div>
                      <div className="text-sm text-gray-500">
                        {new Date(record.created_at).toLocaleString()}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Image Modal */}
      {selectedImages && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50" onClick={() => setSelectedImages(null)}>
          <div className="bg-white p-6 rounded-lg max-w-2xl w-full mx-4" onClick={(e) => e.stopPropagation()}>
            <button onClick={() => setSelectedImages(null)} className="text-2xl font-bold text-gray-600 float-right">×</button>
            <h2 className="text-xl font-bold mb-4">Complaint Images</h2>
            <div className="grid grid-cols-2 gap-4">
              {selectedImages.map((img, idx) => (
                <img key={idx} src={img} alt={`full-${idx}`} className="w-full rounded" />
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
