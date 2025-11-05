"use client";

import { CircularProgress } from '@mui/material';

export default function LoadingSpinner() {
  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-65px)] bg-gray-50 dark:bg-gray-900">
      <div className="text-center">
        <CircularProgress size={40} className="mb-4" />
        <p className="text-gray-600 dark:text-gray-300">Loading...</p>
      </div>
    </div>
  );
}