import React, { useState, useEffect, useRef } from "react";
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
  Tab,
  Alert,
  CircularProgress,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import { productService, adminService, userService } from "../services";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  fontWeight: theme.typography.fontWeightMedium,
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  "&:nth-of-type(odd)": {
    backgroundColor: theme.palette.action.hover,
  },
  "&:last-child td, &:last-child th": {
    border: 0,
  },
}));

function Admin() {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [currentProduct, setCurrentProduct] = useState({
    name: "",
    price: "",
    category: "",
    stock: "",
    image: "",
    description: "",
  });
  const [isEditing, setIsEditing] = useState(false);
  const [tabValue, setTabValue] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState(null);

  // References for form fields
  const nameRef = useRef(null);
  const priceRef = useRef(null);
  const stockRef = useRef(null);
  const categoryRef = useRef(null);
  const imageRef = useRef(null);
  const descriptionRef = useRef(null);

  // Check if user is admin
  useEffect(() => {
    const checkAdmin = async () => {
      try {
        const currentUser = userService.getCurrentUser();
        if (!currentUser) {
          navigate("/login");
          return;
        }

        try {
          const userProfile = await userService.getUserProfile(currentUser.id);
          if (userProfile.role !== "admin") {
            navigate("/");
          }
          setLoading(false);
        } catch (profileErr) {
          console.error("Error fetching user profile:", profileErr);
          navigate("/");
        }
      } catch (err) {
        console.error("Error checking admin status:", err);
        navigate("/");
      }
    };

    checkAdmin();
  }, [navigate]);

  // Fetch products
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const data = await productService.getAllProducts();
        setProducts(data);
        setError(null);
      } catch (err) {
        console.error("Error fetching products:", err);
        setError("Failed to load products. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Fetch orders
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        const data = await adminService.getAllOrders();
        setOrders(data);
        setError(null);
      } catch (err) {
        console.error("Error fetching orders:", err);
        setError("Failed to load orders. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    if (tabValue === 1) {
      fetchOrders();
    }
  }, [tabValue]);

  // Fetch dashboard stats
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await adminService.getDashboardStats();
        setStats(data);
      } catch (err) {
        console.error("Error fetching stats:", err);
      }
    };

    fetchStats();
  }, []);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleOpenDialog = (product = null) => {
    if (product) {
      setCurrentProduct({ ...product });
      setIsEditing(true);
    } else {
      setCurrentProduct({
        name: "",
        price: "",
        category: "",
        stock: "",
        image: "",
        description: "",
      });
      setIsEditing(false);
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setError(null);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    if (name === "name") {
      // Update the image URL dynamically when the product name changes
      setCurrentProduct({
        ...currentProduct,
        [name]: value,
        image: `http://localhost:5000/images/${value}.png`, // Dynamically set the image URL
      });
    } else {
      setCurrentProduct({
        ...currentProduct,
        [name]: name === "price" || name === "stock" ? Number(value) : value,
      });
    }
  };

  // Function to fetch form data on Save
  const handleSaveProduct = async () => {
    try {
      const productData = {
        name: nameRef.current.value,
        price: priceRef.current.value,
        stock: stockRef.current.value,
        category: categoryRef.current.value,
        image: imageRef.current.value,
        description: descriptionRef.current.value,
      };

      if (isEditing) {
        // Update existing product
        await productService.updateProduct(currentProduct.id, productData);
        setProducts(
          products.map((p) => (p.id === currentProduct.id ? productData : p))
        );
      } else {
        // Add new product
        const newProduct = await productService.createProduct(productData);
        setProducts([...products, newProduct]);

        // Optional: Trigger image generation API if needed
        await fetch("http://localhost:5000/api/gemini/generate-image", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ product: newProduct }),
        });
      }

      handleCloseDialog();
      setError(null);
    } catch (err) {
      console.error("Error saving product:", err);
      setError("Failed to save product. Please try again.");
    }
  };

  const handleDeleteProduct = async (id) => {
    try {
      await productService.deleteProduct(id);
      setProducts(products.filter((p) => p.id !== id));
      setError(null);
    } catch (err) {
      console.error("Error deleting product:", err);
      setError("Failed to delete product. Please try again.");
    }
  };

  const handleUpdateOrderStatus = async (orderId, status) => {
    try {
      await adminService.updateOrderStatus(orderId, status);
      setOrders(
        orders.map((order) =>
          order.id === orderId ? { ...order, status } : order
        )
      );
      setError(null);
    } catch (err) {
      console.error("Error updating order status:", err);
      setError("Failed to update order status. Please try again.");
    }
  };

  if (loading) {
    return (
      <Container
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "80vh",
        }}
      >
        <CircularProgress />
      </Container>
    );
  }

  return (
    <Container maxWidth="xl" sx={{ mt: 4, mb: 5 }}>
      <Typography
        variant="h4"
        component="h1"
        gutterBottom
        sx={{ fontWeight: "medium" }}
      >
        Admin Dashboard
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {stats && (
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={6} md={3}>
            <Paper sx={{ p: 2, textAlign: "center" }}>
              <Typography variant="h6">Total Orders</Typography>
              <Typography variant="h4">{stats.totalOrders}</Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Paper sx={{ p: 2, textAlign: "center" }}>
              <Typography variant="h6">Total Revenue</Typography>
              <Typography variant="h4">${stats.totalRevenue}</Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Paper sx={{ p: 2, textAlign: "center" }}>
              <Typography variant="h6">Total Products</Typography>
              <Typography variant="h4">{stats.totalProducts}</Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Paper sx={{ p: 2, textAlign: "center" }}>
              <Typography variant="h6">Total Users</Typography>
              <Typography variant="h4">{stats.totalUsers}</Typography>
            </Paper>
          </Grid>
        </Grid>
      )}

      <Box sx={{ borderBottom: 1, borderColor: "divider", mb: 3 }}>
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          aria-label="admin tabs"
        >
          <Tab label="Products" />
          <Tab label="Orders" />
        </Tabs>
      </Box>

      {/* Products Tab */}
      {tabValue === 0 && (
        <>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mb: 3,
            }}
          >
            <Typography variant="h5" component="h2">
              Product Management
            </Typography>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => handleOpenDialog()}
              sx={{
                backgroundColor: "#000",
                "&:hover": {
                  backgroundColor: "#333",
                },
              }}
            >
              Add Product
            </Button>
          </Box>

          <TableContainer component={Paper} sx={{ mb: 4 }}>
            <Table sx={{ minWidth: 650 }} aria-label="product table">
              <TableHead sx={{ backgroundColor: "#f5f5f5" }}>
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
              <TableHead sx={{ backgroundColor: "#f5f5f5" }}>
                <TableRow>
                  <StyledTableCell>Order ID</StyledTableCell>
                  <StyledTableCell>Customer</StyledTableCell>
                  <StyledTableCell>Date</StyledTableCell>
                  <StyledTableCell>Total</StyledTableCell>
                  <StyledTableCell>Status</StyledTableCell>
                  <StyledTableCell>Actions</StyledTableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {orders.map((order) => (
                  <StyledTableRow key={order.id}>
                    <TableCell>{order.id}</TableCell>
                    <TableCell>{order.customer}</TableCell>
                    <TableCell>
                      {new Date(order.date).toLocaleDateString()}
                    </TableCell>
                    <TableCell>${order.total}</TableCell>
                    <TableCell>
                      <FormControl size="small" fullWidth>
                        <Select
                          value={order.status}
                          onChange={(e) =>
                            handleUpdateOrderStatus(order.id, e.target.value)
                          }
                        >
                          <MenuItem value="Processing">Processing</MenuItem>
                          <MenuItem value="Shipped">Shipped</MenuItem>
                          <MenuItem value="Delivered">Delivered</MenuItem>
                          <MenuItem value="Cancelled">Cancelled</MenuItem>
                        </Select>
                      </FormControl>
                    </TableCell>
                    <TableCell>
                      <Button
                        size="small"
                        onClick={() => navigate(`/admin/orders/${order.id}`)}
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

      {/* Product Dialog */}
      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          {isEditing ? "Edit Product" : "Add New Product"}
        </DialogTitle>
        <DialogContent>
          {error && (
            <Alert severity="error" sx={{ mb: 2, mt: 1 }}>
              {error}
            </Alert>
          )}
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <TextField
                name="name"
                label="Product Name"
                inputRef={nameRef}
                fullWidth
                required
                defaultValue={currentProduct.name || ""}
                onChange={handleInputChange}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Price"
                type="number"
                inputRef={priceRef}
                fullWidth
                required
                defaultValue={currentProduct.price || ""}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Stock"
                type="number"
                inputRef={stockRef}
                fullWidth
                required
                defaultValue={currentProduct.stock || ""}
              />
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth required>
                <InputLabel>Category</InputLabel>
                <Select
                  inputRef={categoryRef}
                  value={currentProduct.category || ""}
                  label="Category"
                >
                  <MenuItem value="Electronics">Electronics</MenuItem>
                  <MenuItem value="Clothing">Clothing</MenuItem>
                  <MenuItem value="Home">Home</MenuItem>
                  <MenuItem value="Books">Books</MenuItem>
                  <MenuItem value="Sports">Sports</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Image URL"
                inputRef={imageRef}
                fullWidth
                required
                value={ currentProduct.image || `http://localhost:5000/images/${currentProduct.name}.png` } // Dynamically set the image URL
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Description"
                inputRef={descriptionRef}
                fullWidth
                multiline
                rows={4}
                required
                defaultValue={currentProduct.description || ""}
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
              backgroundColor: "#000",
              "&:hover": {
                backgroundColor: "#333",
              },
            }}
          >
            {isEditing ? "Update" : "Add"}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}

export default Admin;
