import React from 'react';
import { 
  Box, Typography, Card, CardContent, CardMedia, CardActionArea, Rating
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';

// Card with compact styling and no hover effects
const StyledCard = styled(Card)(({ theme }) => ({
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  borderRadius: 8,
  border: '1px solid #f0f0f0',
  boxShadow: 'none',
  overflow: 'hidden',
  transition: 'none',
  '& .MuiCardActionArea-root': {
    transition: 'none',
    '&:hover': {
      backgroundColor: 'transparent'
    }
  }
}));

// Consistent image container styling
const ImageContainer = styled(Box)(({ theme }) => ({
  position: 'relative',
  paddingTop: '80%', // Reduced height for more compact look
  width: '100%',
  overflow: 'hidden',
}));

// Maintain aspect ratio for product images
const StyledCardMedia = styled(CardMedia)(({ theme }) => ({
  position: 'absolute',
  top: 0,
  left: 0,
  width: '100%',
  height: '100%',
  objectFit: 'cover', // This ensures the image covers the area without distortion
}));

// Compact rating badge in top right corner
const RatingBadge = styled(Box)(({ theme }) => ({
  position: 'absolute',
  top: 6,
  right: 6,
  zIndex: 1,
  backgroundColor: 'rgba(255, 255, 255, 0.9)',
  borderRadius: '12px',
  padding: '2px 5px',
  display: 'flex',
  alignItems: 'center',
  boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
  fontSize: '0.7rem',
}));

// Style for price typography
const PriceTypography = styled(Typography)(({ theme }) => ({
  fontWeight: 'bold',
  color: theme.palette.primary.main,
}));

const ProductCard = ({ product }) => {
  const navigate = useNavigate();

  const handleProductClick = () => {
    navigate(`/products/${product.id}`, { state: { product } });
  };

  return (
    <StyledCard elevation={0}>
      <CardActionArea onClick={handleProductClick} disableRipple>
        <ImageContainer>
          <RatingBadge>
            <Typography variant="caption" sx={{ fontSize: '0.7rem', fontWeight: 'medium', mr: 0.5 }}>
              {product.averageRating ? product.averageRating.toFixed(1) : '0.0'}
            </Typography>
            <Rating 
              value={product.averageRating || 0} 
              precision={0.5} 
              size="small" 
              readOnly 
              sx={{ fontSize: '0.7rem' }}
            />
          </RatingBadge>
          <StyledCardMedia
            component="img"
            image={product.image || 'https://via.placeholder.com/300x300'}
            alt={product.name}
          />
        </ImageContainer>
        <CardContent sx={{ p: 1, pb: '8px !important', display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <Box sx={{ flexGrow: 1 }}>
            <Typography variant="body2" component="div" noWrap sx={{ fontWeight: 'medium' }}>
              {product.name}
            </Typography>
            <Typography variant="caption" color="text.secondary" display="block">
              {product.category}
            </Typography>
            <PriceTypography variant="body2">
              ${product.price}
            </PriceTypography>
          </Box>
        </CardContent>
      </CardActionArea>
    </StyledCard>
  );
};

export default ProductCard; 