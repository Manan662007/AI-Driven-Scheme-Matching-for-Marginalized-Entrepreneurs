import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet';
import L from 'leaflet';

const userIcon = new L.DivIcon({
  className: 'custom-user-marker',
  html: `
    <div style="
      background-color: #2563EB;
      width: 22px;
      height: 22px;
      border-radius: 50%;
      border: 3px solid white;
      box-shadow: 0 0 12px rgba(37,99,235,0.8);
      position: relative;
    ">
      <div style="
        position: absolute;
        top: -6px;
        left: -6px;
        width: 28px;
        height: 28px;
        border-radius: 50%;
        background-color: rgba(37,99,235,0.3);
        animation: ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite;
      "></div>
    </div>
  `,
  iconSize: [22, 22],
  iconAnchor: [11, 11]
});

const bankIcon = new L.DivIcon({
  className: 'custom-bank-marker',
  html: `
    <div style="
      background-color: #16A34A;
      color: white;
      width: 32px;
      height: 32px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 16px;
      border: 2.5px solid white;
      box-shadow: 0 4px 10px rgba(0,0,0,0.3);
    ">
      🏦
    </div>
  `,
  iconSize: [32, 32],
  iconAnchor: [16, 16]
});

const selectedBankIcon = new L.DivIcon({
  className: 'custom-selected-bank-marker',
  html: `
    <div style="
      background-color: #D97706;
      color: white;
      width: 38px;
      height: 38px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 20px;
      border: 3px solid white;
      box-shadow: 0 0 16px rgba(217,119,6,0.9);
    ">
      📍
    </div>
  `,
  iconSize: [38, 38],
  iconAnchor: [19, 19]
});

function BoundsFitter({ userPos, banks, selectedBank }) {
  const map = useMap();

  useEffect(() => {
    if (!map || !userPos) return;

    if (selectedBank) {
      const bounds = L.latLngBounds([
        [userPos.lat, userPos.lon],
        [selectedBank.lat, selectedBank.lon]
      ]);
      map.fitBounds(bounds, { padding: [50, 50], maxZoom: 15 });
    } else if (banks && banks.length > 0) {
      const points = [[userPos.lat, userPos.lon], ...banks.map(b => [b.lat, b.lon])];
      map.fitBounds(L.latLngBounds(points), { padding: [40, 40], maxZoom: 14 });
    } else {
      map.setView([userPos.lat, userPos.lon], 13);
    }
  }, [map, userPos, banks, selectedBank]);

  return null;
}

export default function MapView({ userLocation, banks, selectedBank, onSelectBank }) {
  if (!userLocation) return null;

  const center = [userLocation.lat, userLocation.lon];

  return (
    <div className="w-full h-80 sm:h-96 rounded-3xl overflow-hidden shadow-lg border-2 border-green-200 dark:border-green-800 z-0 relative">
      <MapContainer
        center={center}
        zoom={13}
        scrollWheelZoom={false}
        style={{ width: '100%', height: '100%', borderRadius: '1.5rem' }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <BoundsFitter userPos={userLocation} banks={banks} selectedBank={selectedBank} />

        <Marker position={[userLocation.lat, userLocation.lon]} icon={userIcon}>
          <Popup>
            <div className="text-xs p-1 font-bold text-blue-700">
              📍 Your Live Location
            </div>
          </Popup>
        </Marker>

        {banks.map((bank) => {
          const isSelected = selectedBank?.id === bank.id;
          const pathCoordinates = [
            [userLocation.lat, userLocation.lon],
            [bank.lat, bank.lon]
          ];

          return (
            <React.Fragment key={bank.id}>
              <Marker
                position={[bank.lat, bank.lon]}
                icon={isSelected ? selectedBankIcon : bankIcon}
                eventHandlers={{
                  click: () => onSelectBank && onSelectBank(bank)
                }}
              >
                <Popup>
                  <div className="text-xs p-1">
                    <p className="font-bold text-green-900">{bank.name}</p>
                    <p className="text-gray-600">{bank.distance_km || bank.distance} km away</p>
                    <p className="text-emerald-700 font-semibold mt-1">✓ NSFDC Approved</p>
                  </div>
                </Popup>
              </Marker>

              <Polyline
                positions={pathCoordinates}
                pathOptions={{
                  color: isSelected ? '#D97706' : '#16A34A',
                  weight: isSelected ? 4 : 2,
                  dashArray: isSelected ? '8, 8' : '4, 6',
                  opacity: isSelected ? 0.9 : 0.4
                }}
              />
            </React.Fragment>
          );
        })}
      </MapContainer>

      <div className="absolute top-3 right-3 bg-white/90 dark:bg-green-950/90 backdrop-blur-md px-3 py-1.5 rounded-full shadow text-[11px] font-semibold flex items-center gap-3 z-[1000] border border-green-100 dark:border-green-800">
        <span className="flex items-center gap-1 text-blue-600 dark:text-blue-400">
          <span className="w-2.5 h-2.5 rounded-full bg-blue-600 inline-block"></span> You
        </span>
        <span className="flex items-center gap-1 text-green-600 dark:text-green-400">
          <span className="w-2.5 h-2.5 rounded-full bg-green-600 inline-block"></span> Banks
        </span>
        <span className="flex items-center gap-1 text-amber-600 dark:text-amber-400">
          <span className="w-3 h-0.5 border-t-2 border-dashed border-amber-600 inline-block"></span> Route
        </span>
      </div>
    </div>
  );
}
