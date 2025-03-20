import { Box, Typography, Button, Grid, Card, CardMedia, CardContent, CardActions, Rating, Container } from '@mui/material';
import { styled } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { productService } from '../services';
import { useCart } from '../context/CartContext';

// Hero section with color background - reduced height
const HeroSection = styled(Box)(({ theme }) => ({
  height: '50vh', // Reduced from 100vh to make it more compact
  width: '100%',
  backgroundColor: '#2d2d2d',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: 0,
  position: 'relative',
  marginBottom: 0,
}));

const HeroContent = styled(Box)(({ theme }) => ({
  zIndex: 1,
  maxWidth: '800px',
  padding: theme.spacing(2), // Reduced padding
  textAlign: 'center',
  [theme.breakpoints.down('md')]: {
    padding: theme.spacing(2),
  },
  [theme.breakpoints.down('sm')]: {
    padding: theme.spacing(1),
  },
}));

const PromoBanner = styled(Box)(({ theme }) => ({
  backgroundColor: '#000',
  color: '#fff',
  padding: theme.spacing(1),
  textAlign: 'center',
  width: '100%',
}));

const FeaturedSection = styled(Box)(({ theme }) => ({
  padding: theme.spacing(4, 2), // Reduced padding
  backgroundColor: '#f5f5f5',
  [theme.breakpoints.down('md')]: {
    padding: theme.spacing(3, 2),
  },
  [theme.breakpoints.down('sm')]: {
    padding: theme.spacing(2, 1),
  },
}));

// Updated ProductCard with compact styling and no hover effects
const ProductCard = styled(Card)(({ theme }) => ({
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  border: '1px solid #f0f0f0',
  borderRadius: 0,
  boxShadow: 'none',
}));

// Create a styled component for consistent image containers
const ImageContainer = styled(Box)(({ theme }) => ({
  position: 'relative',
  paddingTop: '100%', // 1:1 Aspect ratio (square)
  width: '100%',
  overflow: 'hidden',
}));

// Updated CardMedia styling to maintain aspect ratio
const StyledCardMedia = styled(CardMedia)(({ theme }) => ({
  position: 'absolute',
  top: 0,
  left: 0,
  width: '100%',
  height: '100%',
  objectFit: 'cover', // This ensures the image covers the area without distortion
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

        // Sort by rating (high to low) before selecting featured products
        const sortedProducts = products.sort((a, b) => (b.averageRating || 0) - (a.averageRating || 0));
  
        setFeaturedProducts(sortedProducts.slice(0, 4)); // Get top 4 rated products
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
  }, [productService]);

  const handleAddToCart = (product) => {
    addToCart(product);
  };

  return (
    <Box sx={{ width: '100%', margin: 0, padding: 0 }}>
      {/* Promo Banner */}
      <PromoBanner>
        <Typography variant="body2">
          FREE SHIPPING ON ALL ORDERS OVER $50
        </Typography>
      </PromoBanner>

      {/* Hero Section - more compact */}
      <HeroSection>
        <HeroContent>
          <Typography 
            variant="h3" 
            component="h1" 
            sx={{ 
              color: '#fff', 
              fontWeight: 300, 
              mb: 1,
              fontSize: { xs: '2rem', md: '2.75rem' }
            }}
          >
            Quality Products for Everyone
          </Typography>
          <Typography 
            variant="body1" 
            sx={{ 
              color: '#fff', 
              mb: 2,
              fontSize: { xs: '0.9rem', md: '1.1rem' }
            }}
          >
            Discover our wide selection of products at competitive prices.
          </Typography>
          <Button 
            variant="contained" 
            size="medium"
            onClick={() => navigate('/products')}
            sx={{ 
              backgroundColor: '#fff',
              color: '#000',
              borderRadius: 0,
              padding: '8px 20px',
              '&:hover': {
                backgroundColor: '#f0f0f0',
              }
            }}
          >
            SHOP NOW
          </Button>
        </HeroContent>
      </HeroSection>

      {/* Featured Products Section - made to match Products page */}
      <Container maxWidth="xl" sx={{ mt: 2, mb: 3 }}> {/* Added Container to match navbar width */}
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
              <Grid item key={product.id} xs={6} sm={4} md={3} lg={2}> {/* Updated grid sizing to match Products page */}
                <ProductCard elevation={0}>
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
                </ProductCard>
              </Grid>
            ))}
          </Grid>
        )}

        <Box sx={{ textAlign: 'right', mt: 2 }}> {/* Changed alignment to right to match Products page style */}
          <Button 
            variant="outlined" 
            size="small"
            onClick={() => navigate('/products')}
            sx={{ 
              borderRadius: 0,
              padding: '6px 16px',
            }}
          >
            View All Products
          </Button>
        </Box>
      </Container>
    </Box>
  );
}

export default Home;