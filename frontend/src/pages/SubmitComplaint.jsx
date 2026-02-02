import React, { useState } from 'react'
import client from '../api'
import { useNavigate } from 'react-router-dom'

export default function SubmitComplaint(){
  const navigate = useNavigate()
  const [title,setTitle]=useState('')
  const [description,setDescription]=useState('')
  const [category,setCategory]=useState('Road')
  const [location,setLocation]=useState('')
  const [photo,setPhoto]=useState(null)
  const [loading, setLoading] = useState(false)
  const [predictedPriority, setPredictedPriority] = useState(null)

  const submit = async (e)=>{
    e.preventDefault()
    setLoading(true)
    try {
      const form = new FormData()
      form.append('title', title)
      form.append('description', description)
      form.append('category', category)
      form.append('location', location)
      if(photo) form.append('photo', photo)
      const res = await client.post('/complaints', form, { headers: { 'Content-Type': 'multipart/form-data' } })
      alert('✅ Complaint submitted successfully!\n\nAI will analyze and assign priority.\nTrack it in "My Complaints"')
      setTitle('')
      setDescription('')
      setLocation('')
      setPhoto(null)
      setPredictedPriority(null)
      setTimeout(() => navigate('/track'), 1000)
    } catch (e) {
      console.error(e)
      alert('❌ Failed to submit complaint')
    }
    setLoading(false)
  }

  const analyzePriority = async () => {
    if (!title || !description) {
      alert('Please fill title and description first')
      return
    }
    setLoading(true)
    try {
      // Call backend endpoint for AI preview
      const res = await client.post('/complaints/preview-priority', { title, description })
      setPredictedPriority(res.data.priority)
      console.log('[PREVIEW]', res.data)
    } catch (e) {
      console.error('[PREVIEW ERROR]', e)
      alert('Could not analyze priority. Please try again.')
    }
    setLoading(false)
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-2 text-gray-800">📝 Submit a Complaint</h1>
        <p className="text-gray-600 mb-6">Report issues in your community. AI will analyze and assign priority.</p>
        
        <div className="bg-white p-8 rounded-lg shadow-lg">
          <form onSubmit={submit} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Title *</label>
              <input 
                required
                value={title} 
                onChange={e=>setTitle(e.target.value)} 
                placeholder="e.g., Broken streetlight on Main Street"
                className="w-full border border-gray-300 px-4 py-2 rounded focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Description *</label>
              <textarea 
                required
                value={description} 
                onChange={e=>setDescription(e.target.value)} 
                placeholder="Provide detailed information about the issue..."
                rows="5"
                className="w-full border border-gray-300 px-4 py-2 rounded focus:ring-2 focus:ring-blue-500 outline-none"
              />
              <p className="text-xs text-gray-500 mt-1">More details help AI assign correct priority</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Category *</label>
                <select 
                  value={category} 
                  onChange={e=>setCategory(e.target.value)}
                  className="w-full border border-gray-300 px-4 py-2 rounded focus:ring-2 focus:ring-blue-500 outline-none"
                >
                  <option>Road</option>
                  <option>Water</option>
                  <option>Electricity</option>
                  <option>Internet</option>
                  <option>Sanitation</option>
                  <option>Other</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Location *</label>
                <input 
                  required
                  value={location} 
                  onChange={e=>setLocation(e.target.value)} 
                  placeholder="e.g., Main Street, Downtown"
                  className="w-full border border-gray-300 px-4 py-2 rounded focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Photo (Optional)</label>
              <input 
                type="file" 
                accept="image/*"
                onChange={e=>setPhoto(e.target.files[0])} 
                className="w-full border border-gray-300 px-4 py-2 rounded focus:ring-2 focus:ring-blue-500"
              />
              {photo && <p className="text-sm text-green-600 mt-1">✓ {photo.name}</p>}
            </div>

            {predictedPriority && (
              <div className={`p-4 rounded-lg text-center font-bold ${
                predictedPriority === 'High' ? 'bg-red-100 text-red-800' :
                predictedPriority === 'Medium' ? 'bg-orange-100 text-orange-800' :
                'bg-green-100 text-green-800'
              }`}>
                🤖 AI Analysis: Priority = <span className="text-lg">{predictedPriority}</span>
              </div>
            )}

            <div className="flex gap-3">
              <button 
                type="button"
                onClick={analyzePriority}
                disabled={loading}
                className="flex-1 border-2 border-blue-600 text-blue-600 px-4 py-2 rounded font-semibold hover:bg-blue-50 disabled:opacity-50"
              >
                🤖 Preview AI Priority
              </button>
              <button 
                type="submit"
                disabled={loading}
                className="flex-1 bg-green-600 text-white px-4 py-2 rounded font-semibold hover:bg-green-700 disabled:opacity-50"
              >
                {loading ? '⏳ Submitting...' : '✅ Submit Complaint'}
              </button>
            </div>
          </form>

          <div className="mt-6 p-4 bg-blue-50 rounded-lg border-l-4 border-blue-600">
            <p className="text-sm text-blue-800"><strong>ℹ️ How AI Priority Works:</strong></p>
            <ul className="text-sm text-blue-700 mt-2 list-disc list-inside">
              <li><strong>High Priority:</strong> Urgent issues affecting public safety</li>
              <li><strong>Medium Priority:</strong> Important issues affecting services</li>
              <li><strong>Low Priority:</strong> Minor issues with general impact</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
