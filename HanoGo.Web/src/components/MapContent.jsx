import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css'; // Bắt buộc phải có dòng này bản đồ mới hiện
import L from 'leaflet';
import RoutingMachine from './RoutingMachine'; // Import bộ phận vẽ đường

// --- PHẦN FIX LỖI ICON CỦA LEAFLET TRONG REACT ---
// Nếu không có đoạn này, icon ghim trên bản đồ sẽ bị lỗi hiển thị
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34]
});

L.Marker.prototype.options.icon = DefaultIcon;
// --------------------------------------------------

const containerStyle = {
    width: '100%',
    height: '100vh' // Full chiều cao màn hình
};

// Tọa độ trung tâm mặc định (Hồ Gươm - Hà Nội)
const defaultCenter = [21.0285, 105.8542];

function MapContent({ places, transportMode }) {
    return (
        <MapContainer
            center={defaultCenter}
            zoom={13}
            style={containerStyle}
            scrollWheelZoom={true}
        >
            {/* 1. Lớp bản đồ nền (OpenStreetMap) */}
            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

            {/* 2. Component vẽ đường đi và tính toán thời gian */}
            {/* Nó sẽ tự động nối các điểm trong 'places' lại với nhau */}
            <RoutingMachine places={places} transportMode={transportMode} />

            {/* 3. Vẽ các Marker (Ghim) tại từng địa điểm */}
            {places.map((place, index) => (
                <Marker
                    key={place.id}
                    position={[place.latitude, place.longitude]}
                >
                    <Popup>
                        <div style={{ width: '200px' }}>
                            {/* Hiển thị số thứ tự và tên */}
                            <h4 style={{ margin: '0 0 5px 0', color: '#1890ff' }}>
                                {place.id === 99999 ? '📍 ' : `#${index + 1}. `}
                                {place.name}
                            </h4>

                            {/* Nếu có ảnh thì hiện ảnh */}
                            {place.imageUrl && (
                                <img
                                    src={place.imageUrl}
                                    alt={place.name}
                                    style={{
                                        width: '100%',
                                        height: '100px',
                                        objectFit: 'cover',
                                        borderRadius: '4px',
                                        marginBottom: '5px'
                                    }}
                                />
                            )}

                            <p style={{ fontSize: '12px', margin: 0, color: '#666' }}>
                                {place.description}
                            </p>
                        </div>
                    </Popup>
                </Marker>
            ))}
        </MapContainer>
    );
}

// React.memo giúp bản đồ không bị render lại không cần thiết khi parent thay đổi state không liên quan
export default React.memo(MapContent);