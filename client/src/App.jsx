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
            
            <IconButton 
              color="inherit" 
              onClick={toggleCart} 
              sx={{ ml: { xs: 0.5, sm: 1 } }}
            >
              <Badge badgeContent={cartItemCount} color="primary">
                <ShoppingCartIcon />
              </Badge>
            </IconButton>
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
      <Drawer
        anchor="right"
        open={cartOpen}
        onClose={() => setCartOpen(false)}
        sx={{
          '& .MuiDrawer-paper': {
            width: { xs: '100%', sm: 350 },
            boxSizing: 'border-box',
          },
        }}
      >
        <CartDrawerHeader>
          <Typography variant="subtitle1" sx={{ fontWeight: 'medium' }}>Your Cart ({cartItemCount})</Typography>
          <IconButton size="small" onClick={() => setCartOpen(false)}>
            <CloseIcon fontSize="small" />
          </IconButton>
        </CartDrawerHeader>
        
        {cartItems.length === 0 ? (
          <Box sx={{ p: 2, textAlign: 'center' }}>
            <Typography variant="body2">Your cart is empty</Typography>
            <Button 
              variant="contained" 
              size="small"
              onClick={() => {
                navigate('/products');
                setCartOpen(false);
              }}
              sx={{ 
                mt: 1.5,
                backgroundColor: '#000',
                '&:hover': {
                  backgroundColor: '#333',
                }
              }}
            >
              Shop Now
            </Button>
          </Box>
        ) : (
          <>
            <List sx={{ flexGrow: 1, overflow: 'auto', py: 0 }}>
              {cartItems.map((item, index) => (
                <React.Fragment key={item.id}>
                  <ListItem 
                    dense
                    secondaryAction={
                      <IconButton edge="end" size="small" aria-label="delete" onClick={() => removeFromCart(item.id)}>
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    }
                  >
                    <ListItemAvatar>
                      <Avatar 
                        variant="rounded" 
                        src={item.image} 
                        alt={item.name}
                        sx={{ width: 40, height: 40, mr: 1 }}
                      />
                    </ListItemAvatar>
                    <ListItemText
                      primary={
                        <Typography variant="body2" noWrap sx={{ fontWeight: 'medium' }}>
                          {item.name}
                        </Typography>
                      }
                      secondary={
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                          <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                            ${item.price}
                          </Typography>
                          <QuantityControl>
                            <IconButton 
                              size="small" 
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                              sx={{ p: 0.3 }}
                            >
                              <RemoveIcon fontSize="small" />
                            </IconButton>
                            <Typography variant="caption" sx={{ mx: 0.5 }}>
                              {item.quantity}
                            </Typography>
                            <IconButton 
                              size="small" 
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              sx={{ p: 0.3 }}
                            >
                              <AddIcon fontSize="small" />
                            </IconButton>
                          </QuantityControl>
                        </Box>
                      }
                    />
                  </ListItem>
                  {index < cartItems.length - 1 && <Divider />}
                </React.Fragment>
              ))}
            </List>
            
            <Paper 
              elevation={0} 
              sx={{ 
                p: 1.5, 
                borderTop: '1px solid #e0e0e0',
                position: 'sticky',
                bottom: 0,
                backgroundColor: '#fff'
              }}
            >
              <TotalContainer>
                <Typography variant="body2">Subtotal</Typography>
                <Typography variant="body2">${subtotal}</Typography>
              </TotalContainer>
              
              <TotalContainer>
                <Typography variant="body2">Shipping</Typography>
                <Typography variant="body2">${shipping}</Typography>
              </TotalContainer>
              
              <Divider sx={{ my: 1 }} />
              
              <TotalContainer>
                <Typography variant="subtitle2">Total</Typography>
                <Typography variant="subtitle2">${total}</Typography>
              </TotalContainer>
              
              <Button 
                variant="contained" 
                fullWidth 
                size="small"
                sx={{ 
                  mt: 1.5,
                  backgroundColor: '#000',
                  '&:hover': {
                    backgroundColor: '#333',
                  }
                }}
              >
                Checkout
              </Button>
            </Paper>
          </>
        )}
      </Drawer>
      
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
