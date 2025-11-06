"use client";

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Container, Box, Button, Paper, Typography } from '@mui/material';
import Stats from '../Stats';
import Calendar from '../Calendar';
import { useSession, signOut } from 'next-auth/react';

const MOCK_BOOKINGS = {
  // format: 'YYYY-M-D'
  '2025-11-6': true,
  '2025-11-12': true,
};

export default function LandlordDashboard() {
  const router = useRouter();
  const { data: session, status } = useSession();

  useEffect(() => {
    if (status === 'unauthenticated') router.push('/landlord/login');
  }, [status]);

  if (status === 'loading') return <div className="p-6">Loading…</div>;

  if (!session) return null;

  // require landlord role
  if (session.user?.role !== 'landlord') {
    return (
      <div className="p-6">
        <Paper className="p-4">You are not authorized to view this page.</Paper>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-4">
        <Typography variant="h4">Landlord Dashboard</Typography>
        <div>
          <Button variant="outlined" onClick={() => router.push('/')}>Back</Button>
          <Button variant="outlined" color="error" className="ml-2" onClick={() => signOut({ callbackUrl: '/' })}>Sign out</Button>
        </div>
      </div>

      <Container maxWidth="lg">
        <Stats />

        <Box className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
          <Calendar bookings={MOCK_BOOKINGS} />
          <Paper className="p-4">
            <Typography variant="h6">Recent Activity</Typography>
            <ul className="mt-2 list-disc pl-6">
              <li>New reservation on 2025-11-06</li>
              <li>Payment received for Spot A1</li>
            </ul>
          </Paper>
        </Box>
      </Container>
    </div>
  );
}
