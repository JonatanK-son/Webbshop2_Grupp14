import api from './api';

const adminService = {
  // Get all orders
  getAllOrders: async () => {
    try {
      const response = await api.get('/admin/orders');
      return response.data;
    } catch (error) {
      console.error('Error fetching orders:', error);
      throw error;
    }
  },

  // Get order by ID
  getOrderById: async (orderId) => {
    try {
      const response = await api.get(`/admin/orders/${orderId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching order:', error);
      throw error;
    }
  },

  // Update order status
  updateOrderStatus: async (orderId, status) => {
    try {
      const response = await api.put(`/admin/orders/${orderId}/status`, { status });
      return response.data;
    } catch (error) {
      console.error('Error updating order status:', error);
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
      const response = await api.get('/admin/stats');
      return response.data;
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
      throw error;
    }
  }
};

export default adminService; 