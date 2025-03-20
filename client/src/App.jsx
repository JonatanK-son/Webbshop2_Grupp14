import React, { useState } from "react";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import { Box, AppBar, Toolbar, Typography, Button, Menu, MenuItem, 
  Container, IconButton, Badge, Collapse, Drawer, List, ListItem, ListItemText, 
  ListItemAvatar, Avatar, Divider, Paper, ListItemIcon, ThemeProvider, createTheme } from '@mui/material';
import { styled } from '@mui/material/styles';
import { useCart } from './context/CartContext';
import CartDrawer from './components/CartDrawer';
import CartButton from './components/CartButton';

// Create custom theme
const theme = createTheme({
  palette: {
    primary: {
      main: '#A9846A', // Main brown color
      light: '#C4A484', // Lighter brown
      dark: '#8B6B4F', // Darker brown
    },
    secondary: {
      main: '#8B6B4F', // Complementary brown
    },
    background: {
      default: '#FDF6F0', // Light beige
      paper: '#ffffff',
    },
    text: {
      primary: '#5D4037', // Dark brown text
      secondary: '#8B6B4F', // Medium brown text
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 6,
          textTransform: 'none',
          fontWeight: 500,
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: '0 2px 4px rgba(0, 0, 0, 0.05)',
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: '#ffffff',
          color: '#5D4037',
          boxShadow: 'none',
          borderBottom: '1px solid #C4A484',
        },
      },
    },
  },
});

const Main = styled('main')(({ theme }) => ({
  flexGrow: 1,
  padding: 0,
  width: '100%',
}));

const StyledMenu = styled(Box)(({ theme }) => ({
  width: '100%',
  backgroundColor: theme.palette.background.default,
  borderBottom: `1px solid ${theme.palette.primary.light}`,
}));

const MenuContainer = styled(Container)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'center',
  gap: theme.spacing(4),
  padding: theme.spacing(2, 4),
  [theme.breakpoints.down('sm')]: {
    flexDirection: 'column',
    gap: theme.spacing(2),
    alignItems: 'center',
  }
}));

const CartDrawerHeader = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: theme.spacing(1, 2),
  borderBottom: `1px solid ${theme.palette.primary.light}`,
}));

const TotalContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: theme.spacing(0.5, 2),
}));

const QuantityControl = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(0.5),
}));

function App() {
  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        <AppBar position="static">
          <Toolbar sx={{ px: { xs: 1, sm: 2, md: 3 } }}>
            <IconButton
              color="primary"
              aria-label="open menu"
              edge="start"
              onClick={handleMenuToggle}
              sx={{ mr: 1 }}
            >
              <MenuIcon />
            </IconButton>
            <Typography 
              variant="h6" 
              component="div" 
              sx={{    
                fontWeight: 'bold',
                letterSpacing: '1px',
                cursor: 'pointer',
                color: 'primary.main'
              }}
              onClick={() => navigate('/')}
            >
              WEBSHOP
            </Typography>
            <Box sx={{ flexGrow: '1' }}></Box>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Button 
                color="primary"
                onClick={() => navigate('/')}
                sx={{ 
                  mx: { xs: 0.5, sm: 1 },
                  '&:hover': {
                    backgroundColor: 'transparent',
                    color: 'primary.dark'
                  }
                }}
              >
                Home
              </Button>
              <Button 
                color="primary"
                onClick={() => navigate('/products')}
                sx={{ 
                  mx: { xs: 0.5, sm: 1 },
                  '&:hover': {
                    backgroundColor: 'transparent',
                    color: 'primary.dark'
                  }
                }}
              >
                Products
              </Button>
              
              {isAuthenticated ? (
                <>
                  <IconButton 
                    color="primary"
                    onClick={handleUserMenuOpen}
                    sx={{ 
                      mx: { xs: 0.5, sm: 1 },
                      border: '1px solid transparent',
                      transition: 'all 0.2s',
                      '&:hover': {
                        backgroundColor: 'primary.light',
                        borderColor: 'primary.main'
                      },
                      ...(Boolean(userMenuAnchor) && {
                        backgroundColor: 'primary.light'
                      })
                    }}
                    aria-label="account menu"
                    aria-controls="user-menu"
                    aria-haspopup="true"
                  >
                    <PersonIcon />
                  </IconButton>
                  <Menu
                    anchorEl={userMenuAnchor}
                    open={Boolean(userMenuAnchor)}
                    onClose={handleUserMenuClose}
                    PaperProps={{
                      elevation: 3,
                      sx: { 
                        minWidth: 200,
                        borderRadius: '8px',
                        mt: 1.5
                      }
                    }}
                    transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                    anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                  >
                    <MenuItem disabled sx={{ opacity: 0.7, py: 1 }}>
                      <Typography variant="body2">
                        Signed in as <strong>{currentUser?.username}</strong>
                      </Typography>
                    </MenuItem>
                    <Divider />
                    {currentUser?.role === 'admin' && (
                      <MenuItem onClick={() => {
                        handleUserMenuClose();
                        navigate('/admin');
                      }}
                      sx={{ py: 1.5, '&:hover': { backgroundColor: 'primary.light' } }}
                      >
                        <ListItemIcon>
                          <DashboardIcon fontSize="small" />
                        </ListItemIcon>
                        Admin Dashboard
                      </MenuItem>
                    )}
                    <MenuItem onClick={() => {
                      handleUserMenuClose();
                      navigate('/orders');
                    }}
                    sx={{ py: 1.5, '&:hover': { backgroundColor: 'primary.light' } }}
                    >
                      <ListItemIcon>
                        <ReceiptIcon fontSize="small" />
                      </ListItemIcon>
                      My Orders
                    </MenuItem>
                    <MenuItem onClick={handleLogout}
                    sx={{ py: 1.5, '&:hover': { backgroundColor: 'primary.light' } }}
                    >
                      <ListItemIcon>
                        <LogoutIcon fontSize="small" color="error" />
                      </ListItemIcon>
                      <Typography color="error">Logout</Typography>
                    </MenuItem>
                  </Menu>
                </>
              ) : (
                <>
                  <Button
                    color="primary"
                    onClick={() => navigate('/login')}
                    sx={{ 
                      mx: { xs: 0.5, sm: 1 },
                      '&:hover': {
                        backgroundColor: 'transparent',
                        color: 'primary.dark'
                      }
                    }}
                  >
                    Login
                  </Button>
                  <Button
                    variant="outlined"
                    color="primary"
                    onClick={() => navigate('/register')}
                    sx={{ 
                      mx: { xs: 0.5, sm: 1 },
                      '&:hover': {
                        borderColor: 'primary.dark',
                        backgroundColor: 'transparent',
                        color: 'primary.dark'
                      }
                    }}
                  >
                    Register
                  </Button>
                </>
              )}
              
              <CartButton />
            </Box>
          </Toolbar>
        </AppBar>
        
        {/* Top dropdown menu */}
        <Collapse in={menuOpen}>
          <StyledMenu>
            <MenuContainer>
              <Collapse in={menuOpen} timeout="auto" unmountOnExit sx={{ width: '100%' }}>
                <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, justifyContent: 'center', gap: 2 }}>
                  {menuItems.map((item) => (
                    <Button
                      key={item.name}
                      component={Link}
                      to={item.path}
                      color="primary"
                      sx={{
                        color: location.pathname === item.path ? 'primary.main' : 'text.primary',
                        fontWeight: location.pathname === item.path ? 'bold' : 'regular',
                      }}
                    >
                      {item.name}
                    </Button>
                  ))}
                </Box>
              </Collapse>
            </MenuContainer>
          </StyledMenu>
        </Collapse>
        
        {/* Cart Drawer */}
        <CartDrawer />
        
        <Main>
          <Container 
            maxWidth={false} 
            disableGutters
            sx={{ 
              width: '100%',
              p: 0
            }}
          >
            <Outlet />
          </Container>
        </Main>
      </Box>
    </ThemeProvider>
  );
}

export default App;
