import React from 'react';
import {
  Drawer,
  Box,
  Typography,
  IconButton,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Button,
  Divider,
  Badge,
  Grid,
  CircularProgress,
  Alert
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import DeleteIcon from '@mui/icons-material/Delete';
import ShoppingBagIcon from '@mui/icons-material/ShoppingBag';
import { useCart } from '../context/CartContext';
import { Link } from 'react-router-dom';

const CartDrawer = () => {
  const {
    cartItems,
    cartOpen,
    setCartOpen,
    removeFromCart,
    updateQuantity,
    clearCart,
    subtotal,
    shipping,
    total,
    loading,
    error
  } = useCart();

  const handleClose = () => {
    setCartOpen(false);
  };

  return (
    <Drawer
      anchor="right"
      open={cartOpen}
      onClose={handleClose}
      sx={{
        '& .MuiDrawer-paper': {
          width: { xs: '100%', sm: 380 },
          padding: 2,
          boxSizing: 'border-box',
        },
      }}
    >
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h6" component="div">
          Your Cart
        </Typography>
        <IconButton onClick={handleClose}>
          <CloseIcon />
        </IconButton>
      </Box>

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
          <CircularProgress />
        </Box>
      ) : error ? (
        <Alert severity="error" sx={{ my: 2 }}>
          {error}
        </Alert>
      ) : cartItems.length === 0 ? (
        <Box sx={{ textAlign: 'center', my: 4 }}>
          <ShoppingBagIcon sx={{ fontSize: 60, color: 'text.secondary', mb: 2 }} />
          <Typography variant="h6">Your cart is empty</Typography>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            Add items to get started
          </Typography>
          <Button
            variant="contained"
            component={Link}
            to="/products"
            sx={{ mt: 2 }}
            onClick={handleClose}
          >
            Shop Now
          </Button>
        </Box>
      ) : (
        <>
          <Box sx={{ flexGrow: 1, overflow: 'auto' }}>
            <List>
              {cartItems.map((item) => (
                <ListItem
                  key={item.id}
                  alignItems="flex-start"
                  secondaryAction={
                    <IconButton edge="end" onClick={() => removeFromCart(item.id)}>
                      <DeleteIcon />
                    </IconButton>
                  }
                  sx={{ py: 2 }}
                >
                  <ListItemAvatar>
                    <Avatar
                      variant="rounded"
                      alt={item.name}
                      src={item.image}
                      sx={{ width: 60, height: 60, mr: 2 }}
                    />
                  </ListItemAvatar>
                  <ListItemText
                    primary={item.name}
                    secondary={
                      <Box sx={{ mt: 1 }}>
                        <Typography variant="body2" color="text.primary">
                          ${item.price.toFixed(2)}
                        </Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                          <IconButton
                            size="small"
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          >
                            <RemoveIcon fontSize="small" />
                          </IconButton>
                          <Typography sx={{ mx: 1 }}>{item.quantity}</Typography>
                          <IconButton
                            size="small"
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          >
                            <AddIcon fontSize="small" />
                          </IconButton>
                        </Box>
                      </Box>
                    }
                  />
                </ListItem>
              ))}
            </List>
          </Box>

          <Box sx={{ position: 'sticky', bottom: 0, bgcolor: 'background.paper', pt: 2 }}>
            <Button
              variant="text"
              startIcon={<DeleteIcon />}
              onClick={clearCart}
              sx={{ mb: 2 }}
            >
              Clear Cart
            </Button>

            <Divider />

            <Grid container spacing={1} sx={{ py: 2 }}>
              <Grid item xs={6}>
                <Typography variant="body1">Subtotal</Typography>
              </Grid>
              <Grid item xs={6} sx={{ textAlign: 'right' }}>
                <Typography variant="body1">${subtotal.toFixed(2)}</Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="body1">Shipping</Typography>
              </Grid>
              <Grid item xs={6} sx={{ textAlign: 'right' }}>
                <Typography variant="body1">${shipping.toFixed(2)}</Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="h6">Total</Typography>
              </Grid>
              <Grid item xs={6} sx={{ textAlign: 'right' }}>
                <Typography variant="h6">${total.toFixed(2)}</Typography>
              </Grid>
            </Grid>

            <Button
              variant="contained"
              fullWidth
              size="large"
              component={Link}
              to="/checkout"
              onClick={handleClose}
              sx={{
                backgroundColor: '#000',
                '&:hover': { backgroundColor: '#333' },
                py: 1.5,
                mt: 2,
              }}
            >
              Checkout
            </Button>
          </Box>
        </>
      )}
    </Drawer>
  );
};

export default CartDrawer; 