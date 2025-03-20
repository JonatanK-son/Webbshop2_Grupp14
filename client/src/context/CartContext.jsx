import React, { createContext, useContext, useState, useEffect } from 'react';
import { cartService, userService } from '../services';

// Initial cart items - empty array as we'll fetch from API
const initialCartItems = [];

// Create context
const CartContext = createContext();

// Custom hook to use the cart context
export const useCart = () => {
  return useContext(CartContext);
};

// Provider component
export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState(initialCartItems);
  const [cartOpen, setCartOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const currentUser = userService.getCurrentUser();
  const userId = currentUser ? currentUser.id : null;

  // Fetch cart from API on component mount and when userId changes
  useEffect(() => {
    const fetchCart = async () => {
      if (!userId) {
        // If no user is logged in, try to get cart from localStorage
        const savedCart = localStorage.getItem('cart');
        if (savedCart) {
          setCartItems(JSON.parse(savedCart));
        }
        return;
      }
      
      setLoading(true);
      setError(null);
      
      try {
        const cartData = await cartService.getCart(userId);
        
        // Transform the API response to match the client-side cart format
        const cartItems = cartData.cart_rows ? cartData.cart_rows.map(row => ({
          id: row.productId, // Use product ID from cart row
          itemId: row.id, // Store cart_row id for API operations
          name: row.product?.name,
          price: row.product?.price,
          image: row.product?.image,
          quantity: row.quantity
        })) : [];
        
        setCartItems(cartItems);
      } catch (err) {
        console.error('Failed to fetch cart:', err);
        setError('Failed to load your cart. Please try again.');
        
        // Fallback to localStorage if API fails
        const savedCart = localStorage.getItem('cart');
        if (savedCart) {
          setCartItems(JSON.parse(savedCart));
        }
      } finally {
        setLoading(false);
      }
    };
    
    fetchCart();
  }, [userId]);

  // Save to localStorage whenever cart changes (as a backup)
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cartItems));
  }, [cartItems]);

  // Calculate cart totals
  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const shipping = subtotal > 0 ? 10 : 0;
  const total = subtotal + shipping;
  const cartItemCount = cartItems.reduce((count, item) => count + item.quantity, 0);

  // Cart functions
  const addToCart = async (product, quantity = 1) => {
    // If user is logged in, sync with API first to ensure consistency
    if (userId) {
      try {
        const response = await cartService.addToCart(userId, product.id, quantity);
        
        // Refresh the cart to ensure consistency
        await refreshCart();
        return;
      } catch (err) {
        console.error('Failed to add item to cart:', err);
        // Continue with local update if API fails
      }
    }
    
    // Local update (for guest users or if API failed)
    setCartItems(prevItems => {
      const existingItemIndex = prevItems.findIndex(item => item.id === product.id);
      
      if (existingItemIndex >= 0) {
        const updatedItems = [...prevItems];
        updatedItems[existingItemIndex] = {
          ...updatedItems[existingItemIndex],
          quantity: updatedItems[existingItemIndex].quantity + quantity
        };
        return updatedItems;
      } else {
        return [...prevItems, { 
          id: product.id,
          name: product.name,
          price: product.price,
          image: product.image,
          quantity: quantity
        }];
      }
    });
  };

  const removeFromCart = async (productId) => {
    // If user is logged in, sync with API
    if (userId) {
      try {
        // Find the item to get the cart_row id
        const item = cartItems.find(item => item.id === productId);
        if (item && item.itemId) {
          await cartService.removeFromCart(userId, item.itemId);
        } else {
          console.error('Cannot find item ID for removal');
        }
        
        // Refresh the cart after API call
        await refreshCart();
        return;
      } catch (err) {
        console.error('Failed to remove item from cart:', err);
        // Continue with local update if API fails
      }
    }
    
    // Local update (for guest users or if API failed)
    setCartItems(prevItems => prevItems.filter(item => item.id !== productId));
  };

  const updateQuantity = async (productId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    
    // If user is logged in, sync with API
    if (userId) {
      try {
        // Find the item to get the cart_row id
        const item = cartItems.find(item => item.id === productId);
        if (item && item.itemId) {
          await cartService.updateCartItem(userId, item.itemId, quantity);
        } else {
          console.error('Cannot find item ID for update');
        }
        
        // Refresh the cart after API call
        await refreshCart();
        return;
      } catch (err) {
        console.error('Failed to update cart item quantity:', err);
        // Continue with local update if API fails
      }
    }
    
    // Local update (for guest users or if API failed)
    setCartItems(prevItems => 
      prevItems.map(item => 
        item.id === productId ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = async () => {
    // If user is logged in, sync with API
    if (userId) {
      try {
        await cartService.clearCart(userId);
        
        // Refresh the cart after API call
        await refreshCart();
        return;
      } catch (err) {
        console.error('Failed to clear cart:', err);
        // Continue with local update if API fails
      }
    }
    
    // Local update (for guest users or if API failed)
    setCartItems([]);
  };

  const refreshCart = async () => {
    if (!userId) {
      return;
    }
    
    setLoading(true);
    setError(null);
    
    try {
      const cartData = await cartService.getCart(userId);
      console.log('Cart data from API:', cartData); // Log for debugging
      
      // Transform the API response to match the client-side cart format
      const cartItems = cartData.cart_rows ? cartData.cart_rows.map(row => ({
        id: row.productId, // Use productId for client operations
        itemId: row.id, // Store cart_row id for API operations
        name: row.product?.name,
        price: row.product?.price,
        image: row.product?.image,
        quantity: row.quantity,
        amount: row.amount // Include amount field
      })) : [];
      
      console.log('Transformed cart items:', cartItems); // Log for debugging
      setCartItems(cartItems);
    } catch (err) {
      console.error('Failed to refresh cart:', err);
      setError('Failed to refresh your cart. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const toggleCart = () => {
    setCartOpen(prevState => !prevState);
  };

  // Value object to be provided to consumers
  const value = {
    cartItems,
    cartOpen,
    cartItemCount,
    subtotal,
    shipping,
    total,
    loading,
    error,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    refreshCart,
    toggleCart,
    setCartOpen
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};

export default CartContext; 