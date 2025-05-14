import { useState } from 'react';
import { MapContainer, TileLayer, Rectangle, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

const DEFAULT_BOUNDS = [[37.56, 126.97], [37.57, 126.98]];

function BoundingBox({ bounds, setBounds }) {
  useMapEvents({
    click(e) {
      const [[lat1, lng1], [lat2, lng2]] = bounds;
      setBounds([[lat1, lng1], [e.latlng.lat, e.latlng.lng]]);
    }
  });
  return <Rectangle bounds={bounds} pathOptions={{ color: 'blue' }} />;
}

export default function MapCapturePage() {
  const [bounds, setBounds] = useState(DEFAULT_BOUNDS);
  const [isDownloading, setIsDownloading] = useState(false);

  const handleDownload = () => {
    alert("이건 미리보기 전용입니다. 실제 다운로드는 배포 후 동작합니다.");
  };

  return (
    <div className="p-4 space-y-4">
      <h1 className="text-2xl font-bold">GeoTIFF 좌표지도 캡쳐</h1>
      <p>원하는 영역을 클릭하여 선택 후, 고해상도 GeoTIFF 파일을 다운로드하세요.</p>

      <MapContainer center={[37.5651, 126.98955]} zoom={15} scrollWheelZoom={true} style={{ height: "500px" }}>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <BoundingBox bounds={bounds} setBounds={setBounds} />
      </MapContainer>

      <div>
        <button
          onClick={handleDownload}
          disabled={isDownloading}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
        >
          {isDownloading ? "GeoTIFF 생성 중..." : "GeoTIFF 다운로드"}
        </button>
      </div>
    </div>
  );
}
