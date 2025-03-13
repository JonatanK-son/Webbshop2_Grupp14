import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import { Box, AppBar, Toolbar, Typography, Button, Menu, MenuItem, 
  Container, IconButton, Badge, Collapse, Drawer, List, ListItem, ListItemText, 
  ListItemAvatar, Avatar, Divider, Paper } from '@mui/material';
import { styled } from '@mui/material/styles';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import DeleteIcon from '@mui/icons-material/Delete';
import { useState, useEffect } from 'react';
import React from 'react';

// Sample cart items - in a real app, this would come from state or context
const sampleCartItems = [
  {
    id: 1,
    name: 'Product 1',
    price: 199,
    quantity: 2,
    image: 'https://via.placeholder.com/300x200',
  },
  {
    id: 3,
    name: 'Product 3',
    price: 399,
    quantity: 1,
    image: 'https://via.placeholder.com/300x200',
  }
];

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

function App() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState(sampleCartItems);

  const handleMenuToggle = () => {
    setMenuOpen(!menuOpen);
  };

  const handleCartToggle = () => {
    setCartOpen(!cartOpen);
  };

  const handleRemoveItem = (itemId) => {
    setCartItems(cartItems.filter(item => item.id !== itemId));
  };

  // Calculate cart totals
  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const shipping = subtotal > 0 ? 10 : 0;
  const total = subtotal + shipping;
  const cartItemCount = cartItems.reduce((count, item) => count + item.quantity, 0);

  const menuItems = [
    { name: "Home", path: "/" },
    { name: "All Products", path: "/products" },
    { name: "Admin", path: "/admin" }
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
            WEBBSHOP
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
            <IconButton 
              color="inherit" 
              onClick={handleCartToggle} 
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
            {menuItems.map((item, index) => (
              <Button 
                key={index}
                onClick={() => {
                  navigate(item.path);
                  setMenuOpen(false);
                }}
                sx={{ 
                  color: '#333',
                  fontWeight: 'medium',
                  fontSize: '1rem',
                  '&:hover': {
                    backgroundColor: 'transparent',
                    color: '#000'
                  }
                }}
              >
                {item.name}
              </Button>
            ))}
          </MenuContainer>
        </StyledMenu>
      </Collapse>
      
      {/* Cart Drawer */}
      <Drawer
        anchor="right"
        open={cartOpen}
        onClose={handleCartToggle}
        sx={{
          '& .MuiDrawer-paper': {
            width: { xs: '100%', sm: 350 },
            boxSizing: 'border-box',
          },
        }}
      >
        <CartDrawerHeader>
          <Typography variant="subtitle1" sx={{ fontWeight: 'medium' }}>Your Cart ({cartItemCount})</Typography>
          <IconButton size="small" onClick={handleCartToggle}>
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
                handleCartToggle();
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
                      <IconButton edge="end" size="small" aria-label="delete" onClick={() => handleRemoveItem(item.id)}>
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
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Typography variant="caption" color="text.secondary">
                            Qty: {item.quantity}
                          </Typography>
                          <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                            ${item.price}
                          </Typography>
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
