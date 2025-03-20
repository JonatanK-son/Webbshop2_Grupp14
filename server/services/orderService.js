const { order, cart, cart_row, products, users } = require('../models');

class OrderService {
  async createOrder(userId, cartId, shippingAddress) {
    // Validate if the cart exists and is paid
    const checkedOutCart = await cart.findOne({
      where: { id: cartId, userId, payed: true },
      include: [{
        model: cart_row,
        include: [products]
      }]
    });

    if (!checkedOutCart) {
      throw new Error('Cart not found or not checked out');
    }

    // Create order with shipping address and total amount
    const newOrder = await order.create({
      userId,
      cartId,
      shippingAddress,
      totalAmount: checkedOutCart.totalPris,
      status: 'pending',
      paymentStatus: 'paid', // Assuming payment is processed at checkout
    });

    return await this.getOrderById(newOrder.id);
  }

  async getOrdersByUser(userId) {
    const userOrders = await order.findAll({
      where: { userId },
      include: [{
        model: cart,
        include: [{
          model: cart_row,
          include: [products]
        }]
      }],
      order: [['orderDate', 'DESC']]
    });

    return userOrders;
  }

  async getOrderById(orderId) {
    const orderDetail = await order.findByPk(orderId, {
      include: [
        {
          model: cart,
          include: [{
            model: cart_row,
            include: [products]
          }]
        },
        {
          model: users,
          attributes: ['id', 'email', 'username', 'firstName', 'lastName']
        }
      ]
    });

    if (!orderDetail) {
      throw new Error('Order not found');
    }

    return orderDetail;
  }

  async updateOrderStatus(orderId, status) {
    const orderToUpdate = await order.findByPk(orderId);
    
    if (!orderToUpdate) {
      throw new Error('Order not found');
    }
    
    await orderToUpdate.update({ status });
    return await this.getOrderById(orderId);
  }

  async updateShippingInfo(orderId, trackingNumber) {
    const orderToUpdate = await order.findByPk(orderId);
    
    if (!orderToUpdate) {
      throw new Error('Order not found');
    }
    
    await orderToUpdate.update({ 
      trackingNumber,
      status: 'shipped' 
    });
    
    return await this.getOrderById(orderId);
  }

  async getAllOrders(page = 1, limit = 10) {
    const offset = (page - 1) * limit;
    
    const { count, rows } = await order.findAndCountAll({
      include: [
        {
          model: users,
          attributes: ['id', 'username', 'email']
        },
        {
          model: cart
        }
      ],
      order: [['orderDate', 'DESC']],
      limit,
      offset
    });

    return {
      totalItems: count,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
      orders: rows
    };
  }

  async cancelOrder(orderId) {
    const orderToCancel = await order.findByPk(orderId);
    
    if (!orderToCancel) {
      throw new Error('Order not found');
    }
    
    // Check if order can be cancelled (e.g., not already shipped)
    if (['shipped', 'delivered'].includes(orderToCancel.status)) {
      throw new Error(`Cannot cancel order in ${orderToCancel.status} status`);
    }
    
    await orderToCancel.update({ status: 'cancelled' });
    return await this.getOrderById(orderId);
  }
}

module.exports = new OrderService(); 