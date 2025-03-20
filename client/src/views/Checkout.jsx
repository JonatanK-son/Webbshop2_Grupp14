import React, { useState } from 'react';
import { 
  Container, 
  Typography, 
  Grid, 
  Paper, 
  Box, 
  Button, 
  Stepper,
  Step,
  StepLabel,
  TextField,
  Divider,
  Alert,
  CircularProgress,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useUser } from '../context/UserContext';
import { cartService } from '../services';
import CountrySelect from "../components/CountrySelect";

const steps = ['Review Cart', 'Shipping Information', 'Payment', 'Confirmation'];

const Checkout = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [shippingInfo, setShippingInfo] = useState({
    firstName: '',
    lastName: '',
    address: '',
    city: '',
    postalCode: '',
    country: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [orderComplete, setOrderComplete] = useState(false);
  const [orderNumber, setOrderNumber] = useState(null);

  const { cartItems, subtotal, shipping, total, clearCart, refreshCart } = useCart();
  const { currentUser, isAuthenticated, logout } = useUser();
  const navigate = useNavigate();

  const handleNext = () => {
    if (activeStep === steps.length - 2) {
      // Process payment and checkout
      handleCheckout();
    } else {
      setActiveStep((prevStep) => prevStep + 1);
    }
  };

  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    console.log("Updated field:", name, "New value:", value);
    setShippingInfo((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleCheckout = async () => {
    if (!isAuthenticated) {
      setError("You need to be logged in to checkout");
      return;
    }

    // Check if token exists
    const token = localStorage.getItem('token');
    if (!token) {
      setError("Authentication token missing. Please log out and log in again.");
      return;
    }

    // Validate shipping info is complete
    if (activeStep === 2 && !validateShippingInfo()) {
      setError("Please complete all shipping information fields");
      setActiveStep(1); // Go back to shipping info step
      return;
    }
    
    // Check if cart is empty
    if (cartItems.length === 0) {
      setError("Your cart is empty. Please add items before checking out.");
      setActiveStep(0);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      console.log('Checkout started with user ID:', currentUser.id);
      console.log('Cart items:', cartItems);
      
      // Format shipping address
      const formattedAddress = {
        firstName: shippingInfo.firstName,
        lastName: shippingInfo.lastName,
        address: shippingInfo.address,
        city: shippingInfo.city,
        postalCode: shippingInfo.postalCode,
        country: shippingInfo.country
      };

      const result = await cartService.checkout(currentUser.id, formattedAddress);
      console.log('Checkout result:', result);
      
      // Order will be in result.order if one was created
      if (result.order) {
        setOrderNumber(result.order.id);
      } else {
        setOrderNumber(result.checkedOutCart.id);
      }
      
      setOrderComplete(true);
      refreshCart();
      setActiveStep((prevStep) => prevStep + 1);
    } catch (err) {
      console.error("Checkout error:", err);
      
      // Handle different error cases with more specific messages
      if (err.response) {
        if (err.response.status === 401) {
          setError("Authentication failed. Please log out and log in again.");
          
          // Add a slight delay before navigating to login
          setTimeout(() => {
            // Force logout since token is invalid
            logout();
            navigate('/login', { state: { from: '/checkout', message: 'Please log in again to complete your order' } });
          }, 2000);
        } else if (err.response.status === 409 && err.response.data.message === "Cart is already paid") {
          // Handle case where cart is already paid
          setError("Your order has already been processed successfully!");
          
          // Refresh the cart
          refreshCart();
          
          // Show the success screen
          setOrderComplete(true);
          setActiveStep(steps.length - 1);
        } else {
          setError(err.response.data.message || "An error occurred during checkout");
        }
      } else {
        setError("Could not connect to the server. Please try again later.");
      }
    } finally {
      setLoading(false);
    }
  };

  // Helper to validate shipping info
  const validateShippingInfo = () => {
    return shippingInfo.firstName && 
      shippingInfo.lastName && 
      shippingInfo.address && 
      shippingInfo.city && 
      shippingInfo.postalCode && 
      shippingInfo.country;
  };

  // Validate if we can proceed to next step
  const canProceed = () => {
    if (activeStep === 0) {
      return cartItems.length > 0;
    }
    
    if (activeStep === 1) {

      return shippingInfo.firstName && 
             shippingInfo.lastName && 
             shippingInfo.address && 
             shippingInfo.city && 
             shippingInfo.postalCode && 
             shippingInfo.country;
    }
    
    return true;
  };

  if (!isAuthenticated) {
    return (
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Alert severity="warning" sx={{ mb: 2 }}>
          You need to be logged in to checkout
        </Alert>
        <Button 
          variant="contained" 
          onClick={() => navigate('/login')}
          sx={{ mr: 1 }}
        >
          Login
        </Button>
        <Button 
          variant="outlined" 
          onClick={() => navigate('/register')}
        >
          Register
        </Button>
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom sx={{ mb: 4 }}>
        Checkout
      </Typography>

      <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
        {steps.map((label) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>

      <Paper sx={{ p: 3, mb: 4 }}>
        {activeStep === 0 && (
          <Box>
            <Typography variant="h6" gutterBottom>
              Review Your Cart
            </Typography>
            
            {cartItems.length === 0 ? (
              <Alert severity="info" sx={{ mb: 2 }}>
                Your cart is empty. Add some items before checking out.
              </Alert>
            ) : (
              <List>
                {cartItems.map((item) => (
                  <ListItem key={item.id} alignItems="flex-start" sx={{ py: 2 }}>
                    <ListItemAvatar>
                      <Avatar 
                        variant="rounded" 
                        src={item.image} 
                        alt={item.name}
                        sx={{ width: 60, height: 60 }}
                      />
                    </ListItemAvatar>
                    <ListItemText
                      primary={item.name}
                      secondary={
                        <Box>
                          <Typography variant="body2" component="span">
                            ${item.price.toFixed(2)} × {item.quantity}
                          </Typography>
                          <Typography variant="body2" component="span" sx={{ float: 'right', fontWeight: 'bold' }}>
                            ${(item.price * item.quantity).toFixed(2)}
                          </Typography>
                        </Box>
                      }
                    />
                  </ListItem>
                ))}
              </List>
            )}
            
            <Divider sx={{ my: 2 }} />
            
            <Grid container spacing={1}>
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
          </Box>
        )}

        {activeStep === 1 && (
          <Box>
            <Typography variant="h6" gutterBottom>
              Shipping Information
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  fullWidth
                  label="First Name"
                  name="firstName"
                  value={shippingInfo.firstName}
                  onChange={handleInputChange}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  fullWidth
                  label="Last Name"
                  name="lastName"
                  value={shippingInfo.lastName}
                  onChange={handleInputChange}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  label="Address"
                  name="address"
                  value={shippingInfo.address}
                  onChange={handleInputChange}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  fullWidth
                  label="City"
                  name="city"
                  value={shippingInfo.city}
                  onChange={handleInputChange}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  fullWidth
                  label="Postal Code"
                  name="postalCode"
                  value={shippingInfo.postalCode}
                  onChange={handleInputChange}
                />
              </Grid>
              <Grid item xs={12}>
                <CountrySelect
                  required
                  fullWidth
                  label="Country"
                  name="country"
                  value={shippingInfo.country}
                  onChange={handleInputChange}
                />
              </Grid>
            </Grid>
          </Box>
        )}

        {activeStep === 2 && (
          <Box>
            <Typography variant="h6" gutterBottom>
              Payment Information
            </Typography>
            <Alert severity="info" sx={{ mb: 2 }}>
              This is a demo checkout. No real payment will be processed.
            </Alert>
            <Typography variant="body1" gutterBottom>
              You will be charged: ${total.toFixed(2)}
            </Typography>

            {error && (
              <Alert severity="error" sx={{ mt: 2 }}>
                {error}
              </Alert>
            )}
          </Box>
        )}

        {activeStep === 3 && (
          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="h6" gutterBottom>
              Order Confirmation
            </Typography>
            
            {orderComplete ? (
              <>
                <Alert severity="success" sx={{ mb: 2 }}>
                  Your order has been successfully placed!
                </Alert>
                <Typography variant="body1" gutterBottom>
                  Thank you for your purchase. Your order number is <strong>#{orderNumber}</strong>.
                </Typography>
                <Button 
                  variant="contained" 
                  onClick={() => navigate('/products')}
                  sx={{ mt: 2 }}
                >
                  Continue Shopping
                </Button>
              </>
            ) : (
              <Typography variant="body1" color="error">
                No order has been completed yet.
              </Typography>
            )}
          </Box>
        )}
      </Paper>

      <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
        <Button 
          disabled={activeStep === 0 || activeStep === steps.length - 1} 
          onClick={handleBack}
        >
          Back
        </Button>
        <Button
          variant="contained"
          onClick={handleNext}
          disabled={!canProceed() || loading || activeStep === steps.length - 1}
          startIcon={loading && <CircularProgress size={20} color="inherit" />}
        >
          {activeStep === steps.length - 2 ? 'Place Order' : 'Next'}
        </Button>
      </Box>
    </Container>
  );
};

export default Checkout; 