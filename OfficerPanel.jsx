import { useEffect, useState } from 'react'
import { api } from '../services/api'
import { socket } from '../services/socket'

export default function OfficerPanel() {
  const [items, setItems] = useState([])
  const load = async () => {
    const { data } = await api.get('/officer/assigned')
    setItems(data)
  }
  useEffect(() => {
    load()
    socket.on('complaint:update', load)
    return () => { socket.off('complaint:update', load) }
  }, [])
  const setStatus = async (id, status) => {
    await api.put('/complaints/' + id + '/status', { status })
    await load()
  }
  const uploadProof = async (id, file) => {
    const fd = new FormData()
    fd.append('proof', file)
    await api.post('/officer/' + id + '/proof', fd)
    await load()
  }
  return (
    <div className="p-6">
      <div className="text-xl font-bold mb-2">Assigned Complaints</div>
      <div className="space-y-2">
        {items.map(c => (
          <div key={c._id} className="bg-white rounded shadow p-3">
            <div className="font-semibold">{c.title}</div>
            <div className="text-sm">Status {c.status}</div>
            <div className="flex gap-2 mt-2">
              <button onClick={()=>setStatus(c._id,'in_progress')} className="bg-gray-200 px-2 py-1 rounded">In Progress</button>
              <button onClick={()=>setStatus(c._id,'resolved')} className="bg-gray-200 px-2 py-1 rounded">Resolved</button>
              <input type="file" onChange={e=>uploadProof(c._id, e.target.files[0])} />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
