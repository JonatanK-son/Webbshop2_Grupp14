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
        setCartItems(cartData.items || []);
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
    // Optimistic UI update
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
    
    // If user is logged in, sync with API
    if (userId) {
      try {
        await cartService.addToCart(userId, product.id, quantity);
      } catch (err) {
        console.error('Failed to add item to cart:', err);
        // You could revert the optimistic update here if needed
      }
    }
  };

  const removeFromCart = async (productId) => {
    // Optimistic UI update
    setCartItems(prevItems => prevItems.filter(item => item.id !== productId));
    
    // If user is logged in, sync with API
    if (userId) {
      try {
        await cartService.removeFromCart(userId, productId);
      } catch (err) {
        console.error('Failed to remove item from cart:', err);
        // You could revert the optimistic update here if needed
      }
    }
  };

  const updateQuantity = async (productId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    
    // Optimistic UI update
    setCartItems(prevItems => 
      prevItems.map(item => 
        item.id === productId ? { ...item, quantity } : item
      )
    );
    
    // If user is logged in, sync with API
    if (userId) {
      try {
        await cartService.updateCartItem(userId, productId, quantity);
      } catch (err) {
        console.error('Failed to update cart item quantity:', err);
        // You could revert the optimistic update here if needed
      }
    }
  };

  const clearCart = async () => {
    // Optimistic UI update
    setCartItems([]);
    
    // If user is logged in, sync with API
    if (userId) {
      try {
        await cartService.clearCart(userId);
      } catch (err) {
        console.error('Failed to clear cart:', err);
        // You could revert the optimistic update here if needed
      }
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