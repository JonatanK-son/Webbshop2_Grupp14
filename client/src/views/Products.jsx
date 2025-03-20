import { useState, useEffect } from 'react';
import { Box, Typography, Grid, Card, CardContent, CardMedia, CardActionArea, Button, 
  TextField, InputAdornment, FormControl, InputLabel, Select, MenuItem, Container, Snackbar, Alert, Rating } from '@mui/material';
import { styled } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';
import SearchIcon from '@mui/icons-material/Search';
import api from '../services/api';
import AddToCartButton from "../components/AddToCartButton";

// Updated StyledCard with more compact styling and no hover effects
const StyledCard = styled(Card)(({ theme }) => ({
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  borderRadius: 0,
  border: '1px solid #f0f0f0',
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

const PriceTypography = styled(Typography)(({ theme }) => ({
  fontWeight: 'bold',
  color: theme.palette.primary.main,
}));

const FilterContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'row',
  gap: theme.spacing(2),
  marginBottom: theme.spacing(2),
  [theme.breakpoints.down('sm')]: {
    flexDirection: 'column',
    gap: theme.spacing(1),
  }
}));

function Products() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('name');
  const [category, setCategory] = useState('all');
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [categories, setCategories] = useState(['All']);

  // Fetch products from the API
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await api.get('/products');
        setProducts(response.data);
        
        // Extract unique categories
        const uniqueCategories = [...new Set(response.data.map(product => product.category))];
        setCategories(['All', ...uniqueCategories]);
        
        setLoading(false);
      } catch (err) {
        console.error('Error fetching products:', err);
        setError('Failed to load products. Please try again later.');
        setLoading(false);
      }
    };

    fetchProducts();
  }, [api]);

  const handleProductClick = (product) => {
    console.log("Product clicked: ", product);
    navigate(`/products/${product.id}`, { state: { product } });
  };

  // Filter and sort products
  const filteredProducts = products
    .filter(product => {
      const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           (product.description && product.description.toLowerCase().includes(searchTerm.toLowerCase()));
      const matchesCategory = category === 'all' || product.category === category;
      return matchesSearch && matchesCategory;
    })
    .sort((a, b) => {
      if (sortBy === 'price-low') return a.price - b.price;
      if (sortBy === 'price-high') return b.price - a.price;
      if (sortBy === 'rating-high') return b.averageRating - a.averageRating;
      if (sortBy === 'rating-low') return a.averageRating - b.averageRating;
      return a.name.localeCompare(b.name); // Default sort by name
    });

  if (loading) {
    return (
      <Container maxWidth="xl" sx={{ mt: 2, mb: 3, minHeight: '50vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <Typography>Loading products...</Typography>
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="xl" sx={{ mt: 2, mb: 3, minHeight: '50vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <Alert severity="error">{error}</Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="xl" sx={{ mt: 2, mb: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h6" sx={{ fontWeight: 'medium', color: '#333' }}>
          All Products
        </Typography>
        
        <Box sx={{ display: 'flex', gap: 1 }}>
          <FormControl size="small" sx={{ minWidth: 100 }}>
            <InputLabel id="category-label">Category</InputLabel>
            <Select
              labelId="category-label"
              value={category}
              label="Category"
              onChange={(e) => setCategory(e.target.value)}
            >
              <MenuItem value="all">All</MenuItem>
              {categories.filter(cat => cat !== 'All').map(cat => (
                <MenuItem key={cat} value={cat}>{cat}</MenuItem>
              ))}
            </Select>
          </FormControl>
          
          <FormControl size="small" sx={{ minWidth: 100 }}>
            <InputLabel id="sort-label">Sort By</InputLabel>
            <Select
              labelId="sort-label"
              value={sortBy}
              label="Sort By"
              onChange={(e) => setSortBy(e.target.value)}
            >
              <MenuItem value="name">Name</MenuItem>
              <MenuItem value="price-low">Price: Low-High</MenuItem>
              <MenuItem value="price-high">Price: High-Low</MenuItem>
              <MenuItem value="rating-high">Rating: High-Low</MenuItem>
              <MenuItem value="rating-low">Rating: Low-High</MenuItem>
            </Select>
          </FormControl>
        </Box>
      </Box>
      
      <TextField
        placeholder="Search products..."
        variant="outlined"
        size="small"
        fullWidth
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon fontSize="small" />
            </InputAdornment>
          ),
        }}
        sx={{ mb: 2 }}
      />
      
      {filteredProducts.length === 0 ? (
        <Typography variant="body1" sx={{ textAlign: 'center', my: 3 }}>
          No products found matching your criteria.
        </Typography>
      ) : (
        <Grid container spacing={1}>
          {filteredProducts.map((product) => (
            <Grid item xs={6} sm={4} md={3} lg={2} key={product.id}>
              <StyledCard elevation={0}>
                <CardActionArea onClick={() => handleProductClick(product)}>
                  <ImageContainer>
                    <StyledCardMedia
                      component="img"
                      image={product.image || 'https://via.placeholder.com/300x300'}
                      alt={product.name}
                    />
                  </ImageContainer>
                  <CardContent sx={{ p: 1, pb: 0.5 }}>
                    <Typography gutterBottom variant="body2" component="div" noWrap sx={{ fontWeight: 'medium' }}>
                      {product.name}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {product.category}
                    </Typography>
                    <PriceTypography variant="body2" sx={{ mt: 0.5 }}>
                      ${product.price}
                    </PriceTypography>
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
                <Box sx={{ p: 1, pt: 0 }}>
                  <AddToCartButton product={product} size="small"/>
                </Box>
              </StyledCard>
            </Grid>
          ))}
        </Grid>
      )}
    </Container>
  );
}

export default Products;