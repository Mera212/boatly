"use client";

import { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, CircleMarker } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Delete default icon's URL
delete L.Icon.Default.prototype._getIconUrl;

// Set default icon URLs
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const DynamicMap = (props) => {
  useEffect(() => {
    // Any initialization that needs to happen after mount
  }, []);

  return (
    <MapContainer {...props}>
      {props.children}
    </MapContainer>
  );
};

export default DynamicMap;