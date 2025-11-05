"use client";

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { 
  Typography, Paper, Grid, Card, CardContent, CardActions,
  Button, IconButton, Badge, Avatar, Tooltip, Menu, MenuItem,
  Dialog, DialogTitle, DialogContent, DialogActions, TextField
} from '@mui/material';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import DirectionsBoatIcon from '@mui/icons-material/DirectionsBoat';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import SearchIcon from '@mui/icons-material/Search';
import NotificationsIcon from '@mui/icons-material/Notifications';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import AddIcon from '@mui/icons-material/Add';

// Mock data for the example
const MOCK_PARKING_SPACES = [
  { id: 1, name: "Dock A-12", status: "available", size: "40ft" },
  { id: 2, name: "Marina Spot B-7", status: "occupied", size: "35ft" }
];

const MOCK_RESERVATIONS = [
  { id: 1, spot: "Dock A-12", date: "2025-11-10", status: "upcoming" },
  { id: 2, spot: "Marina B-7", date: "2025-12-15", status: "pending" }
];

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [anchorEl, setAnchorEl] = useState(null);
  const [isAddSpaceOpen, setIsAddSpaceOpen] = useState(false);
  const [newSpace, setNewSpace] = useState({ name: '', size: '' });
  const [notification, setNotification] = useState(false);

  // Redirect to login if not authenticated
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push('/login');
    }
  }, [status, router]);

  useEffect(() => {
    // Simulate receiving a notification
    const timer = setTimeout(() => setNotification(true), 2000);
    return () => clearTimeout(timer);
  }, []);

  if (status === "loading") {
    return <LoadingSpinner />;
  }

  if (!session) {
    return null; // Will redirect via useEffect
  }

  const handleProfileClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleProfileClose = () => {
    setAnchorEl(null);
  };

  const handleAddSpace = () => {
    console.log('Adding new space:', newSpace);
    setIsAddSpaceOpen(false);
    setNewSpace({ name: '', size: '' });
    // Here you would typically make an API call to add the space
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header Section */}
      <div className="mb-8 flex justify-between items-center">
        <div>
          <Typography variant="h4" component="h1" gutterBottom>
            Welcome back, {session.user?.name || session.user?.email}
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Manage your boat parking spaces and reservations
          </Typography>
        </div>
        <div className="flex items-center gap-4">
          <Tooltip title="Notifications">
            <IconButton>
              <Badge badgeContent={notification ? 1 : 0} color="primary">
                <NotificationsIcon />
              </Badge>
            </IconButton>
          </Tooltip>
          <Tooltip title="Profile">
            <IconButton onClick={handleProfileClick}>
              {session.user?.image ? (
                <Avatar src={session.user.image} alt={session.user.name || ''} />
              ) : (
                <AccountCircleIcon />
              )}
            </IconButton>
          </Tooltip>
        </div>
      </div>

      {/* Quick Actions */}
      <Paper className="p-4 mb-6 bg-blue-50 dark:bg-blue-900">
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} sm="auto">
            <Typography variant="h6">Quick Actions</Typography>
          </Grid>
          <Grid item xs={12} sm="auto">
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => setIsAddSpaceOpen(true)}
            >
              Add Parking Space
            </Button>
          </Grid>
          <Grid item xs={12} sm="auto">
            <Button
              variant="outlined"
              startIcon={<SearchIcon />}
            >
              Find Available Spots
            </Button>
          </Grid>
        </Grid>
      </Paper>

      {/* Main Content */}
      <Grid container spacing={4}>
        {/* My Parking Spaces */}
        <Grid item xs={12} lg={8}>
          <Card>
            <CardContent>
              <Typography variant="h6" className="flex items-center gap-2 mb-4">
                <DirectionsBoatIcon /> My Parking Spaces
              </Typography>
              
              <div className="space-y-4">
                {MOCK_PARKING_SPACES.map((space) => (
                  <Paper key={space.id} className="p-4">
                    <div className="flex justify-between items-center">
                      <div>
                        <Typography variant="subtitle1">{space.name}</Typography>
                        <Typography variant="body2" color="text.secondary">
                          Size: {space.size}
                        </Typography>
                      </div>
                      <Button
                        variant="outlined"
                        color={space.status === 'available' ? 'success' : 'warning'}
                      >
                        {space.status}
                      </Button>
                    </div>
                  </Paper>
                ))}
              </div>
            </CardContent>
          </Card>
        </Grid>

        {/* Upcoming Reservations */}
        <Grid item xs={12} lg={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" className="flex items-center gap-2 mb-4">
                <CalendarMonthIcon /> Upcoming Reservations
              </Typography>
              
              <div className="space-y-4">
                {MOCK_RESERVATIONS.map((reservation) => (
                  <Paper key={reservation.id} className="p-4">
                    <Typography variant="subtitle2">{reservation.spot}</Typography>
                    <Typography variant="body2" color="text.secondary">
                      Date: {reservation.date}
                    </Typography>
                    <Typography 
                      variant="caption" 
                      className={`mt-2 px-2 py-1 rounded-full ${
                        reservation.status === 'upcoming' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-yellow-100 text-yellow-800'
                      }`}
                    >
                      {reservation.status}
                    </Typography>
                  </Paper>
                ))}
              </div>
            </CardContent>
            <CardActions>
              <Button fullWidth>View All Reservations</Button>
            </CardActions>
          </Card>
        </Grid>
      </Grid>

      {/* Profile Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleProfileClose}
      >
        <MenuItem onClick={handleProfileClose}>Profile Settings</MenuItem>
        <MenuItem onClick={handleProfileClose}>Billing</MenuItem>
        <MenuItem onClick={handleProfileClose}>Help Center</MenuItem>
      </Menu>

      {/* Add Space Dialog */}
      <Dialog open={isAddSpaceOpen} onClose={() => setIsAddSpaceOpen(false)}>
        <DialogTitle>Add New Parking Space</DialogTitle>
        <DialogContent>
          <div className="space-y-4 pt-4">
            <TextField
              fullWidth
              label="Space Name"
              value={newSpace.name}
              onChange={(e) => setNewSpace({ ...newSpace, name: e.target.value })}
            />
            <TextField
              fullWidth
              label="Size (ft)"
              value={newSpace.size}
              onChange={(e) => setNewSpace({ ...newSpace, size: e.target.value })}
            />
          </div>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsAddSpaceOpen(false)}>Cancel</Button>
          <Button onClick={handleAddSpace} variant="contained">Add Space</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}