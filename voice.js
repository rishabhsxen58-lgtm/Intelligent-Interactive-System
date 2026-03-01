export function startVoice(onText) {
  const SR = window.SpeechRecognition || window.webkitSpeechRecognition
  if (!SR) return null
  const rec = new SR()
  rec.lang = 'en-US'
  rec.interimResults = false
  rec.onresult = e => {
    const t = Array.from(e.results).map(r => r[0].transcript).join(' ')
    onText(t)
  }
  rec.start()
  return rec
}
