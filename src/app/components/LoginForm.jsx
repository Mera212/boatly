"use client";

import { useState } from 'react';
import { Button, TextField, Typography, Paper, Divider } from '@mui/material';
import { signIn, useSession } from 'next-auth/react';

export default function LoginForm() {
  const { data: session } = useSession();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (event) => {
    event.preventDefault();
    // You can add your login logic here (fallback for non-OAuth)
    console.log('Login attempt with:', { email, password });
  };

  if (session) {
    return (
      <Paper elevation={3} className="p-8 rounded-lg w-full max-w-sm bg-white dark:bg-gray-800">
        <Typography variant="h6">Signed in</Typography>
        <Typography variant="body2">{session.user?.email}</Typography>
      </Paper>
    );
  }

  return (
    <Paper elevation={3} className="p-8 rounded-lg w-full max-w-sm bg-white dark:bg-gray-800">
      <Typography variant="h4" component="h1" className="text-center mb-6">
        Login
      </Typography>

      <div className="flex flex-col gap-3 mb-4">
        <Button variant="outlined" onClick={() => signIn('google')}>Sign in with Google</Button>
        <Button variant="outlined" onClick={() => signIn('apple')}>Sign in with Apple</Button>
      </div>

      <Divider className="my-4">or</Divider>

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
        <Button type="submit" variant="contained" size="large">
          Sign In
        </Button>
      </form>
    </Paper>
  );
}
