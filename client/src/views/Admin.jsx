import React, { useState } from 'react';
import { 
  Box, 
  Container, 
  Typography, 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow, 
  Paper, 
  Button, 
  TextField, 
  Dialog, 
  DialogActions, 
  DialogContent, 
  DialogTitle,
  IconButton,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Tabs,
  Tab
} from '@mui/material';
import { styled } from '@mui/material/styles';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';

// Sample product data - in a real app, this would come from an API
const initialProducts = [
  {
    id: 1,
    name: 'Product 1',
    price: 199,
    category: 'Electronics',
    stock: 10,
    image: 'https://via.placeholder.com/300x200',
    description: 'This is a description of product 1'
  },
  {
    id: 2,
    name: 'Product 2',
    price: 299,
    category: 'Clothing',
    stock: 15,
    image: 'https://via.placeholder.com/300x200',
    description: 'This is a description of product 2'
  },
  {
    id: 3,
    name: 'Product 3',
    price: 399,
    category: 'Home',
    stock: 5,
    image: 'https://via.placeholder.com/300x200',
    description: 'This is a description of product 3'
  },
  {
    id: 4,
    name: 'Product 4',
    price: 499,
    category: 'Electronics',
    stock: 8,
    image: 'https://via.placeholder.com/300x200',
    description: 'This is a description of product 4'
  },
  {
    id: 5,
    name: 'Product 5',
    price: 599,
    category: 'Clothing',
    stock: 20,
    image: 'https://via.placeholder.com/300x200',
    description: 'This is a description of product 5'
  },
  {
    id: 6,
    name: 'Product 6',
    price: 699,
    category: 'Home',
    stock: 12,
    image: 'https://via.placeholder.com/300x200',
    description: 'This is a description of product 6'
  }
];

// Sample orders data
const initialOrders = [
  { id: 1, customer: 'John Doe', date: '2023-05-15', status: 'Delivered', total: 498 },
  { id: 2, customer: 'Jane Smith', date: '2023-05-16', status: 'Processing', total: 299 },
  { id: 3, customer: 'Bob Johnson', date: '2023-05-17', status: 'Shipped', total: 1099 },
  { id: 4, customer: 'Alice Brown', date: '2023-05-18', status: 'Processing', total: 799 },
];

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  fontWeight: theme.typography.fontWeightMedium,
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '&:nth-of-type(odd)': {
    backgroundColor: theme.palette.action.hover,
  },
  '&:last-child td, &:last-child th': {
    border: 0,
  },
}));

function Admin() {
  const [products, setProducts] = useState(initialProducts);
  const [orders, setOrders] = useState(initialOrders);
  const [openDialog, setOpenDialog] = useState(false);
  const [currentProduct, setCurrentProduct] = useState({ 
    name: '', 
    price: '', 
    category: '', 
    stock: '', 
    image: '', 
    description: '' 
  });
  const [isEditing, setIsEditing] = useState(false);
  const [tabValue, setTabValue] = useState(0);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleOpenDialog = (product = null) => {
    if (product) {
      setCurrentProduct(product);
      setIsEditing(true);
    } else {
      setCurrentProduct({ 
        name: '', 
        price: '', 
        category: '', 
        stock: '', 
        image: 'https://via.placeholder.com/300x200', 
        description: '' 
      });
      setIsEditing(false);
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCurrentProduct({
      ...currentProduct,
      [name]: name === 'price' || name === 'stock' ? Number(value) : value
    });
  };

  const handleSaveProduct = () => {
    if (isEditing) {
      // Update existing product
      setProducts(products.map(p => p.id === currentProduct.id ? currentProduct : p));
    } else {
      // Add new product
      const newProduct = {
        ...currentProduct,
        id: Math.max(...products.map(p => p.id)) + 1
      };
      setProducts([...products, newProduct]);
    }
    handleCloseDialog();
  };

  const handleDeleteProduct = (id) => {
    setProducts(products.filter(p => p.id !== id));
  };

  return (
    <Container maxWidth="xl" sx={{ mt: 4, mb: 5 }}>
      <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 'medium' }}>
        Admin Dashboard
      </Typography>

      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs value={tabValue} onChange={handleTabChange} aria-label="admin tabs">
          <Tab label="Products" />
          <Tab label="Orders" />
        </Tabs>
      </Box>

      {/* Products Tab */}
      {tabValue === 0 && (
        <>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Typography variant="h5" component="h2">
              Product Management
            </Typography>
            <Button 
              variant="contained" 
              startIcon={<AddIcon />}
              onClick={() => handleOpenDialog()}
              sx={{ 
                backgroundColor: '#000',
                '&:hover': {
                  backgroundColor: '#333',
                }
              }}
            >
              Add Product
            </Button>
          </Box>

          <TableContainer component={Paper} sx={{ mb: 4 }}>
            <Table sx={{ minWidth: 650 }} aria-label="product table">
              <TableHead sx={{ backgroundColor: '#f5f5f5' }}>
                <TableRow>
                  <StyledTableCell>ID</StyledTableCell>
                  <StyledTableCell>Name</StyledTableCell>
                  <StyledTableCell>Category</StyledTableCell>
                  <StyledTableCell align="right">Price</StyledTableCell>
                  <StyledTableCell align="right">Stock</StyledTableCell>
                  <StyledTableCell align="center">Actions</StyledTableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {products.map((product) => (
                  <StyledTableRow key={product.id}>
                    <TableCell>{product.id}</TableCell>
                    <TableCell>{product.name}</TableCell>
                    <TableCell>{product.category}</TableCell>
                    <TableCell align="right">${product.price}</TableCell>
                    <TableCell align="right">{product.stock}</TableCell>
                    <TableCell align="center">
                      <IconButton 
                        size="small" 
                        onClick={() => handleOpenDialog(product)}
                        sx={{ mr: 1 }}
                      >
                        <EditIcon fontSize="small" />
                      </IconButton>
                      <IconButton 
                        size="small" 
                        onClick={() => handleDeleteProduct(product.id)}
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </TableCell>
                  </StyledTableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          {/* Product Dialog */}
          <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth>
            <DialogTitle>{isEditing ? 'Edit Product' : 'Add New Product'}</DialogTitle>
            <DialogContent>
              <Grid container spacing={2} sx={{ mt: 1 }}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    name="name"
                    label="Product Name"
                    fullWidth
                    value={currentProduct.name}
                    onChange={handleInputChange}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth>
                    <InputLabel>Category</InputLabel>
                    <Select
                      name="category"
                      value={currentProduct.category}
                      label="Category"
                      onChange={handleInputChange}
                    >
                      <MenuItem value="Electronics">Electronics</MenuItem>
                      <MenuItem value="Clothing">Clothing</MenuItem>
                      <MenuItem value="Home">Home</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    name="price"
                    label="Price"
                    type="number"
                    fullWidth
                    value={currentProduct.price}
                    onChange={handleInputChange}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    name="stock"
                    label="Stock"
                    type="number"
                    fullWidth
                    value={currentProduct.stock}
                    onChange={handleInputChange}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    name="image"
                    label="Image URL"
                    fullWidth
                    value={currentProduct.image}
                    onChange={handleInputChange}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    name="description"
                    label="Description"
                    multiline
                    rows={4}
                    fullWidth
                    value={currentProduct.description}
                    onChange={handleInputChange}
                  />
                </Grid>
              </Grid>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleCloseDialog}>Cancel</Button>
              <Button 
                onClick={handleSaveProduct}
                variant="contained"
                sx={{ 
                  backgroundColor: '#000',
                  '&:hover': {
                    backgroundColor: '#333',
                  }
                }}
              >
                Save
              </Button>
            </DialogActions>
          </Dialog>
        </>
      )}

      {/* Orders Tab */}
      {tabValue === 1 && (
        <>
          <Typography variant="h5" component="h2" sx={{ mb: 3 }}>
            Order Management
          </Typography>

          <TableContainer component={Paper}>
            <Table sx={{ minWidth: 650 }} aria-label="orders table">
              <TableHead sx={{ backgroundColor: '#f5f5f5' }}>
                <TableRow>
                  <StyledTableCell>Order ID</StyledTableCell>
                  <StyledTableCell>Customer</StyledTableCell>
                  <StyledTableCell>Date</StyledTableCell>
                  <StyledTableCell>Status</StyledTableCell>
                  <StyledTableCell align="right">Total</StyledTableCell>
                  <StyledTableCell align="center">Actions</StyledTableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {orders.map((order) => (
                  <StyledTableRow key={order.id}>
                    <TableCell>{order.id}</TableCell>
                    <TableCell>{order.customer}</TableCell>
                    <TableCell>{order.date}</TableCell>
                    <TableCell>{order.status}</TableCell>
                    <TableCell align="right">${order.total}</TableCell>
                    <TableCell align="center">
                      <Button 
                        size="small" 
                        variant="outlined"
                        sx={{ 
                          borderColor: '#000',
                          color: '#000',
                          '&:hover': {
                            borderColor: '#333',
                            backgroundColor: 'rgba(0,0,0,0.04)',
                          }
                        }}
                      >
                        View Details
                      </Button>
                    </TableCell>
                  </StyledTableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </>
      )}
    </Container>
  );
}

export default Admin; 