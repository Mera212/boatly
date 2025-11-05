"use client";

import { Button, Typography } from '@mui/material';
import dynamic from 'next/dynamic';

const ClientMap = dynamic(() => import('./ClientMap'), {
  ssr: false,
  loading: () => (
    <div style={{ height: '70vh', width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      Loading map...
    </div>
  ),
});

export default function Page() {
  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-4">
        <Typography variant="h4" component="h1" gutterBottom>
          Find Available Spots
          <Button variant="outlined" size="small" href='/dashboard'>Dashboard</Button>
        </Typography>
      </div>

      <ClientMap />
    </div>
  );
}