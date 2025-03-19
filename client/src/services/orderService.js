import api from './api';

const orderService = {
  // Get user's orders
  getOrders: async (userId) => {
    try {
      const response = await api.get(`/orders/user/${userId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching orders:', error);
      throw error;
    }
  },

  // Get order details by ID
  getOrderById: async (orderId) => {
    try {
      const response = await api.get(`/orders/${orderId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching order details:', error);
      throw error;
    }
  },

  // Create a new order
  createOrder: async (orderData) => {
    try {
      const response = await api.post('/orders', orderData);
      return response.data;
    } catch (error) {
      console.error('Error creating order:', error);
      throw error;
    }
  },

  // Cancel an order
  cancelOrder: async (orderId) => {
    try {
      const response = await api.put(`/orders/${orderId}/cancel`);
      return response.data;
    } catch (error) {
      console.error('Error cancelling order:', error);
      throw error;
    }
  },

  // Admin: Get all orders with pagination
  getAllOrders: async (page = 1, limit = 10) => {
    try {
      const response = await api.get(`/orders?page=${page}&limit=${limit}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching all orders:', error);
      throw error;
    }
  },

  // Admin: Update order status
  updateOrderStatus: async (orderId, status) => {
    try {
      const response = await api.put(`/orders/${orderId}/status`, { status });
      return response.data;
    } catch (error) {
      console.error('Error updating order status:', error);
      throw error;
    }
  },

  // Admin: Update shipping information
  updateShippingInfo: async (orderId, trackingNumber) => {
    try {
      const response = await api.put(`/orders/${orderId}/shipping`, { trackingNumber });
      return response.data;
    } catch (error) {
      console.error('Error updating shipping info:', error);
      throw error;
    }
  }
};

export default orderService; 