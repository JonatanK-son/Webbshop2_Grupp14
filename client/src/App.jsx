import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import { Box, AppBar, Toolbar, Typography, Button, Menu, MenuItem, 
  Container, IconButton, Badge, Collapse, Drawer, List, ListItem, ListItemText, 
  ListItemAvatar, Avatar, Divider, Paper } from '@mui/material';
import { styled } from '@mui/material/styles';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import PersonIcon from '@mui/icons-material/Person';
import { useState } from 'react';
import React from 'react';
import { useCart } from './context/CartContext';
import { useUser } from './context/UserContext';
import CartDrawer from './components/CartDrawer';
import CartButton from './components/CartButton';

const Main = styled('main')(({ theme }) => ({
  flexGrow: 1,
  padding: 0,
  width: '100%',
}));

const StyledMenu = styled(Box)(({ theme }) => ({
  width: '100%',
  backgroundColor: '#f5f5f5',
  borderBottom: '1px solid #e0e0e0',
}));

const MenuContainer = styled(Container)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'center',
  gap: theme.spacing(4),
  padding: theme.spacing(2, 4),
  [theme.breakpoints.down('sm')]: {
    flexDirection: 'column',
    gap: theme.spacing(2),
    alignItems: 'center',
  }
}));

const CartDrawerHeader = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: theme.spacing(1, 2),
  borderBottom: '1px solid #e0e0e0',
}));

const TotalContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: theme.spacing(0.5, 2),
}));

const QuantityControl = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(0.5),
}));

function App() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [userMenuAnchor, setUserMenuAnchor] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();
  
  // Use cart context
  const { 
    cartItems, 
    cartOpen, 
    cartItemCount, 
    subtotal, 
    shipping, 
    total, 
    removeFromCart, 
    updateQuantity, 
    toggleCart, 
    setCartOpen 
  } = useCart();

  // Use user context
  const { currentUser, isAuthenticated, logout } = useUser();

  const handleMenuToggle = () => {
    setMenuOpen(!menuOpen);
  };

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

  const menuItems = [
    { name: "Home", path: "/" },
    { name: "All Products", path: "/products" }
  ];

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <AppBar
        position="static"
        sx={{
          backgroundColor: '#fff',
          color: '#000',
          boxShadow: 'none',
          borderBottom: '1px solid #e0e0e0',
        }}
      >
        <Toolbar sx={{ px: { xs: 1, sm: 2, md: 3 } }}>
          <IconButton
            color="inherit"
            aria-label="open menu"
            edge="start"
            onClick={handleMenuToggle}
            sx={{ mr: 1 }}
          >
            <MenuIcon />
          </IconButton>
          <Typography 
            variant="h6" 
            component="div" 
            sx={{ 
              flexGrow: 1, 
              fontWeight: 'bold',
              letterSpacing: '1px',
              cursor: 'pointer'
            }}
            onClick={() => navigate('/')}
          >
            WEBSHOP
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Button 
              color="inherit" 
              onClick={() => navigate('/')}
              sx={{ 
                mx: { xs: 0.5, sm: 1 },
                '&:hover': {
                  backgroundColor: 'transparent',
                  color: '#555'
                }
              }}
            >
              Home
            </Button>
            <Button 
              color="inherit" 
              onClick={() => navigate('/products')}
              sx={{ 
                mx: { xs: 0.5, sm: 1 },
                '&:hover': {
                  backgroundColor: 'transparent',
                  color: '#555'
                }
              }}
            >
              Products
            </Button>
            
            {/* User Authentication buttons */}
            {isAuthenticated ? (
              <>
                <IconButton 
                  color="inherit"
                  onClick={handleUserMenuOpen}
                  sx={{ mx: { xs: 0.5, sm: 1 } }}
                >
                  <PersonIcon />
                </IconButton>
                <Menu
                  anchorEl={userMenuAnchor}
                  open={Boolean(userMenuAnchor)}
                  onClose={handleUserMenuClose}
                >
                  <MenuItem disabled>
                    <Typography variant="body2">
                      Signed in as <strong>{currentUser?.username}</strong>
                    </Typography>
                  </MenuItem>
                  <Divider />
                  {currentUser?.role === 'admin' && (
                    <MenuItem onClick={() => {
                      handleUserMenuClose();
                      navigate('/admin');
                    }}>
                      Admin Dashboard
                    </MenuItem>
                  )}
                  <MenuItem onClick={handleLogout}>Logout</MenuItem>
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
      </AppBar>
      
      {/* Top dropdown menu */}
      <Collapse in={menuOpen}>
        <StyledMenu>
          <MenuContainer>
            <Collapse in={menuOpen} timeout="auto" unmountOnExit sx={{ width: '100%' }}>
              <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, justifyContent: 'center', gap: 2 }}>
                {menuItems.map((item) => (
                  <Button
                    key={item.name}
                    component={Link}
                    to={item.path}
                    sx={{
                      color: location.pathname === item.path ? 'primary.main' : 'text.primary',
                      fontWeight: location.pathname === item.path ? 'bold' : 'regular',
                    }}
                  >
                    {item.name}
                  </Button>
                ))}
              </Box>
            </Collapse>
          </MenuContainer>
        </StyledMenu>
      </Collapse>
      
      {/* Cart Drawer */}
      <CartDrawer />
      
      <Main>
        <Container 
          maxWidth={false} 
          disableGutters
          sx={{ 
            width: '100%',
            p: 0
          }}
        >
          <Outlet />
        </Container>
      </Main>
    </Box>
  );
}

export default App;
