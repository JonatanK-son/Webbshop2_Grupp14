import React, { useState } from "react";
import { 
  Box, Typography, IconButton, Stack, Divider, Grid, Tabs, Tab, 
  Table, TableBody, TableRow, TableCell, Chip, Container
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import AddToCartButton from "../components/AddToCartButton";
import { useLocation, useParams } from "react-router-dom";
import { styled } from "@mui/material/styles";
import LocalShippingOutlinedIcon from '@mui/icons-material/LocalShippingOutlined';
import VerifiedOutlinedIcon from '@mui/icons-material/VerifiedOutlined';
import AssignmentReturnOutlinedIcon from '@mui/icons-material/AssignmentReturnOutlined';
import RatingComponent from "./RatingComponent";

// Create a styled component for the product image container with simplified styling
const ProductImageContainer = styled(Box)(({ theme }) => ({
  position: 'relative',
  width: '100%',
  borderRadius: 4,
  overflow: 'hidden',
  border: '1px solid #e0e0e0',
  boxShadow: 'none',
}));

// Create a styled component for the product image with consistent ratio
const ProductImage = styled('img')(({ theme }) => ({
  width: '100%',
  height: 'auto',
  display: 'block',
  aspectRatio: '1 / 1', // Force 1:1 aspect ratio
  objectFit: 'cover', // Ensure the image covers the area without distortion
}));

// Compact styled tabs
const StyledTabs = styled(Tabs)(({ theme }) => ({
  minHeight: '40px',
  '& .MuiTab-root': {
    minHeight: '40px',
    padding: '8px 16px',
    textTransform: 'none',
    fontSize: '0.9rem',
  }
}));

const StyledTab = styled(Tab)(({ theme }) => ({
  fontWeight: 500,
}));

function TabPanel(props) {
  const { children, value, index, ...other } = props;
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`product-tabpanel-${index}`}
      aria-labelledby={`product-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ pt: 2 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

const Description = () => {
  // Get the product data passed from the previous page (via navigate)
  const location = useLocation();
  const { product } = location.state || {}; // Get the product object from state
  const { id } = useParams(); // Get product id from URL params for the rating component

  // If product is not found, show an error
  if (!product) {
    return <Typography variant="h6">Product not found</Typography>;
  }

  const [quantity, setQuantity] = useState(1);
  const [tabValue, setTabValue] = useState(0);

  const handleAdd = () => setQuantity((prev) => prev + 1);
  const handleRemove = () => setQuantity((prev) => Math.max(1, prev - 1));
  const handleTabChange = (event, newValue) => setTabValue(newValue);

  // Mock specifications data (replace with actual data as needed)
  const specifications = [
    { name: "Material", value: "High quality material" },
    { name: "Dimensions", value: "Varies by size" },
    { name: "Weight", value: "Lightweight" },
    { name: "Care", value: "Follow product instructions" }
  ];

  return (
    <Box sx={{ width: '100%' }}>
      <Grid container spacing={2}>
        {/* Left side: Image */}
        <Grid item xs={12} md={5} lg={4}>
          <ProductImageContainer>
            <ProductImage
              src={product.image || 'https://via.placeholder.com/400x400'}
              alt={product.name}
            />
          </ProductImageContainer>
        </Grid>

        {/* Right side: Main product info */}
        <Grid item xs={12} md={7} lg={8}>
          <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            {/* Product header */}
            <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1 }}>
              <Typography variant="h5" fontWeight="bold" sx={{ mr: 1 }}>
                {product.name}
              </Typography>
              <Chip 
                size="small" 
                label={product.category} 
                color="primary" 
                variant="outlined" 
                sx={{ borderRadius: 1 }}
              />
              <Chip 
                size="small" 
                label="In Stock" 
                color="success" 
                variant="outlined" 
                sx={{ borderRadius: 1 }}
              />
            </Stack>

            {/* Price section */}
            <Typography variant="h6" fontWeight="bold" color="primary" sx={{ mb: 1 }}>
              ${product.price.toFixed(2)}
            </Typography>

            {/* Short description */}
            <Typography variant="body2" sx={{ mb: 2, color: 'text.secondary' }}>
              {product.description}
            </Typography>

            {/* Add to cart section */}
            <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 2 }}>
              <Stack
                direction="row"
                alignItems="center"
                sx={{ border: "1px solid #e0e0e0", borderRadius: 1 }}
              >
                <IconButton onClick={handleRemove} size="small">
                  <RemoveIcon fontSize="small" />
                </IconButton>
                <Typography variant="body2" sx={{ mx: 1.5 }}>
                  {quantity}
                </Typography>
                <IconButton onClick={handleAdd} size="small">
                  <AddIcon fontSize="small" />
                </IconButton>
              </Stack>

              <Box sx={{ flexGrow: 1 }}>
                <AddToCartButton product={product} quantity={quantity} />
              </Box>
            </Stack>

            {/* Shipping info */}
            <Grid container spacing={1} sx={{ mb: 0 }}>
              <Grid item xs={4}>
                <Stack direction="row" spacing={0.5} alignItems="center">
                  <LocalShippingOutlinedIcon color="action" fontSize="small" />
                  <Typography variant="caption">Free Shipping</Typography>
                </Stack>
              </Grid>
              <Grid item xs={4}>
                <Stack direction="row" spacing={0.5} alignItems="center">
                  <VerifiedOutlinedIcon color="action" fontSize="small" />
                  <Typography variant="caption">Warranty</Typography>
                </Stack>
              </Grid>
              <Grid item xs={4}>
                <Stack direction="row" spacing={0.5} alignItems="center">
                  <AssignmentReturnOutlinedIcon color="action" fontSize="small" />
                  <Typography variant="caption">Easy Returns</Typography>
                </Stack>
              </Grid>
            </Grid>
          </Box>
        </Grid>
      </Grid>

      {/* Product details tabs */}
      <Box sx={{ width: '100%', mt: 3, mb: 3 }}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <StyledTabs 
            value={tabValue} 
            onChange={handleTabChange} 
            aria-label="product information tabs"
            variant="scrollable"
            scrollButtons="auto"
          >
            <StyledTab label="Description" id="product-tab-0" />
            <StyledTab label="Specifications" id="product-tab-1" />
            <StyledTab label="Reviews" id="product-tab-2" />
            <StyledTab label="Shipping & Returns" id="product-tab-3" />
          </StyledTabs>
        </Box>
        
        <TabPanel value={tabValue} index={0}>
          <Typography variant="body2" paragraph>
            {product.description}
            <br/><br/>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
          </Typography>
        </TabPanel>
        
        <TabPanel value={tabValue} index={1}>
          <Table size="small">
            <TableBody>
              {specifications.map((spec, index) => (
                <TableRow key={index}>
                  <TableCell component="th" scope="row" sx={{ width: '30%', borderBottom: '1px solid rgba(224, 224, 224, 0.5)', py: 1 }}>
                    <Typography variant="body2" fontWeight="medium">{spec.name}</Typography>
                  </TableCell>
                  <TableCell sx={{ borderBottom: '1px solid rgba(224, 224, 224, 0.5)', py: 1 }}>
                    <Typography variant="body2">{spec.value}</Typography>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TabPanel>
        
        <TabPanel value={tabValue} index={2}>
          <RatingComponent productId={id || product.id} />
        </TabPanel>
        
        <TabPanel value={tabValue} index={3}>
          <Typography variant="body2" paragraph>
            <strong>Shipping Information</strong><br/>
            We offer free standard shipping on all orders. Delivery typically takes 3-5 business days.
          </Typography>
          <Typography variant="body2" paragraph>
            <strong>Return Policy</strong><br/>
            If you're not completely satisfied with your purchase, you can return it within 30 days for a full refund or exchange.
          </Typography>
        </TabPanel>
      </Box>
    </Box>
  );
};

export default Description;