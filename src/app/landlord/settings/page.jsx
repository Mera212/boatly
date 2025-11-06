"use client";

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { Paper, Typography, TextField, Button, IconButton, Box, List, ListItem, ListItemText } from '@mui/material';
import { Delete, Edit, Save } from '@mui/icons-material';

export default function LandlordSettings() {
  const router = useRouter();
  const { data: session, status } = useSession();

  const [spots, setSpots] = useState([]);
  const [editingIndex, setEditingIndex] = useState(-1);
  const [form, setForm] = useState({ name: '', size: 'Small', price: 0 });
  const [marina, setMarina] = useState({ name: '', address: '' });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === 'unauthenticated') router.push('/landlord/login');
    if (status === 'authenticated') {
      // Load marina and spots data
      const loadData = async () => {
        try {
          setLoading(true);
          const [marinaRes, spotsRes] = await Promise.all([
            fetch('/api/marina'),
            fetch('/api/spots')
          ]);
          
          if (marinaRes.ok) {
            const marinaData = await marinaRes.json();
            if (marinaData._id) setMarina(marinaData);
          }
          
          if (spotsRes.ok) {
            const spotsData = await spotsRes.json();
            setSpots(spotsData);
          }
        } catch (error) {
          console.error('Failed to load data:', error);
        } finally {
          setLoading(false);
        }
      };
      
      loadData();
    }
  }, [status]);

  if (status === 'loading') return <div className="p-6">Loading…</div>;
  if (!session) return null;
  if (session.user?.role !== 'landlord') return <div className="p-6">Not authorized</div>;

  const saveMarina = async () => {
    if (!marina.name.trim() || !marina.address.trim()) {
      alert('Please provide both marina name and address');
      return;
    }
    
    try {
      const res = await fetch('/api/marina', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(marina)
      });
      
      if (!res.ok) throw new Error('Failed to save marina');
      
      const updatedMarina = await res.json();
      setMarina(updatedMarina);
    } catch (error) {
      console.error('Failed to save marina:', error);
      alert('Failed to save marina details');
    }
  };

  const startEdit = (i) => {
    setEditingIndex(i);
    const s = spots[i];
    setForm({ id: s._id, name: s.name, size: s.size, price: s.price });
  };

  const saveEdit = async () => {
    if (!form.name.trim()) {
      alert('Please enter a spot name');
      return;
    }

    try {
      const method = editingIndex === -1 ? 'POST' : 'PUT';
      const res = await fetch('/api/spots', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });

      if (!res.ok) throw new Error('Failed to save spot');

      const savedSpot = await res.json();
      
      if (editingIndex === -1) {
        setSpots([...spots, savedSpot]);
      } else {
        const updatedSpots = spots.map((s) => 
          s._id === savedSpot._id ? savedSpot : s
        );
        setSpots(updatedSpots);
      }
      
      setEditingIndex(-1);
      setForm({ name: '', size: 'Small', price: 0 });
    } catch (error) {
      console.error('Failed to save spot:', error);
      alert('Failed to save spot');
    }
  };

  const remove = async (i) => {
    const spot = spots[i];
    try {
      const res = await fetch('/api/spots', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: spot._id })
      });

      if (!res.ok) throw new Error('Failed to delete spot');

      const updatedSpots = spots.filter((_, idx) => idx !== i);
      setSpots(updatedSpots);
    } catch (error) {
      console.error('Failed to delete spot:', error);
      alert('Failed to delete spot');
    }
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-4">
        <Typography variant="h4">Landlord Settings</Typography>
        <div>
          <Button variant="outlined" onClick={() => router.push('/landlord/dashboard')}>Back</Button>
        </div>
      </div>

      <Paper className="p-4 mb-4">
        <Typography variant="h6">Marina Details</Typography>
        <Box component="form" className="mt-3" onSubmit={(e) => { e.preventDefault(); saveMarina(); }}>
          <TextField 
            label="Marina Name" 
            value={marina.name} 
            onChange={(e) => setMarina(m => ({...m, name: e.target.value}))} 
            fullWidth 
            margin="normal"
            disabled={loading}
          />
          <TextField 
            label="Marina Address" 
            value={marina.address} 
            onChange={(e) => setMarina(m => ({...m, address: e.target.value}))} 
            fullWidth 
            margin="normal" 
            multiline 
            rows={2}
            disabled={loading}
          />
          <Button 
            startIcon={<Save />} 
            variant="contained" 
            color="primary" 
            onClick={saveMarina}
            disabled={loading}
            className="mt-2"
          >
            Save Marina Details
          </Button>
        </Box>
      </Paper>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Paper className="p-4">
          <Typography variant="h6">Add / Edit Spot</Typography>
          <Box component="form" className="mt-3" onSubmit={(e)=>{e.preventDefault(); saveEdit();}}>
            <TextField label="Spot Name" value={form.name} onChange={(e)=>setForm(f=>({...f, name: e.target.value}))} fullWidth margin="normal" />
            <TextField label="Size" value={form.size} onChange={(e)=>setForm(f=>({...f, size: e.target.value}))} fullWidth margin="normal" />
            <TextField label="Price (€)" type="number" value={form.price} onChange={(e)=>setForm(f=>({...f, price: Number(e.target.value)}))} fullWidth margin="normal" />
            <div className="flex gap-2 mt-2">
              <Button startIcon={<Save />} variant="contained" color="primary" onClick={saveEdit}>{editingIndex===-1? 'Add Spot':'Save'}</Button>
              {editingIndex!==-1 && <Button variant="outlined" onClick={()=>{setEditingIndex(-1); setForm({ number:1, size:'Small', price:0 });}}>Cancel</Button>}
            </div>
          </Box>
        </Paper>

        <Paper className="p-4">
          <Typography variant="h6">Your Spots</Typography>
          <List>
            {spots.length===0 && <div className="p-4 text-sm text-gray-500">No spots yet. Add one.</div>}
            {spots.map((s, i) => (
              <ListItem key={s.id || i} secondaryAction={(
                <div>
                  <IconButton edge="end" aria-label="edit" onClick={()=>startEdit(i)}><Edit/></IconButton>
                  <IconButton edge="end" aria-label="delete" onClick={()=>remove(i)}><Delete/></IconButton>
                </div>
              )}>
                <ListItemText primary={`Spot #${s.number} — ${s.size}`} secondary={`€${s.price}`} />
              </ListItem>
            ))}
          </List>
        </Paper>
      </div>
    </div>
  );
}
