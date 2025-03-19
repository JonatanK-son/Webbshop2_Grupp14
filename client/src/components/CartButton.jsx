import React from 'react';
import { IconButton, Badge, Tooltip } from '@mui/material';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import { useCart } from '../context/CartContext';

const CartButton = () => {
  const { toggleCart, cartItemCount } = useCart();

  return (
    <Tooltip title="Shopping Cart">
      <IconButton 
        color="inherit" 
        onClick={toggleCart}
        aria-label="cart"
        sx={{ 
          position: 'relative',
          transition: 'transform 0.2s',
          '&:hover': { transform: 'scale(1.1)' }
        }}
      >
        <Badge 
          badgeContent={cartItemCount} 
          color="error"
          sx={{
            '& .MuiBadge-badge': {
              right: -3,
              top: 3,
              border: '2px solid',
              borderColor: 'background.paper',
            }
          }}
        >
          <ShoppingCartIcon />
        </Badge>
      </IconButton>
    </Tooltip>
  );
};

export default CartButton; 