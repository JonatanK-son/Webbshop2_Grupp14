import { Box, Typography, Button } from '@mui/material';
import { styled } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';

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

function Home() {
  const navigate = useNavigate();

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
    </Box>
  );
}

export default Home;