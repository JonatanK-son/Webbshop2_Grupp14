import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  AppBar, Toolbar, Typography, Button, IconButton, Box, 
  Menu, MenuItem, Divider, ListItemIcon, Container
} from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';
import LogoutIcon from '@mui/icons-material/Logout';
import ReceiptIcon from '@mui/icons-material/Receipt';
import DashboardIcon from '@mui/icons-material/Dashboard';
import { useUser } from '../context/UserContext';
import CartButton from './CartButton';

const Navbar = () => {
  const [userMenuAnchor, setUserMenuAnchor] = useState(null);
  const navigate = useNavigate();
  const { isAuthenticated, currentUser, logout } = useUser();

  const handleUserMenuOpen = (event) => {
    setUserMenuAnchor(event.currentTarget);
  };

  const handleUserMenuClose = () => {
    setUserMenuAnchor(null);
  };

  const handleLogout = () => {
    logout();
    handleUserMenuClose();
    navigate('/');
  };

  return (
    <AppBar
      position="static"
      sx={{
        backgroundColor: '#fff',
        color: '#000',
        boxShadow: 'none',
        borderBottom: '1px solid #e0e0e0',
      }}
    >
      <Container maxWidth="xl">
        <Toolbar disableGutters sx={{ px: 0 }}>
          {/* Left side - Logo and Products link */}
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Typography 
              variant="h6" 
              component="div" 
              sx={{    
                fontWeight: 'bold',
                letterSpacing: '1px',
                cursor: 'pointer',
                mr: 2
              }}
              onClick={() => navigate('/')}
            >
              WEBSHOP
            </Typography>
            
            <Button 
              color="inherit" 
              onClick={() => navigate('/products')}
              sx={{ 
                ml: 1,
                '&:hover': {
                  backgroundColor: 'transparent',
                  color: '#555'
                }
              }}
            >
              Products
            </Button>
          </Box>
          
          {/* Spacer */}
          <Box sx={{ flexGrow: '1' }}></Box>
          
          {/* Right side - User controls and cart */}
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            {/* User Authentication */}
            {isAuthenticated ? (
              <>
                <IconButton 
                  color="inherit"
                  onClick={handleUserMenuOpen}
                  sx={{ 
                    mx: { xs: 0.5, sm: 1 },
                    border: '1px solid transparent',
                    transition: 'all 0.2s',
                    '&:hover': {
                      backgroundColor: 'rgba(0,0,0,0.04)',
                      borderColor: 'rgba(0,0,0,0.1)'
                    },
                    ...(Boolean(userMenuAnchor) && {
                      backgroundColor: 'rgba(0,0,0,0.04)'
                    })
                  }}
                  aria-label="account menu"
                  aria-controls="user-menu"
                  aria-haspopup="true"
                >
                  <PersonIcon />
                </IconButton>
                <Menu
                  anchorEl={userMenuAnchor}
                  open={Boolean(userMenuAnchor)}
                  onClose={handleUserMenuClose}
                  PaperProps={{
                    elevation: 3,
                    sx: { 
                      minWidth: 200,
                      borderRadius: '8px',
                      mt: 1.5
                    }
                  }}
                  transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                  anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                >
                  <MenuItem disabled sx={{ opacity: 0.7, py: 1 }}>
                    <Typography variant="body2">
                      Signed in as <strong>{currentUser?.username}</strong>
                    </Typography>
                  </MenuItem>
                  <Divider />
                  {currentUser?.role === 'admin' && (
                    <MenuItem onClick={() => {
                      handleUserMenuClose();
                      navigate('/admin');
                    }}
                    sx={{ py: 1.5, '&:hover': { backgroundColor: '#f5f5f5' } }}
                    >
                      <ListItemIcon>
                        <DashboardIcon fontSize="small" />
                      </ListItemIcon>
                      Admin Dashboard
                    </MenuItem>
                  )}
                  <MenuItem onClick={() => {
                    handleUserMenuClose();
                    navigate('/orders');
                  }}
                  sx={{ py: 1.5, '&:hover': { backgroundColor: '#f5f5f5' } }}
                  >
                    <ListItemIcon>
                      <ReceiptIcon fontSize="small" />
                    </ListItemIcon>
                    My Orders
                  </MenuItem>
                  <MenuItem onClick={handleLogout}
                  sx={{ py: 1.5, '&:hover': { backgroundColor: '#f5f5f5' } }}
                  >
                    <ListItemIcon>
                      <LogoutIcon fontSize="small" color="error" />
                    </ListItemIcon>
                    <Typography color="error">Logout</Typography>
                  </MenuItem>
                </Menu>
              </>
            ) : (
              <>
                <Button
                  color="inherit"
                  onClick={() => navigate('/login')}
                  sx={{ 
                    mx: { xs: 0.5, sm: 1 },
                    '&:hover': {
                      backgroundColor: 'transparent',
                      color: '#555'
                    }
                  }}
                >
                  Login
                </Button>
                <Button
                  variant="outlined"
                  onClick={() => navigate('/register')}
                  sx={{ 
                    mx: { xs: 0.5, sm: 1 },
                    borderColor: '#000',
                    color: '#000',
                    '&:hover': {
                      borderColor: '#555',
                      backgroundColor: 'transparent',
                      color: '#555'
                    }
                  }}
                >
                  Register
                </Button>
              </>
            )}
            
            <CartButton />
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default Navbar; 