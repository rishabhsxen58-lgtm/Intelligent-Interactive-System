import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'

export default function Map({ position }) {
  const pos = position || { lat: 28.6139, lng: 77.2090 }
  return (
    <div className="h-64">
      <MapContainer center={[pos.lat, pos.lng]} zoom={13} className="h-full w-full">
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        <Marker position={[pos.lat, pos.lng]}>
          <Popup>Location</Popup>
        </Marker>
      </MapContainer>
    </div>
  )
}
