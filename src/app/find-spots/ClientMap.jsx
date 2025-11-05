"use client";

import React, { useEffect, useState, Fragment, useRef } from 'react';
import { Paper, Typography, Card, CardContent, Button } from '@mui/material';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

const MOCK_SPOTS = [
  { id: 1, position: [60.1699, 24.9384], name: "Helsinki Marina Spot A1", size: "40ft", price: "€50/day", available: true },
  { id: 2, position: [60.1699, 24.9584], name: "East Harbor B12", size: "35ft", price: "€45/day", available: true }
];

const center = [60.1699, 24.9384];

const defaultLogoPath = '/Logo.png';
const localSvgFallback = '/logo-marker.svg';
const fallbackLogoPath = '/boat-icon.svg';
const defaultIconOptions = {
  iconSize: [36, 36],
  iconAnchor: [18, 36],
  popupAnchor: [0, -36]
};

export default function ClientMap() {
  const containerRef = useRef(null);
  const mapRef = useRef(null);
  const markerRefs = useRef({});
  const [isLocating, setIsLocating] = useState(false);

  useEffect(() => {
    // inject minimal styles to avoid CSS/HMR issues
    const styleId = 'boatly-leaflet-overrides';
    if (!document.getElementById(styleId)) {
      const style = document.createElement('style');
      style.id = styleId;
      style.innerHTML = `
        .leaflet-container { width:100%; height:70vh; }
        .boat-div-icon img { width:40px; height:40px; object-fit:contain; display:block }
        .boat-div-icon { pointer-events: auto; }
      `;
      document.head.appendChild(style);
    }

    if (!containerRef.current) return;

    // initialize map once
    if (!mapRef.current) {
      mapRef.current = L.map(containerRef.current).setView(center, 13);
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors'
      }).addTo(mapRef.current);

      // user location marker placeholder
      // create markers for mock spots
      MOCK_SPOTS.forEach(spot => {
        const absLogo = `${window.location.origin}${defaultLogoPath}`;
        const icon = L.divIcon({
          html: `<img src="${absLogo}" alt="boat" />`,
          className: 'boat-div-icon',
          iconSize: defaultIconOptions.iconSize,
          iconAnchor: defaultIconOptions.iconAnchor,
          popupAnchor: defaultIconOptions.popupAnchor
        });

        const m = L.marker(spot.position, { icon }).addTo(mapRef.current);
        m.bindPopup(`<div style="max-width:220px"><strong>${spot.name}</strong><div>Size: ${spot.size}</div><div>Price: ${spot.price}</div></div>`);
        markerRefs.current[spot.id] = m;

        // circle fallback
        L.circleMarker(spot.position, { radius: 8, color: spot.available ? '#1976d2' : '#ff9800', weight: 2, fillOpacity: 0.9 }).addTo(mapRef.current);
      });
    }

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, []);

  const handleLocate = () => {
    if (!navigator.geolocation || !mapRef.current) return alert('Geolocation not supported');
    setIsLocating(true);
    navigator.geolocation.getCurrentPosition((pos) => {
      const coords = [pos.coords.latitude, pos.coords.longitude];
      L.marker(coords).addTo(mapRef.current).bindPopup('Your location').openPopup();
      mapRef.current.flyTo(coords, 13);
      setIsLocating(false);
    }, () => { setIsLocating(false); alert('Unable to retrieve location'); });
  };

  const flyToSpot = (spot) => {
    if (!mapRef.current) return;
    mapRef.current.flyTo(spot.position, 15, { duration: 0.8 });
    const m = markerRefs.current[spot.id];
    if (m) m.openPopup();
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="md:col-span-2">
        <Paper elevation={3} className="p-0 overflow-hidden">
          <div ref={containerRef} />
        </Paper>
      </div>

      <div className="md:col-span-1">
        <Paper className="p-4">
          <div className="flex items-center justify-between mb-4">
            <Typography variant="h6">Available Spots</Typography>
            <Button variant="outlined" size="small" onClick={handleLocate}>{isLocating ? 'Locating…' : 'Locate me'}</Button>
          </div>

          <div className="space-y-4">
            {MOCK_SPOTS.map(spot => (
              <Card key={spot.id} className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => flyToSpot(spot)}>
                <CardContent>
                  <Typography variant="subtitle1">{spot.name}</Typography>
                  <Typography variant="body2" color="text.secondary">Size: {spot.size}</Typography>
                  <Typography variant="body2" color="text.secondary">Price: {spot.price}</Typography>
                  <Button variant="contained" size="small" className="mt-2 fullWidth">View on Map</Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </Paper>
      </div>
    </div>
  );
}
