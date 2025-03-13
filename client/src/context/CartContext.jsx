import React, { createContext, useContext, useState, useEffect } from 'react';

// Initial cart items - in a real app, this might come from localStorage or be empty
const initialCartItems = [
  {
    id: 1,
    name: 'Product 1',
    price: 199,
    quantity: 2,
    image: 'https://via.placeholder.com/300x200',
  },
  {
    id: 3,
    name: 'Product 3',
    price: 399,
    quantity: 1,
    image: 'https://via.placeholder.com/300x200',
  }
];

// Create context
const CartContext = createContext();

// Custom hook to use the cart context
export const useCart = () => {
  return useContext(CartContext);
};

// Provider component
export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState(() => {
    // Try to get cart from localStorage on initial load
    const savedCart = localStorage.getItem('cart');
    return savedCart ? JSON.parse(savedCart) : initialCartItems;
  });
  
  const [cartOpen, setCartOpen] = useState(false);

  // Save to localStorage whenever cart changes
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cartItems));
  }, [cartItems]);

  // Calculate cart totals
  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const shipping = subtotal > 0 ? 10 : 0;
  const total = subtotal + shipping;
  const cartItemCount = cartItems.reduce((count, item) => count + item.quantity, 0);

  // Cart functions
  const addToCart = (product, quantity = 1) => {
    setCartItems(prevItems => {
      // Check if item already exists in cart
      const existingItemIndex = prevItems.findIndex(item => item.id === product.id);
      
      if (existingItemIndex >= 0) {
        // Item exists, update quantity
        const updatedItems = [...prevItems];
        updatedItems[existingItemIndex] = {
          ...updatedItems[existingItemIndex],
          quantity: updatedItems[existingItemIndex].quantity + quantity
        };
        return updatedItems;
      } else {
        // Item doesn't exist, add new item
        return [...prevItems, { 
          id: product.id,
          name: product.name,
          price: product.price,
          image: product.image,
          quantity: quantity
        }];
      }
    });
    
    // Removed automatic drawer opening for better UX
  };

  const removeFromCart = (productId) => {
    setCartItems(prevItems => prevItems.filter(item => item.id !== productId));
  };

  const updateQuantity = (productId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    
    setCartItems(prevItems => 
      prevItems.map(item => 
        item.id === productId ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = () => {
    setCartItems([]);
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