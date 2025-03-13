import { useState } from 'react';
import { Box, Typography, Grid, Card, CardContent, CardMedia, CardActionArea, Button, 
  TextField, InputAdornment, FormControl, InputLabel, Select, MenuItem, Container } from '@mui/material';
import { styled } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';
import SearchIcon from '@mui/icons-material/Search';

// Sample product data - in a real app, this would come from an API
const sampleProducts = [
  {
    id: 1,
    name: 'Product 1',
    price: 199,
    category: 'Electronics',
    image: 'https://via.placeholder.com/300x200',
    description: 'This is a description of product 1'
  },
  {
    id: 2,
    name: 'Product 2',
    price: 299,
    category: 'Clothing',
    image: 'https://via.placeholder.com/300x200',
    description: 'This is a description of product 2'
  },
  {
    id: 3,
    name: 'Product 3',
    price: 399,
    category: 'Home',
    image: 'https://via.placeholder.com/300x200',
    description: 'This is a description of product 3'
  },
  {
    id: 4,
    name: 'Product 4',
    price: 499,
    category: 'Electronics',
    image: 'https://via.placeholder.com/300x200',
    description: 'This is a description of product 4'
  },
  {
    id: 5,
    name: 'Product 5',
    price: 599,
    category: 'Clothing',
    image: 'https://via.placeholder.com/300x200',
    description: 'This is a description of product 5'
  },
  {
    id: 6,
    name: 'Product 6',
    price: 699,
    category: 'Home',
    image: 'https://via.placeholder.com/300x200',
    description: 'This is a description of product 6'
  }
];

const StyledCard = styled(Card)(({ theme }) => ({
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  transition: 'transform 0.15s ease-in-out',
  '&:hover': {
    transform: 'translateY(-3px)',
    boxShadow: theme.shadows[2],
  }
}));

const PriceTypography = styled(Typography)(({ theme }) => ({
  fontWeight: 'bold',
  color: theme.palette.primary.main,
}));

const FilterContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'row',
  gap: theme.spacing(2),
  marginBottom: theme.spacing(3),
  [theme.breakpoints.down('sm')]: {
    flexDirection: 'column',
  }
}));

function Products() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('name');
  const [category, setCategory] = useState('all');

  const handleProductClick = (productId) => {
    navigate(`/products/${productId}`);
  };

  // Filter and sort products
  const filteredProducts = sampleProducts
    .filter(product => {
      const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           product.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = category === 'all' || product.category === category;
      return matchesSearch && matchesCategory;
    })
    .sort((a, b) => {
      if (sortBy === 'price-low') return a.price - b.price;
      if (sortBy === 'price-high') return b.price - a.price;
      return a.name.localeCompare(b.name); // Default sort by name
    });

  return (
    <Container maxWidth="xl" sx={{ mt: 3, mb: 5 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h5" sx={{ fontWeight: 'medium', color: '#333' }}>
          All Products
        </Typography>
        
        <Box sx={{ display: 'flex', gap: 2 }}>
          <FormControl size="small" sx={{ minWidth: 120 }}>
            <InputLabel id="category-label">Category</InputLabel>
            <Select
              labelId="category-label"
              value={category}
              label="Category"
              onChange={(e) => setCategory(e.target.value)}
            >
              <MenuItem value="all">All Categories</MenuItem>
              <MenuItem value="Electronics">Electronics</MenuItem>
              <MenuItem value="Clothing">Clothing</MenuItem>
              <MenuItem value="Home">Home</MenuItem>
            </Select>
          </FormControl>
          
          <FormControl size="small" sx={{ minWidth: 120 }}>
            <InputLabel id="sort-label">Sort By</InputLabel>
            <Select
              labelId="sort-label"
              value={sortBy}
              label="Sort By"
              onChange={(e) => setSortBy(e.target.value)}
            >
              <MenuItem value="name">Name</MenuItem>
              <MenuItem value="price-low">Price: Low to High</MenuItem>
              <MenuItem value="price-high">Price: High to Low</MenuItem>
            </Select>
          </FormControl>
        </Box>
      </Box>
      
      <TextField
        label="Search Products"
        variant="outlined"
        size="small"
        fullWidth
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon />
            </InputAdornment>
          ),
        }}
        sx={{ mb: 3 }}
      />
      
      {filteredProducts.length === 0 ? (
        <Typography variant="h6" sx={{ textAlign: 'center', my: 4 }}>
          No products found matching your criteria.
        </Typography>
      ) : (
        <Grid container spacing={2}>
          {filteredProducts.map((product) => (
            <Grid item xs={12} sm={6} md={3} lg={2.4} key={product.id}>
              <StyledCard>
                <CardActionArea onClick={() => handleProductClick(product.id)}>
                  <CardMedia
                    component="img"
                    height="160"
                    image={product.image}
                    alt={product.name}
                  />
                  <CardContent sx={{ p: 1.5, pb: 1 }}>
                    <Typography gutterBottom variant="subtitle1" component="div" noWrap>
                      {product.name}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {product.category}
                    </Typography>
                    <PriceTypography variant="body2" sx={{ mt: 0.5 }}>
                      ${product.price}
                    </PriceTypography>
                  </CardContent>
                </CardActionArea>
                <Box sx={{ p: 1, pt: 0 }}>
                  <Button 
                    variant="contained" 
                    fullWidth
                    size="small"
                    sx={{ 
                      backgroundColor: '#000',
                      '&:hover': {
                        backgroundColor: '#333',
                      }
                    }}
                  >
                    Add to Cart
                  </Button>
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