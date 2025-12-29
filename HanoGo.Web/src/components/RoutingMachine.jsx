import { useEffect } from 'react';
import { useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet-routing-machine';
import 'leaflet-routing-machine/dist/leaflet-routing-machine.css';

// Fix icon marker
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';
let DefaultIcon = L.icon({
    iconUrl: icon, shadowUrl: iconShadow, iconSize: [25, 41], iconAnchor: [12, 41]
});
L.Marker.prototype.options.icon = DefaultIcon;

const RoutingMachine = ({ places, transportMode }) => {
    const map = useMap();

    useEffect(() => {
        if (!map || places.length < 2) return;

        const waypoints = places.map(p => L.latLng(p.latitude, p.longitude));

        // --- CHUYỂN ĐỔI PROFILE OSRM ---
        // driving -> car
        // walking -> foot (Đây là từ khóa quan trọng để nó tính đường đi bộ)
        const profileMap = {
            'driving': 'car',
            'walking': 'foot'
        };
        const osrmProfile = profileMap[transportMode] || 'car';

        // Đổi màu đường: Xe máy = Xanh dương, Đi bộ = Xanh lá
        const lineColor = transportMode === 'walking' ? '#52c41a' : '#1890ff';
        const lineStyle = transportMode === 'walking'
            ? [{ color: '#52c41a', opacity: 0.8, weight: 5, dashArray: '10, 10' }] // Đi bộ nét đứt
            : [{ color: '#1890ff', opacity: 0.8, weight: 5 }]; // Xe máy nét liền

        const routingControl = L.Routing.control({
            waypoints: waypoints,
            router: L.Routing.osrmv1({
                serviceUrl: `https://router.project-osrm.org/route/v1`,
                profile: osrmProfile // <--- Quan trọng
            }),
            routeWhileDragging: false,
            showAlternatives: false,
            lineOptions: { styles: lineStyle },
            createMarker: () => null,
            addWaypoints: false
        })
            .on('routesfound', function (e) {
                const routes = e.routes;
                const summary = routes[0].summary;

                // Tính thời gian (OSRM trả về giây)
                const timeMinutes = Math.round(summary.totalTime / 60);
                const distanceKm = (summary.totalDistance / 1000).toFixed(1);

                L.popup()
                    .setLatLng(waypoints[Math.floor(waypoints.length / 2)]) // Hiện popup ở giữa đường
                    .setContent(`
          <div style="text-align: center; font-family: sans-serif;">
            <h3 style="margin: 0; color: ${lineColor}">
                ${transportMode === 'walking' ? '🚶 ĐI BỘ' : '🏍️ XE MÁY'}
            </h3>
            <hr style="margin: 5px 0; border: 0; border-top: 1px solid #eee"/>
            Quãng đường: <b>${distanceKm} km</b><br/>
            Thời gian: <b>${timeMinutes} phút</b>
          </div>
        `)
                    .openOn(map);
            })
            .addTo(map);

        return () => map.removeControl(routingControl);
    }, [map, places, transportMode]); // Chạy lại khi transportMode đổi

    return null;
};

export default RoutingMachine;