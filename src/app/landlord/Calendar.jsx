"use client";

import React, { useState } from 'react';
import { Paper, Typography, IconButton } from '@mui/material';
import { ChevronLeft, ChevronRight } from '@mui/icons-material';

function getMonthMatrix(year, month) {
  const first = new Date(year, month, 1);
  const startDay = first.getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const matrix = [];
  let row = new Array(7).fill(null);
  let day = 1;
  for (let i = 0; i < startDay; i++) row[i] = null;
  for (let i = startDay; i < 7; i++) {
    row[i] = day++;
  }
  matrix.push(row);
  while (day <= daysInMonth) {
    row = new Array(7).fill(null);
    for (let i = 0; i < 7 && day <= daysInMonth; i++) {
      row[i] = day++;
    }
    matrix.push(row);
  }
  return matrix;
}

export default function Calendar({ bookings = {} }) {
  const today = new Date();
  const [year, setYear] = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth());

  const matrix = getMonthMatrix(year, month);

  const prev = () => {
    if (month === 0) { setMonth(11); setYear(year - 1); } else setMonth(month - 1);
  };
  const next = () => {
    if (month === 11) { setMonth(0); setYear(year + 1); } else setMonth(month + 1);
  };

  const monthName = new Date(year, month).toLocaleString(undefined, { month: 'long' });

  return (
    <Paper className="p-4">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <IconButton size="small" onClick={prev}><ChevronLeft /></IconButton>
          <Typography variant="h6">{monthName} {year}</Typography>
          <IconButton size="small" onClick={next}><ChevronRight /></IconButton>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-1 text-center">
        {['Sun','Mon','Tue','Wed','Thu','Fri','Sat'].map(d => (
          <div key={d} className="text-xs font-semibold">{d}</div>
        ))}
        {matrix.flat().map((day, idx) => {
          const isBooked = day && bookings[`${year}-${month+1}-${day}`];
          return (
            <div key={idx} className={`p-2 h-16 border rounded ${isBooked ? 'bg-red-100' : ''}`}>
              <div className="text-sm">{day || ''}</div>
              {isBooked && <div className="text-xs text-red-700">Booked</div>}
            </div>
          );
        })}
      </div>
    </Paper>
  );
}
