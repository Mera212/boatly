"use client";

import React from 'react';
import dynamic from 'next/dynamic';
import { CircularProgress } from '@mui/material';

// Import ClientMap with no SSR
const Map = dynamic(() => import('./ClientMap'), {
  ssr: false,
  loading: () => (
    <div className="flex justify-center items-center" style={{ height: '70vh' }}>
      <CircularProgress />
    </div>
  )
});

export default function MapWrapper() {
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="flex justify-center items-center" style={{ height: '70vh' }}>
        <CircularProgress />
      </div>
    );
  }

  return <Map />;
}