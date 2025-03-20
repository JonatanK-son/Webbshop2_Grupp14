import { Box, Typography, Button, Grid, Card, CardMedia, CardContent, CardActions } from '@mui/material';
import { styled } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { productService } from '../services';
import { useCart } from '../context/CartContext';

// Hero section with color background
const HeroSection = styled(Box)(({ theme }) => ({
  height: '40vh',
  width: '100%',
  backgroundColor: theme.palette.primary.main,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: theme.spacing(4, 0),
  position: 'relative',
  marginBottom: theme.spacing(4),
  borderRadius: '0 0 20px 20px',
  boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
}));

const HeroContent = styled(Box)(({ theme }) => ({
  zIndex: 1,
  maxWidth: '600px',
  padding: theme.spacing(4),
  textAlign: 'center',
  backgroundColor: 'rgba(255, 255, 255, 0.1)',
  borderRadius: '12px',
  backdropFilter: 'blur(5px)',
  marginTop: 0,
  [theme.breakpoints.down('md')]: {
    padding: theme.spacing(3),
  },
  [theme.breakpoints.down('sm')]: {
    padding: theme.spacing(2),
  },
}));

const PromoBanner = styled(Box)(({ theme }) => ({
  backgroundColor: theme.palette.secondary.main,
  color: theme.palette.background.paper,
  padding: theme.spacing(1),
  textAlign: 'center',
  width: '100%',
}));

const FeaturedSection = styled(Box)(({ theme }) => ({
  padding: theme.spacing(8, 4),
  backgroundColor: theme.palette.background.default,
  [theme.breakpoints.down('md')]: {
    padding: theme.spacing(6, 3),
  },
  [theme.breakpoints.down('sm')]: {
    padding: theme.spacing(4, 2),
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

const FeaturesSection = styled(Box)(({ theme }) => ({
  padding: theme.spacing(8, 4),
  backgroundColor: '#ffffff',
  borderRadius: '20px',
  margin: theme.spacing(4, 0),
  boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
}));

const FeatureCard = styled(Box)(({ theme }) => ({
  padding: theme.spacing(4),
  textAlign: 'center',
  backgroundColor: '#ffffff',
  borderRadius: '16px',
  boxShadow: '0 4px 6px rgba(0,0,0,0.05)',
  transition: 'all 0.3s ease-in-out',
  '&:hover': {
    transform: 'translateY(-8px)',
    boxShadow: '0 12px 24px rgba(0,0,0,0.1)',
  },
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
        // For now, just show the first 4 products as featured
        setFeaturedProducts(products.slice(0, 4));
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

      {/* Hero Section */}
      <HeroSection>
        <HeroContent>
          <Typography 
            variant="h2" 
            component="h1" 
            sx={{ 
              color: 'background.paper', 
              fontWeight: 400, 
              mb: 2,
              fontSize: { xs: '1.5rem', sm: '1.8rem', md: '2.2rem' },
              letterSpacing: '0.3px'
            }}
          >
            Quality Products for Everyone
          </Typography>
          <Typography 
            variant="body1" 
            sx={{ 
              color: 'background.paper', 
              mb: 12,
              fontSize: { xs: '0.8rem', sm: '0.9rem', md: '1rem' },
              lineHeight: 1.5,
              maxWidth: '400px',
              margin: '0 auto'
            }}
          >
            Discover our wide selection of products at competitive prices.
          </Typography>
          <Button 
            variant="contained" 
            size="large"
            onClick={() => navigate('/products')}
            sx={{ 
              backgroundColor: 'background.paper',
              color: 'primary.main',
              borderRadius: '8px',
              padding: '8px 20px',
              fontSize: '0.8rem',
              textTransform: 'none',
              letterSpacing: '0.3px',
              marginTop: '2rem',
              '&:hover': {
                backgroundColor: 'background.default',
              }
            }}
          >
            SHOP NOW
          </Button>
        </HeroContent>
      </HeroSection>

      {/* Featured Products Section */}
      <FeaturedSection>
        <Typography 
          variant="h4" 
          component="h2" 
          align="center" 
          sx={{ mb: 6, fontWeight: 500 }}
        >
          Featured Products
        </Typography>

        {loading ? (
          <Typography align="center">Loading products...</Typography>
        ) : error ? (
          <Typography align="center" color="error">{error}</Typography>
        ) : (
          <Grid container spacing={3}>
            {featuredProducts.map((product) => (
              <Grid item key={product.id} xs={12} sm={6} md={3}>
                <ProductCard>
                  <ImageContainer>
                    <StyledCardMedia
                      component="img"
                      image={product.image || 'https://via.placeholder.com/300x300'}
                      alt={product.name}
                    />
                  </ImageContainer>
                  <CardContent sx={{ p: 1.5, flexGrow: 0 }}>
                    <Typography variant="h6" component="h3" noWrap sx={{ fontSize: '1rem', mb: 0.5 }}>
                      {product.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1, display: '-webkit-box', overflow: 'hidden', WebkitBoxOrient: 'vertical', WebkitLineClamp: 2, fontSize: '0.85rem', lineHeight: 1.3 }}>
                      {product.description}
                    </Typography>
                    <Typography variant="h6" color="primary" sx={{ fontSize: '1rem' }}>
                      ${product.price}
                    </Typography>
                  </CardContent>
                  <CardActions sx={{ p: 1.5, pt: 0 }}>
                    <Button 
                      size="small" 
                      onClick={() => navigate(`/products/${product.id}`)}
                    >
                      View Details
                    </Button>
                    <Button 
                      size="small" 
                      variant="contained" 
                      onClick={() => handleAddToCart(product)}
                    >
                      Add to Cart
                    </Button>
                  </CardActions>
                </ProductCard>
              </Grid>
            ))}
          </Grid>
        )}

        <Box sx={{ textAlign: 'center', mt: 6 }}>
          <Button 
            variant="outlined" 
            size="large"
            onClick={() => navigate('/products')}
            sx={{ 
              borderRadius: 0,
              padding: '10px 24px',
            }}
          >
            View All Products
          </Button>
        </Box>
      </FeaturedSection>

      {/* Features Section */}
      <FeaturesSection>
        <Typography 
          variant="h4" 
          component="h2" 
          align="center" 
          sx={{ 
            mb: 8, 
            fontWeight: 600,
            color: 'primary.main',
            position: 'relative',
            '&::after': {
              content: '""',
              position: 'absolute',
              bottom: '-10px',
              left: '50%',
              transform: 'translateX(-50%)',
              width: '60px',
              height: '3px',
              backgroundColor: 'primary.main',
              borderRadius: '2px',
            }
          }}
        >
          Why Choose Us
        </Typography>
        <Grid container spacing={4}>
          <Grid item xs={12} sm={4}>
            <FeatureCard>
              <Typography 
                variant="h6" 
                sx={{ 
                  mb: 2,
                  color: 'primary.main',
                  fontWeight: 600,
                  fontSize: '1.3rem',
                }}
              >
                Fast Delivery
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ fontSize: '1rem', lineHeight: 1.6 }}>
                Quick and reliable shipping to get your products to you as soon as possible.
              </Typography>
            </FeatureCard>
          </Grid>
          <Grid item xs={12} sm={4}>
            <FeatureCard>
              <Typography 
                variant="h6" 
                sx={{ 
                  mb: 2,
                  color: 'primary.main',
                  fontWeight: 600,
                  fontSize: '1.3rem',
                }}
              >
                Quality Products
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ fontSize: '1rem', lineHeight: 1.6 }}>
                Carefully selected products that meet our high standards of quality.
              </Typography>
            </FeatureCard>
          </Grid>
          <Grid item xs={12} sm={4}>
            <FeatureCard>
              <Typography 
                variant="h6" 
                sx={{ 
                  mb: 2,
                  color: 'primary.main',
                  fontWeight: 600,
                  fontSize: '1.3rem',
                }}
              >
                Secure Shopping
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ fontSize: '1rem', lineHeight: 1.6 }}>
                Safe and secure payment processing for worry-free shopping.
              </Typography>
            </FeatureCard>
          </Grid>
        </Grid>
      </FeaturesSection>
    </Box>
  );
}

export default Home;