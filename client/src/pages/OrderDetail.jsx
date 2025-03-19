import React, { useState, useEffect } from 'react';
import { 
  Container, 
  Typography, 
  Box, 
  Paper, 
  Grid, 
  Divider, 
  Button, 
  List, 
  ListItem, 
  ListItemText, 
  ListItemAvatar, 
  Avatar, 
  Chip, 
  CircularProgress, 
  Alert 
} from '@mui/material';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useUser } from '../context/UserContext';
import { orderService } from '../services';

// Helper function to format dates
const formatDate = (dateString) => {
  const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
  return new Date(dateString).toLocaleDateString(undefined, options);
};

// Helper function to get status color
const getStatusColor = (status) => {
  const colors = {
    pending: 'warning',
    processing: 'info',
    shipped: 'primary',
    delivered: 'success',
    cancelled: 'error'
  };
  return colors[status] || 'default';
};

const OrderDetail = () => {
  const { orderId } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [cancelLoading, setCancelLoading] = useState(false);
  const [cancelError, setCancelError] = useState(null);

  const { currentUser, isAuthenticated } = useUser();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const fetchOrderDetails = async () => {
      if (!isAuthenticated || !currentUser) {
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const orderData = await orderService.getOrderById(orderId);
        setOrder(orderData);
      } catch (err) {
        console.error('Failed to fetch order details:', err);
        setError('Failed to load order details. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchOrderDetails();
  }, [orderId, currentUser, isAuthenticated]);

  const handleCancelOrder = async () => {
    setCancelLoading(true);
    setCancelError(null);

    try {
      const updatedOrder = await orderService.cancelOrder(orderId);
      setOrder(updatedOrder);
    } catch (err) {
      console.error('Failed to cancel order:', err);
      setCancelError(err.response?.data?.message || 'Failed to cancel order. Please try again.');
    } finally {
      setCancelLoading(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Alert severity="warning" sx={{ mb: 2 }}>
          You need to be logged in to view order details
        </Alert>
        <Button 
          variant="contained" 
          onClick={() => navigate('/login')}
          sx={{ mr: 1 }}
        >
          Login
        </Button>
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Button 
          variant="outlined" 
          onClick={() => {
            // Check if we came from admin page
            if (location.state?.from === 'admin') {
              navigate('/admin?returnToOrders=true');
            } else {
              navigate('/orders');
            }
          }}
          sx={{ mb: 2 }}
          startIcon={<ArrowBackIcon />}
        >
          {location.state?.from === 'admin' ? 'Back to Admin' : 'Back to Orders'}
        </Button>
        <Typography variant="h4" component="h1" gutterBottom>
          Order Details
        </Typography>
      </Box>

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
          <CircularProgress />
        </Box>
      ) : error ? (
        <Alert severity="error" sx={{ my: 2 }}>
          {error}
        </Alert>
      ) : order ? (
        <>
          <Grid container spacing={3}>
            <Grid item xs={12} md={8}>
              <Paper sx={{ p: 3, mb: 3 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                  <Typography variant="h6">
                    Order #{order.id}
                  </Typography>
                  <Chip 
                    label={order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                    color={getStatusColor(order.status)}
                  />
                </Box>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Placed on {formatDate(order.orderDate)}
                </Typography>

                {order.trackingNumber && (
                  <Box sx={{ mt: 2 }}>
                    <Typography variant="body2">
                      <strong>Tracking Number:</strong> {order.trackingNumber}
                    </Typography>
                  </Box>
                )}

                {cancelError && (
                  <Alert severity="error" sx={{ mt: 2 }}>
                    {cancelError}
                  </Alert>
                )}

                {order.status === 'pending' && (
                  <Button
                    variant="outlined"
                    color="error"
                    onClick={handleCancelOrder}
                    disabled={cancelLoading}
                    sx={{ mt: 2 }}
                  >
                    {cancelLoading ? 'Cancelling...' : 'Cancel Order'}
                  </Button>
                )}
              </Paper>

              <Paper sx={{ p: 3 }}>
                <Typography variant="h6" gutterBottom>
                  Order Items
                </Typography>
                <List>
                  {order.cart.cart_rows.map((row) => (
                    <ListItem key={row.id} alignItems="flex-start" sx={{ py: 2 }}>
                      <ListItemAvatar>
                        <Avatar 
                          variant="rounded" 
                          src={row.product.image} 
                          alt={row.product.name}
                          sx={{ width: 60, height: 60, mr: 2 }}
                        />
                      </ListItemAvatar>
                      <ListItemText
                        primary={
                          <Typography variant="subtitle1">
                            {row.product.name}
                          </Typography>
                        }
                        secondary={
                          <Box>
                            <Typography variant="body2" component="span" sx={{ display: 'block' }}>
                              Quantity: {row.quantity}
                            </Typography>
                            <Typography variant="body2" component="span" sx={{ display: 'block' }}>
                              Price: ${row.product.price.toFixed(2)}
                            </Typography>
                            <Typography variant="body2" component="span" sx={{ display: 'block', fontWeight: 'bold' }}>
                              Subtotal: ${(row.product.price * row.quantity).toFixed(2)}
                            </Typography>
                          </Box>
                        }
                      />
                    </ListItem>
                  ))}
                </List>
              </Paper>
            </Grid>

            <Grid item xs={12} md={4}>
              <Paper sx={{ p: 3, mb: 3 }}>
                <Typography variant="h6" gutterBottom>
                  Order Summary
                </Typography>
                <Box sx={{ my: 2 }}>
                  <Grid container spacing={1}>
                    <Grid item xs={6}>
                      <Typography variant="body2">Subtotal</Typography>
                    </Grid>
                    <Grid item xs={6} sx={{ textAlign: 'right' }}>
                      <Typography variant="body2">${order.totalAmount.toFixed(2)}</Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="body2">Shipping</Typography>
                    </Grid>
                    <Grid item xs={6} sx={{ textAlign: 'right' }}>
                      <Typography variant="body2">$0.00</Typography>
                    </Grid>
                  </Grid>
                </Box>
                <Divider sx={{ my: 1 }} />
                <Grid container spacing={1} sx={{ mt: 1 }}>
                  <Grid item xs={6}>
                    <Typography variant="subtitle1" fontWeight="bold">Total</Typography>
                  </Grid>
                  <Grid item xs={6} sx={{ textAlign: 'right' }}>
                    <Typography variant="subtitle1" fontWeight="bold">${order.totalAmount.toFixed(2)}</Typography>
                  </Grid>
                </Grid>
              </Paper>

              {order.shippingAddress && (
                <Paper sx={{ p: 3 }}>
                  <Typography variant="h6" gutterBottom>
                    Shipping Address
                  </Typography>
                  <Typography variant="body1">
                    {order.shippingAddress.firstName} {order.shippingAddress.lastName}
                  </Typography>
                  <Typography variant="body2">
                    {order.shippingAddress.address}
                  </Typography>
                  <Typography variant="body2">
                    {order.shippingAddress.city}, {order.shippingAddress.postalCode}
                  </Typography>
                  <Typography variant="body2">
                    {order.shippingAddress.country}
                  </Typography>
                </Paper>
              )}
            </Grid>
          </Grid>
        </>
      ) : (
        <Alert severity="info">
          Order not found.
        </Alert>
      )}
    </Container>
  );
};

export default OrderDetail; 