import { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'

export default function Login() {
  const { login } = useAuth()
  const nav = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const submit = async e => {
    e.preventDefault()
    setError('')
    try {
      await login(email, password)
      nav('/citizen')
    } catch (e) {
      setError('Invalid credentials')
    }
  }
  return (
    <div className="p-6 max-w-md mx-auto">
      <div className="text-2xl font-bold mb-4">Login</div>
      <form onSubmit={submit} className="space-y-3">
        <input value={email} onChange={e=>setEmail(e.target.value)} className="w-full border px-3 py-2" placeholder="Email" />
        <input type="password" value={password} onChange={e=>setPassword(e.target.value)} className="w-full border px-3 py-2" placeholder="Password" />
        <button className="bg-govBlue text-white px-3 py-2 rounded w-full">Login</button>
      </form>
      {error && <div className="text-red-700 mt-2">{error}</div>}
    </div>
  )
}
