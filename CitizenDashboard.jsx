import { useEffect, useState } from 'react'
import { api } from '../services/api'
import { socket } from '../services/socket'
import Map from '../components/Map'
import { startVoice } from '../services/voice'

export default function CitizenDashboard() {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [complaints, setComplaints] = useState([])
  const [lat, setLat] = useState('')
  const [lng, setLng] = useState('')
  const load = async () => {
    const { data } = await api.get('/complaints/me')
    setComplaints(data)
  }
  useEffect(() => {
    load()
    socket.on('complaint:update', load)
    return () => { socket.off('complaint:update', load) }
  }, [])
  const submit = async e => {
    e.preventDefault()
    await api.post('/complaints', { title, description, lat, lng })
    setTitle(''); setDescription(''); setLat(''); setLng('')
    await load()
  }
  const voice = () => {
    startVoice(t => setDescription(t))
  }
  return (
    <div className="p-6 grid md:grid-cols-2 gap-6">
      <div>
        <div className="text-xl font-bold mb-2">Register Complaint</div>
        <form onSubmit={submit} className="space-y-3">
          <input value={title} onChange={e=>setTitle(e.target.value)} className="w-full border px-3 py-2" placeholder="Title" />
          <textarea value={description} onChange={e=>setDescription(e.target.value)} className="w-full border px-3 py-2 h-32" placeholder="Description" />
          <div className="grid grid-cols-2 gap-2">
            <input value={lat} onChange={e=>setLat(e.target.value)} className="w-full border px-3 py-2" placeholder="Latitude" />
            <input value={lng} onChange={e=>setLng(e.target.value)} className="w-full border px-3 py-2" placeholder="Longitude" />
          </div>
          <div className="flex gap-2">
            <button className="bg-govBlue text-white px-3 py-2 rounded">Submit</button>
            <button type="button" onClick={voice} className="bg-gray-200 px-3 py-2 rounded">Voice</button>
          </div>
        </form>
        <div className="mt-4"><Map position={lat && lng ? { lat: Number(lat), lng: Number(lng) } : null} /></div>
      </div>
      <div>
        <div className="text-xl font-bold mb-2">My Complaints</div>
        <div className="space-y-2">
          {complaints.map(c => (
            <div key={c._id} className="bg-white rounded shadow p-3">
              <div className="font-semibold">{c.title}</div>
              <div className="text-sm">Status {c.status} • Category {c.ai?.category}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
