import { useState } from 'react'
import { api } from '../services/api'
import { complaintPdf } from '../services/pdf'

export default function Chatbot() {
  const [open, setOpen] = useState(true)
  const [mode, setMode] = useState('faq')
  const [text, setText] = useState('')
  const [result, setResult] = useState(null)
  const submit = async () => {
    if (mode === 'register') {
      const { data } = await api.post('/complaints', { title: text.split('.').shift() || 'Complaint', description: text })
      setResult({ type: 'registered', id: data.id })
    } else if (mode === 'track') {
      const { data } = await api.get('/complaints/' + text.trim())
      setResult({ type: 'track', data })
    }
  }
  return (
    <div className="fixed bottom-4 right-4">
      <div className="bg-white rounded shadow w-80">
        <div className="flex justify-between items-center px-3 py-2">
          <div className="font-semibold">AI Assistant</div>
          <button onClick={() => setOpen(!open)} className="text-sm">{open ? 'Hide' : 'Show'}</button>
        </div>
        {open && (
          <div className="p-3">
            <div className="flex gap-2 mb-2">
              <button onClick={() => setMode('faq')} className={`px-2 py-1 rounded ${mode==='faq'?'bg-govAccent text-white':'bg-gray-200'}`}>FAQ</button>
              <button onClick={() => setMode('register')} className={`px-2 py-1 rounded ${mode==='register'?'bg-govAccent text-white':'bg-gray-200'}`}>Register</button>
              <button onClick={() => setMode('track')} className={`px-2 py-1 rounded ${mode==='track'?'bg-govAccent text-white':'bg-gray-200'}`}>Track</button>
            </div>
            <input value={text} onChange={e=>setText(e.target.value)} className="w-full border px-2 py-1 mb-2" placeholder={mode==='track'?'Enter Complaint ID':'Describe your complaint'} />
            <button onClick={submit} className="bg-govBlue text-white px-3 py-1 rounded">Submit</button>
            {result && result.type==='registered' && (
              <div className="mt-2 text-green-700">ID {result.id}</div>
            )}
            {result && result.type==='track' && (
              <div className="mt-2">
                <div className="font-semibold">{result.data.title}</div>
                <div className="text-sm">Status {result.data.status}</div>
                <button onClick={()=>complaintPdf(result.data)} className="bg-gray-200 px-2 py-1 rounded mt-2">Download PDF</button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
