import { useEffect, useState } from 'react'
import { api } from '../services/api'
import { socket } from '../services/socket'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'

export default function AdminDashboard() {
  const [items, setItems] = useState([])
  const [analytics, setAnalytics] = useState({ byStatus: [], byCategory: [] })
  const [filter, setFilter] = useState('')
  const load = async () => {
    const qs = filter ? `?status=${filter}` : ''
    const { data } = await api.get('/complaints' + qs)
    setItems(data)
    const a = await api.get('/admin/analytics')
    setAnalytics(a.data)
  }
  useEffect(() => {
    load()
    socket.on('complaint:update', load)
    return () => { socket.off('complaint:update', load) }
  }, [filter])
  return (
    <div className="p-6">
      <div className="flex items-center gap-3 mb-4">
        <div className="text-xl font-bold">Admin Dashboard</div>
        <select value={filter} onChange={e=>setFilter(e.target.value)} className="border px-2 py-1">
          <option value="">All</option>
          <option value="submitted">Submitted</option>
          <option value="assigned">Assigned</option>
          <option value="in_progress">In Progress</option>
          <option value="resolved">Resolved</option>
          <option value="escalated">Escalated</option>
        </select>
      </div>
      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-white rounded shadow p-4">
          <div className="font-semibold mb-2">Complaints</div>
          <div className="space-y-2 max-h-96 overflow-auto">
            {items.map(c => (
              <div key={c._id} className="border rounded p-2 flex justify-between">
                <div>
                  <div className="font-semibold">{c.title}</div>
                  <div className="text-sm">Status {c.status} • {c.ai?.category}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="bg-white rounded shadow p-4">
          <div className="font-semibold mb-2">Analytics</div>
          <div className="h-64">
            <ResponsiveContainer>
              <BarChart data={analytics.byStatus.map(s=>({name:s._id,count:s.count}))}>
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill="#1e90ff" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  )
}
