import { useState } from 'react'
import { useAuth } from '../context/AuthContext'

export default function Register() {
  const { register } = useAuth()
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'citizen' })
  const [done, setDone] = useState(false)
  const submit = async e => {
    e.preventDefault()
    await register(form)
    setDone(true)
  }
  return (
    <div className="p-6 max-w-md mx-auto">
      <div className="text-2xl font-bold mb-4">Register</div>
      <form onSubmit={submit} className="space-y-3">
        <input value={form.name} onChange={e=>setForm({...form,name:e.target.value})} className="w-full border px-3 py-2" placeholder="Name" />
        <input value={form.email} onChange={e=>setForm({...form,email:e.target.value})} className="w-full border px-3 py-2" placeholder="Email" />
        <input type="password" value={form.password} onChange={e=>setForm({...form,password:e.target.value})} className="w-full border px-3 py-2" placeholder="Password" />
        <select value={form.role} onChange={e=>setForm({...form,role:e.target.value})} className="w-full border px-3 py-2">
          <option value="citizen">Citizen</option>
          <option value="officer">Officer</option>
          <option value="admin">Admin</option>
        </select>
        <button className="bg-govBlue text-white px-3 py-2 rounded w-full">Register</button>
      </form>
      {done && <div className="text-green-700 mt-2">Registered</div>}
    </div>
  )
}
