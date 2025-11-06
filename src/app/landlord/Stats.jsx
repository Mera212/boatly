"use client";

import React from 'react';
import { Grid, Paper, Typography } from '@mui/material';

export default function Stats({ data }) {
  const stats = data || { spaces: 12, occupancy: 0.72, revenue: 3420 };

  return (
    <Grid container spacing={2} className="mb-4">
      <Grid item xs={12} sm={4}>
        <Paper className="p-4">
          <Typography variant="subtitle2">Total Spaces</Typography>
          <Typography variant="h5">{stats.spaces}</Typography>
        </Paper>
      </Grid>
      <Grid item xs={12} sm={4}>
        <Paper className="p-4">
          <Typography variant="subtitle2">Occupancy</Typography>
          <Typography variant="h5">{Math.round(stats.occupancy * 100)}%</Typography>
        </Paper>
      </Grid>
      <Grid item xs={12} sm={4}>
        <Paper className="p-4">
          <Typography variant="subtitle2">Monthly Revenue</Typography>
          <Typography variant="h5">€{stats.revenue}</Typography>
        </Paper>
      </Grid>
    </Grid>
  );
}
