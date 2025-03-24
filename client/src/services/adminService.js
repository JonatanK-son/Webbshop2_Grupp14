import api from './api';

const adminService = {
  // Get all orders
  getAllOrders: async (page = 1, limit = 10) => {
    try {
      const response = await api.get(`/orders?page=${page}&limit=${limit}`);
      return response.data.orders || [];
    } catch (error) {
      console.error('Error fetching orders:', error);
      throw error;
    }
  },

  // Get order by ID
  getOrderById: async (orderId) => {
    try {
      const response = await api.get(`/orders/${orderId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching order:', error);
      throw error;
    }
  },

  // Update order status
  updateOrderStatus: async (orderId, status) => {
    try {
      const response = await api.put(`/orders/${orderId}/status`, { status });
      return response.data;
    } catch (error) {
      console.error('Error updating order status:', error);
      throw error;
    }
  },

  // Update order shipping information
  updateOrderShipping: async (orderId, trackingNumber) => {
    try {
      const response = await api.put(`/orders/${orderId}/shipping`, { trackingNumber });
      return response.data;
    } catch (error) {
      console.error('Error updating shipping information:', error);
      throw error;
    }
  },

  // Get all users
  getAllUsers: async () => {
    try {
      const response = await api.get('/admin/users');
      return response.data;
    } catch (error) {
      console.error('Error fetching users:', error);
      throw error;
    }
  },

  // Update user role
  updateUserRole: async (userId, role) => {
    try {
      const response = await api.put(`/admin/users/${userId}/role`, { role });
      return response.data;
    } catch (error) {
      console.error('Error updating user role:', error);
      throw error;
    }
  },

  // Get dashboard statistics
  getDashboardStats: async () => {
    try {
      // Directly use alternative approach without trying the unavailable stats endpoint
      console.log('Using orders and products APIs for dashboard stats');
      
      // Get data from other endpoints to build stats
      const [ordersRes, productsRes] = await Promise.all([
        api.get('/orders'),
        api.get('/products')
      ]);
      
      const orders = ordersRes.data.orders || [];
      const products = productsRes.data || [];
      
      // Calculate total revenue
      const totalRevenue = orders.reduce((sum, order) => sum + (order.totalAmount || 0), 0);
      
      return {
        totalOrders: orders.length,
        totalRevenue: totalRevenue.toFixed(2),
        totalProducts: products.length,
        totalUsers: 0 // We don't have this data without a specific endpoint
      };
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
      // Return default values if stats can't be fetched
      return {
        totalOrders: 0,
        totalRevenue: 0,
        totalProducts: 0,
        totalUsers: 0
      };
    }
  }
};

export default adminService; 