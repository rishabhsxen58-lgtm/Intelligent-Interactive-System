import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useUI } from '../context/UIContext'
import { useLang } from '../context/LanguageContext'

export default function Navbar() {
  const { user, logout } = useAuth()
  const { dark, setDark, largeFont, setLargeFont, highContrast, setHighContrast } = useUI()
  const { t, lang, setLang } = useLang()
  return (
    <div className="bg-govBlue text-white px-4 py-3 flex items-center justify-between">
      <div className="flex items-center gap-4">
        <Link to="/" className="font-semibold">{t.title}</Link>
        <Link to="/citizen">Citizen</Link>
        <Link to="/admin">Admin</Link>
        <Link to="/officer">Officer</Link>
      </div>
      <div className="flex items-center gap-3">
        <button onClick={() => setDark(!dark)} className="bg-govAccent px-2 py-1 rounded">{dark ? 'Light' : 'Dark'}</button>
        <button onClick={() => setLargeFont(!largeFont)} className="bg-govAccent px-2 py-1 rounded">A+</button>
        <button onClick={() => setHighContrast(!highContrast)} className="bg-govAccent px-2 py-1 rounded">HC</button>
        <select value={lang} onChange={e => setLang(e.target.value)} className="text-black rounded px-2 py-1">
          <option value="en">English</option>
          <option value="hi">हिंदी</option>
        </select>
        {!user && <Link to="/login" className="bg-white text-govBlue px-2 py-1 rounded">{t.login}</Link>}
        {!user && <Link to="/register" className="bg-white text-govBlue px-2 py-1 rounded">{t.register}</Link>}
        {user && <button onClick={logout} className="bg-white text-govBlue px-2 py-1 rounded">{t.logout}</button>}
      </div>
    </div>
  )
}
