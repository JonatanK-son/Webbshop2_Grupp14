import { Box, Typography, Button, Grid, Card, CardMedia, CardContent, Rating, Container, CardActionArea, Paper } from '@mui/material';
import { styled } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { productService } from '../services';
import { useCart } from '../context/CartContext';
import LocalShippingOutlinedIcon from '@mui/icons-material/LocalShippingOutlined';
import SupportAgentOutlinedIcon from '@mui/icons-material/SupportAgentOutlined';
import VerifiedOutlinedIcon from '@mui/icons-material/VerifiedOutlined';
import PaymentsOutlinedIcon from '@mui/icons-material/PaymentsOutlined';

// Styled components for consistent design
const Section = styled(Box)(({ theme, background }) => ({
  width: '100%',
  background: background || 'transparent',
  padding: theme.spacing(3, 0),
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'stretch',
  [theme.breakpoints.down('sm')]: {
    padding: theme.spacing(2, 0),
  },
}));

const ProductCard = styled(Card)(({ theme }) => ({
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  border: '1px solid #f0f0f0',
  borderRadius: 0,
  boxShadow: 'none',
}));

const ImageContainer = styled(Box)(({ theme }) => ({
  position: 'relative',
  paddingTop: '100%', // 1:1 Aspect ratio (square)
  width: '100%',
  overflow: 'hidden',
}));

const StyledCardMedia = styled(CardMedia)(({ theme }) => ({
  position: 'absolute',
  top: 0,
  left: 0,
  width: '100%',
  height: '100%',
  objectFit: 'cover',
}));

function Home() {
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const products = await productService.getAllProducts();
        const sortedProducts = products.sort((a, b) => (b.averageRating || 0) - (a.averageRating || 0));
        setFeaturedProducts(sortedProducts.slice(0, 4));
        setError(null);
      } catch (err) {
        console.error('Error fetching products:', err);
        setError('Failed to load products. Please try again later.');
        // For demo purposes, set some dummy products if API fails
        setFeaturedProducts([
          {
            id: 1,
            name: 'Product 1',
            price: 199,
            description: 'This is a sample product description.',
            image: 'https://via.placeholder.com/300x200',
          },
          {
            id: 2,
            name: 'Product 2',
            price: 299,
            description: 'This is a sample product description.',
            image: 'https://via.placeholder.com/300x200',
          },
          {
            id: 3,
            name: 'Product 3',
            price: 399,
            description: 'This is a sample product description.',
            image: 'https://via.placeholder.com/300x200',
          },
          {
            id: 4,
            name: 'Product 4',
            price: 499,
            description: 'This is a sample product description.',
            image: 'https://via.placeholder.com/300x200',
          },
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const handleProductClick = (product) => {
    try {
      navigate(`/products/${product.id}`);
    } catch (error) {
      console.error('Navigation error:', error);
    }
  };

  return (
    <Box sx={{ 
      width: '100%', 
      overflow: 'hidden',
      display: 'flex',
      flexDirection: 'column',
      minHeight: '100vh'
    }}>
      {/* Promo Banner */}
      <Section background="#000" sx={{ py: 1 }}>
        <Container maxWidth="xl" sx={{ width: '100%' }}>
          <Typography variant="body2" align="center" sx={{ color: '#fff' }}>
            FREE SHIPPING ON ALL ORDERS OVER $50
          </Typography>
        </Container>
      </Section>

      {/* Hero Section - MORE COMPACT */}
      <Section 
        background="#2d2d2d" 
        sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          py: 0,
          height: { xs: '30vh', sm: '35vh' }, // Reduced height for more compact appearance
          flex: '0 0 auto'
        }}
      >
        <Container maxWidth="xl" sx={{ 
          textAlign: 'center', 
          py: { xs: 2, sm: 3 }, // Reduced padding
          display: 'flex',
          justifyContent: 'center',
          width: '100%'
        }}>
          <Box sx={{ maxWidth: 700, mx: 'auto', px: { xs: 1, sm: 2 } }}> {/* Reduced max width and padding */}
            <Typography 
              variant="h4" // Reduced from h3 to h4
              component="h1" 
              sx={{ 
                color: '#fff', 
                fontWeight: 300, 
                mb: 0.5, // Reduced margin
                fontSize: { xs: '1.75rem', md: '2.25rem' } // Smaller font sizes
              }}
            >
              Quality Products for Everyone
            </Typography>
            <Typography 
              variant="body2" // Changed from body1 to body2
              sx={{ 
                color: '#fff', 
                mb: 1.5, // Reduced margin
                fontSize: { xs: '0.8rem', md: '0.95rem' } // Smaller font sizes
              }}
            >
              Discover our wide selection of products at competitive prices.
            </Typography>
            <Button 
              variant="contained" 
              size="small" // Changed from medium to small
              onClick={() => navigate('/products')}
              sx={{ 
                backgroundColor: '#fff',
                color: '#000',
                borderRadius: 0,
                padding: '6px 16px', // Smaller padding
                '&:hover': {
                  backgroundColor: '#f0f0f0',
                }
              }}
            >
              SHOP NOW
            </Button>
          </Box>
        </Container>
      </Section>

      {/* Featured Products Section */}
      <Section sx={{ flex: '1 0 auto', display: 'flex' }}>
        <Container maxWidth="xl" sx={{ width: '100%', display: 'flex', flexDirection: 'column' }}>
          <Typography 
            variant="h6" 
            sx={{ fontWeight: 'medium', color: '#333', mb: 2 }}
          >
            Featured Products
          </Typography>

          {loading ? (
            <Typography align="center">Loading products...</Typography>
          ) : error ? (
            <Typography align="center" color="error">{error}</Typography>
          ) : (
            <Grid container spacing={1}>
              {featuredProducts.map((product) => (
                <Grid item key={product.id} xs={6} sm={4} md={3} lg={2}>
                  <ProductCard elevation={0}>
                    <CardActionArea onClick={() => handleProductClick(product)}> {/* Using new handler function */}
                      <ImageContainer>
                        <StyledCardMedia
                          component="img"
                          image={product.image || 'https://via.placeholder.com/300x300'}
                          alt={product.name}
                        />
                      </ImageContainer>
                      <CardContent sx={{ p: 1, pb: 1, flexGrow: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                        <Typography variant="body2" component="div" noWrap sx={{ fontWeight: 'medium', mb: 0.5 }}>
                          {product.name}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {product.category || 'General'}
                        </Typography>
                        <Typography variant="body2" color="primary" sx={{ mt: 0.5, fontWeight: 'bold' }}>
                          ${product.price}
                        </Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center', mt: 0.5 }}>
                          <Rating 
                            value={product.averageRating || 0} 
                            precision={0.5} 
                            size="small" 
                            readOnly 
                          />
                          <Typography variant="caption" sx={{ ml: 0.5 }}>
                            ({product.averageRating ? product.averageRating.toFixed(1) : '0.0'})
                          </Typography>
                        </Box>
                      </CardContent>
                    </CardActionArea>
                  </ProductCard>
                </Grid>
              ))}
            </Grid>
          )}
        </Container>
      </Section>
      
      {/* Why Choose Us Section */}
      <Section 
        background="#f9f9f9" 
        sx={{ 
          flex: '1 0 auto',
          display: 'flex',
          pb: 4
        }}
      >
        <Container maxWidth="xl" sx={{ width: '100%', display: 'flex', flexDirection: 'column' }}>
          <Typography 
            variant="h6" 
            sx={{ fontWeight: 'medium', color: '#333', mb: 2 }}
          >
            Why Choose Us
          </Typography>
          
          <Grid container spacing={2} sx={{ width: '100%', mb: 2 }}>
            <Grid item xs={12} sm={6} md={3}>
              <Paper elevation={0} sx={{ 
                p: 2, 
                height: '100%', 
                display: 'flex', 
                flexDirection: 'column', 
                alignItems: 'center', 
                border: '1px solid #f0f0f0', 
                backgroundColor: '#fff'
              }}>
                <LocalShippingOutlinedIcon sx={{ fontSize: 36, color: 'primary.main', mb: 1 }} />
                <Typography variant="body1" component="h3" gutterBottom align="center" sx={{ fontWeight: 'medium' }}>
                  Fast Shipping
                </Typography>
                <Typography variant="body2" color="text.secondary" align="center">
                  Quick delivery to your doorstep with reliable shipping options
                </Typography>
              </Paper>
            </Grid>
            
            <Grid item xs={12} sm={6} md={3}>
              <Paper elevation={0} sx={{ 
                p: 2, 
                height: '100%', 
                display: 'flex', 
                flexDirection: 'column', 
                alignItems: 'center', 
                border: '1px solid #f0f0f0', 
                backgroundColor: '#fff'
              }}>
                <VerifiedOutlinedIcon sx={{ fontSize: 36, color: 'primary.main', mb: 1 }} />
                <Typography variant="body1" component="h3" gutterBottom align="center" sx={{ fontWeight: 'medium' }}>
                  Quality Products
                </Typography>
                <Typography variant="body2" color="text.secondary" align="center">
                  Carefully selected products that meet our high quality standards
                </Typography>
              </Paper>
            </Grid>
            
            <Grid item xs={12} sm={6} md={3}>
              <Paper elevation={0} sx={{ 
                p: 2, 
                height: '100%', 
                display: 'flex', 
                flexDirection: 'column', 
                alignItems: 'center', 
                border: '1px solid #f0f0f0', 
                backgroundColor: '#fff'
              }}>
                <SupportAgentOutlinedIcon sx={{ fontSize: 36, color: 'primary.main', mb: 1 }} />
                <Typography variant="body1" component="h3" gutterBottom align="center" sx={{ fontWeight: 'medium' }}>
                  Customer Support
                </Typography>
                <Typography variant="body2" color="text.secondary" align="center">
                  Dedicated team ready to assist you with any questions or issues
                </Typography>
              </Paper>
            </Grid>
            
            <Grid item xs={12} sm={6} md={3}>
              <Paper elevation={0} sx={{ 
                p: 2, 
                height: '100%', 
                display: 'flex', 
                flexDirection: 'column', 
                alignItems: 'center', 
                border: '1px solid #f0f0f0', 
                backgroundColor: '#fff'
              }}>
                <PaymentsOutlinedIcon sx={{ fontSize: 36, color: 'primary.main', mb: 1 }} />
                <Typography variant="body1" component="h3" gutterBottom align="center" sx={{ fontWeight: 'medium' }}>
                  Secure Payment
                </Typography>
                <Typography variant="body2" color="text.secondary" align="center">
                  Multiple secure payment options to ensure your transactions are safe
                </Typography>
              </Paper>
            </Grid>
          </Grid>
        </Container>
      </Section>
      
      {/* Footer spacing */}
      <Box sx={{ height: 40, backgroundColor: '#f9f9f9' }} />
    </Box>
  );
}

export default Home;