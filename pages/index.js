import { useState } from 'react';
import dynamic from 'next/dynamic';
import 'leaflet/dist/leaflet.css';

const MapContainer = dynamic(() => import('react-leaflet').then((m) => m.MapContainer), { ssr: false });
const TileLayer    = dynamic(() => import('react-leaflet').then((m) => m.TileLayer),    { ssr: false });
const Rectangle    = dynamic(() => import('react-leaflet').then((m) => m.Rectangle),    { ssr: false });
const useMapEvents = dynamic(() => import('react-leaflet').then((m) => m.useMapEvents), { ssr: false });

const DEFAULT_BOUNDS = [[37.56, 126.97], [37.57, 126.98]];
const TILE_PROVIDERS = {
  openstreetmap: { name: 'OpenStreetMap', url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png' },
  google:       { name: 'Google Maps',   url: 'http://mt1.google.com/vt/lyrs=r&x={x}&y={y}&z={z}' },
  naver:       { name: 'Naver Map',     url: 'https://navermaps.pstatic.net/ncp-map/{z}/{x}/{y}.png' },
  vworld:      { name: 'VWorld',        url: 'http://xdworld.vworld.kr:8080/2d/Base/service/{z}/{x}/{y}.png' },
  kakaomap:    { name: 'Kakao Map',     url: 'https://map{1-3}.daumcdn.net/map_2d_hd/{Z}/{X}/{Y}.png' }
};
const CRS_OPTIONS = [
  'EPSG:4326','EPSG:3857','EPSG:5174','EPSG:5179','EPSG:5181','EPSG:5186','EPSG:5187','EPSG:102080','EPSG:102082','CUSTOM'
];

function BoundingBox({ bounds, setBounds }) {
  useMapEvents({ click(e) {
    const [[lat1, lng1]] = bounds;
    setBounds([[lat1, lng1], [e.latlng.lat, e.latlng.lng]]);
  }});
  return <Rectangle bounds={bounds} pathOptions={{ color: 'blue' }} />;
}

export default function Home() {
  const [bounds, setBounds] = useState(DEFAULT_BOUNDS);
  const [provider, setProvider] = useState('openstreetmap');
  const [crs, setCrs] = useState(CRS_OPTIONS[0]);
  const [custom, setCustom] = useState('EPSG:4326');
  const [loading, setLoading] = useState(false);

  const handleDownload = async () => {
    setLoading(true);
    const selectedCrs = crs === 'CUSTOM' ? custom : crs;
    const response = await fetch('/sample.tif');
    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'sample.tif';
    a.click();
    setLoading(false);
  };

  return (
    <div className="p-4 space-y-4">
      <h1 className="text-2xl font-bold">GeoTIFF 지도 캡쳐 서비스</h1>
      <div className="flex gap-4">
        <select value={provider} onChange={e => setProvider(e.target.value)}>
          {Object.entries(TILE_PROVIDERS).map(([k, v]) => <option key={k} value={k}>{v.name}</option>)}
        </select>
        <select value={crs} onChange={e => setCrs(e.target.value)}>
          {CRS_OPTIONS.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
        {crs === 'CUSTOM' && (
          <input value={custom} onChange={e => setCustom(e.target.value)} placeholder="EPSG or PROJ4" className="px-2 py-1 border rounded" />
        )}
      </div>
      <MapContainer center={[37.5651,126.98955]} zoom={15} scrollWheelZoom style={{ height:'500px' }}>
        <TileLayer attribution={`© ${TILE_PROVIDERS[provider].name}`} url={TILE_PROVIDERS[provider].url} />
        <BoundingBox bounds={bounds} setBounds={setBounds} />
      </MapContainer>
      <button onClick={handleDownload} disabled={loading} className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:opacity-50">
        {loading ? '다운로드 중...' : 'GeoTIFF 다운로드'}
      </button>
    </div>
  );
}
