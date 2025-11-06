"use client";

import React, { useState } from 'react';
import { Box, TextField, Button, Paper, Typography, Alert } from '@mui/material';
import { useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react';

export default function LandlordLogin() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    const res = await signIn('credentials', { redirect: false, email, password });
    if (res?.ok) {
      router.push('/landlord/dashboard');
    } else {
      setError('Invalid credentials');
    }
  };

  return (
    <div className="p-6 flex justify-center">
      <Paper className="p-6 w-full max-w-md">
        <Typography variant="h5" gutterBottom>Landlord Login</Typography>
        <Box component="form" onSubmit={handleSubmit} noValidate>
          {error && <Alert severity="error" className="mb-4">{error}</Alert>}
          <TextField label="Email" value={email} onChange={(e)=>setEmail(e.target.value)} fullWidth margin="normal" required />
          <TextField label="Password" type="password" value={password} onChange={(e)=>setPassword(e.target.value)} fullWidth margin="normal" required />
          <Button type="submit" variant="contained" color="primary" fullWidth className="mt-4">Sign in</Button>
        </Box>
      </Paper>
    </div>
  );
}
