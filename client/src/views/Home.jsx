import { Box, Typography, Button, Grid, Card, CardMedia, CardContent, CardActions } from '@mui/material';
import { styled } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { productService } from '../services';
import { useCart } from '../context/CartContext';

// Hero section with color background
const HeroSection = styled(Box)(({ theme }) => ({
  height: '100vh',
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
  padding: theme.spacing(4),
  textAlign: 'center',
  [theme.breakpoints.down('md')]: {
    padding: theme.spacing(3),
  },
  [theme.breakpoints.down('sm')]: {
    padding: theme.spacing(2),
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
  padding: theme.spacing(8, 4),
  backgroundColor: '#f5f5f5',
  [theme.breakpoints.down('md')]: {
    padding: theme.spacing(6, 3),
  },
  [theme.breakpoints.down('sm')]: {
    padding: theme.spacing(4, 2),
  },
}));

const ProductCard = styled(Card)(({ theme }) => ({
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  transition: 'transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out',
  '&:hover': {
    transform: 'translateY(-5px)',
    boxShadow: theme.shadows[10],
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
  }, []);

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
              color: '#fff', 
              fontWeight: 300, 
              mb: 2,
              fontSize: { xs: '2.5rem', md: '3.5rem' }
            }}
          >
            Quality Products for Everyone
          </Typography>
          <Typography 
            variant="body1" 
            sx={{ 
              color: '#fff', 
              mb: 4,
              fontSize: { xs: '1rem', md: '1.2rem' }
            }}
          >
            Discover our wide selection of products at competitive prices.
          </Typography>
          <Button 
            variant="contained" 
            size="large"
            onClick={() => navigate('/products')}
            sx={{ 
              backgroundColor: '#fff',
              color: '#000',
              borderRadius: 0,
              padding: '12px 30px',
              '&:hover': {
                backgroundColor: '#f0f0f0',
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
          <Grid container spacing={4}>
            {featuredProducts.map((product) => (
              <Grid item key={product.id} xs={12} sm={6} md={3}>
                <ProductCard>
                  <CardMedia
                    component="img"
                    height="200"
                    image={product.image}
                    alt={product.name}
                  />
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Typography gutterBottom variant="h6" component="h3">
                      {product.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                      {product.description}
                    </Typography>
                    <Typography variant="h6" color="primary">
                      ${product.price}
                    </Typography>
                  </CardContent>
                  <CardActions>
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
    </Box>
  );
}

export default Home;