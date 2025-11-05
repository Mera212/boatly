"use client";

import dynamic from 'next/dynamic';

// Create a dynamic Map component that loads both Leaflet and its CSS
const DynamicMap = dynamic(() => import('./DynamicMap'), {
  ssr: false, // Disable server-side rendering
  loading: () => <div style={{ height: '70vh', width: '100%' }}>Loading map...</div>
});

export default DynamicMap;