"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { 
  Paper, Typography, Card, CardContent, 
  Button, CircularProgress 
} from '@mui/material';
import LoadingSpinner from '../components/ui/LoadingSpinner';

// Mock data for available spots
const MOCK_SPOTS = [
  { 
    id: 1, 
    position: [60.1699, 24.9384], // Helsinki
    name: "Helsinki Marina Spot A1",
    size: "40ft",
    price: "€50/day",
    available: true
  },
  {
    id: 2,
    position: [60.1699, 24.9584], // Nearby
    name: "East Harbor B12",
    size: "35ft",
    price: "€45/day",
    available: true
  }
];

const center = [60.1699, 24.9384]; // Helsinki center

export default function MapView() {
  // Fix for default marker icons
  useEffect(() => {
    delete L.Icon.Default.prototype._getIconUrl;
    L.Icon.Default.mergeOptions({
      iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
      iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
      shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
    });
  }, []);

  const router = useRouter();
  const [selectedSpot, setSelectedSpot] = useState(null);
  const [userLocation, setUserLocation] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Get user's location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
          setIsLoading(false);
        },
        () => {
          setIsLoading(false);
        }
      );
    } else {
      setIsLoading(false);
    }
  }, []);

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-4">
        <Typography variant="h4" component="h1" gutterBottom>
          Find Available Spots
        </Typography>
        <Button variant="outlined" onClick={() => router.push('/dashboard')}>
          Back to Dashboard
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Map */}
        <div className="md:col-span-2">
          <Paper elevation={3} className="p-0 overflow-hidden">
            <MapContainer
              center={userLocation ? [userLocation.lat, userLocation.lng] : center}
              zoom={13}
              style={{ height: "70vh", width: "100%" }}
            >
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              />
              
              {/* User's location marker */}
              {userLocation && (
                <Marker position={[userLocation.lat, userLocation.lng]}>
                  <Popup>Your Location</Popup>
                </Marker>
              )}

              {/* Available spots markers */}
              {MOCK_SPOTS.map(spot => (
                <Marker
                  key={spot.id}
                  position={spot.position}
                  eventHandlers={{
                    click: () => setSelectedSpot(spot)
                  }}
                >
                  <Popup>
                    <div className="p-2">
                      <Typography variant="subtitle1">{spot.name}</Typography>
                      <Typography variant="body2">Size: {spot.size}</Typography>
                      <Typography variant="body2">Price: {spot.price}</Typography>
                      <Button
                        variant="contained"
                        color="primary"
                        size="small"
                        className="mt-2"
                        fullWidth
                      >
                        Reserve Spot
                      </Button>
                    </div>
                  </Popup>
                </Marker>
              ))}
            </MapContainer>
          </Paper>
        </div>

        {/* List of spots */}
        <div className="md:col-span-1">
          <Paper className="p-4">
            <Typography variant="h6" gutterBottom>
              Available Spots
            </Typography>
            <div className="space-y-4">
              {MOCK_SPOTS.map(spot => (
                <Card 
                  key={spot.id}
                  className="cursor-pointer hover:shadow-lg transition-shadow"
                  onClick={() => setSelectedSpot(spot)}
                >
                  <CardContent>
                    <Typography variant="subtitle1">{spot.name}</Typography>
                    <Typography variant="body2" color="text.secondary">
                      Size: {spot.size}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Price: {spot.price}
                    </Typography>
                    <Button
                      variant="contained"
                      color="primary"
                      size="small"
                      className="mt-2"
                      fullWidth
                    >
                      Reserve Spot
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </Paper>
        </div>
      </div>
    </div>
  );
}