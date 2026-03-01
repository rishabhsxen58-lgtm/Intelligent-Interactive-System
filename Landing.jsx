import { useLang } from '../context/LanguageContext'

export default function Landing() {
  const { t } = useLang()
  return (
    <div className="p-6">
      <div className="text-3xl font-bold text-govBlue mb-4">{t.title}</div>
      <div className="grid md:grid-cols-3 gap-4">
        <div className="bg-white rounded shadow p-4">
          <div className="font-semibold mb-2">How it works</div>
          <p>Citizens submit complaints, AI categorizes, officers resolve, admin monitors.</p>
        </div>
        <div className="bg-white rounded shadow p-4">
          <div className="font-semibold mb-2">Features</div>
          <p>Real-time updates, analytics, maps, accessibility, PDF downloads.</p>
        </div>
        <div className="bg-white rounded shadow p-4">
          <div className="font-semibold mb-2">Contact</div>
          <p>Use the chatbot or visit the admin office.</p>
        </div>
      </div>
    </div>
  )
}
