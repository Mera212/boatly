"use client";

import { useState } from 'react';
import { Button, TextField, Typography, Paper } from '@mui/material';

export default function RegisterForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleSubmit = (event) => {
    event.preventDefault();
    // You can add your registration logic here
    if (password !== confirmPassword) {
      alert("Passwords don't match!");
      return;
    }
    console.log('Registering with:', { email, password });
  };

  return (
    <Paper elevation={3} className="p-8 rounded-lg w-full max-w-sm bg-white dark:bg-gray-800">
      <Typography variant="h4" component="h1" className="text-center mb-6">
        Register
      </Typography>
      <form onSubmit={handleSubmit} className="flex flex-col gap-6">
        <TextField
          label="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <TextField
          label="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <TextField
          label="Confirm Password"
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
        />
        <Button type="submit" variant="contained" size="large">
          Create Account
        </Button>
      </form>
    </Paper>
  );
}
