import React from 'react';
import { Box, Typography, Paper, List, ListItem, ListItemText, ListItemAvatar, Avatar, 
  Divider, Button, IconButton, Grid } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { styled } from '@mui/material/styles';

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

const CartPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  marginBottom: theme.spacing(3),
}));

const TotalContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: theme.spacing(2, 0),
}));

function Cart() {
  // Calculate cart totals
  const subtotal = sampleCartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const shipping = subtotal > 0 ? 10 : 0;
  const total = subtotal + shipping;

  return (
    <Box sx={{ flexGrow: 1 }}>
      <Typography variant="h4" gutterBottom sx={{ fontWeight: 'medium', color: '#333' }}>
        Shopping Cart
      </Typography>
      
      <Grid container spacing={4}>
        <Grid item xs={12} md={8}>
          <CartPaper elevation={2}>
            {sampleCartItems.length === 0 ? (
              <Typography variant="h6" sx={{ textAlign: 'center', py: 4 }}>
                Your cart is empty.
              </Typography>
            ) : (
              <List>
                {sampleCartItems.map((item, index) => (
                  <React.Fragment key={item.id}>
                    <ListItem 
                      secondaryAction={
                        <IconButton edge="end" aria-label="delete">
                          <DeleteIcon />
                        </IconButton>
                      }
                    >
                      <ListItemAvatar>
                        <Avatar 
                          variant="rounded" 
                          src={item.image} 
                          alt={item.name}
                          sx={{ width: 80, height: 80, mr: 2 }}
                        />
                      </ListItemAvatar>
                      <ListItemText
                        primary={
                          <Typography variant="h6">{item.name}</Typography>
                        }
                        secondary={
                          <>
                            <Typography variant="body2" color="text.secondary">
                              Quantity: {item.quantity}
                            </Typography>
                            <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                              ${item.price} each
                            </Typography>
                          </>
                        }
                      />
                      <Typography variant="h6" sx={{ ml: 2 }}>
                        ${item.price * item.quantity}
                      </Typography>
                    </ListItem>
                    {index < sampleCartItems.length - 1 && <Divider />}
                  </React.Fragment>
                ))}
              </List>
            )}
          </CartPaper>
        </Grid>
        
        <Grid item xs={12} md={4}>
          <CartPaper elevation={2}>
            <Typography variant="h6" gutterBottom>
              Order Summary
            </Typography>
            <Divider sx={{ mb: 2 }} />
            
            <TotalContainer>
              <Typography variant="body1">Subtotal</Typography>
              <Typography variant="body1">${subtotal}</Typography>
            </TotalContainer>
            
            <TotalContainer>
              <Typography variant="body1">Shipping</Typography>
              <Typography variant="body1">${shipping}</Typography>
            </TotalContainer>
            
            <Divider sx={{ my: 2 }} />
            
            <TotalContainer>
              <Typography variant="h6">Total</Typography>
              <Typography variant="h6">${total}</Typography>
            </TotalContainer>
            
            <Button 
              variant="contained" 
              fullWidth 
              size="large"
              sx={{ 
                mt: 2,
                backgroundColor: '#000',
                '&:hover': {
                  backgroundColor: '#333',
                }
              }}
            >
              Checkout
            </Button>
          </CartPaper>
        </Grid>
      </Grid>
    </Box>
  );
}

export default Cart; 