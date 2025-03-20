import React from "react";
import { Outlet } from "react-router-dom";
import { Box, Container } from '@mui/material';
import { styled } from '@mui/material/styles';
import { useCart } from './context/CartContext';
import CartDrawer from './components/CartDrawer';
import Navbar from './components/Navbar';

const Main = styled('main')(({ theme }) => ({
  flexGrow: 1,
  padding: 0,
  width: '100%',
}));

function App() {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      {/* Navbar Component */}
      <Navbar />
      
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
  );
}

export default App;
