const { cart, cart_row, products } = require('../models');

class CartService {
  async getUserCart(userId) {
    const userCart = await cart.findOne({
      where: { userId },
      include: [{
        model: cart_row,
        include: [products]
      }]
    });

    if (!userCart) {
      throw new Error('Cart not found');
    }
    return userCart;
  }

  async addItemToCart(userId, productId, quantity) {
    let userCart = await cart.findOne({ where: { userId } });
    
    if (!userCart) {
      userCart = await cart.create({ userId });
    }

    const cartItem = await cart_row.create({
      cartId: userCart.id,
      productId,
      quantity
    });

    return cartItem;
  }

  async updateCartItem(itemId, quantity) {
    const cartItem = await cart_row.findByPk(itemId);
    if (!cartItem) {
      throw new Error('Cart item not found');
    }
    
    return await cartItem.update({ quantity });
  }

  async removeCartItem(itemId) {
    const cartItem = await cart_row.findByPk(itemId);
    if (!cartItem) {
      throw new Error('Cart item not found');
    }
    
    await cartItem.destroy();
    return true;
  }

  async clearCart(userId) {
    const userCart = await cart.findOne({ where: { userId } });
    if (!userCart) {
      throw new Error('Cart not found');
    }
    
    await cart_row.destroy({ where: { cartId: userCart.id } });
    return true;
  }
}

 