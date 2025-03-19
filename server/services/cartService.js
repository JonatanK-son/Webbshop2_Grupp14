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
      // Create a new cart if one doesn't exist
      return await cart.create({ 
        userId, 
        payed: false, 
        totalPris: 0 
      });
    }
    return userCart;
  }

  async addItemToCart(userId, productId, quantity) {
    let userCart = await cart.findOne({ where: { userId } });
    
    if (!userCart) {
      userCart = await cart.create({ 
        userId, 
        payed: false, 
        totalPris: 0 
      });
    }

    // Check if product already exists in cart
    const existingItem = await cart_row.findOne({
      where: { 
        cartId: userCart.id, 
        productId 
      }
    });

    if (existingItem) {
      // Update quantity if product already exists
      existingItem.quantity += quantity;
      await existingItem.save();
      
      // Update total price
      await this.updateCartTotal(userCart.id);
      
      return existingItem;
    }

    // Add new product to cart
    const product = await products.findByPk(productId);
    if (!product) {
      throw new Error('Product not found');
    }

    const cartItem = await cart_row.create({
      cartId: userCart.id,
      productId,
      quantity
    });

    // Update total price
    await this.updateCartTotal(userCart.id);

    return cartItem;
  }

  async updateCartItem(itemId, quantity) {
    const cartItem = await cart_row.findByPk(itemId);
    if (!cartItem) {
      throw new Error('Cart item not found');
    }
    
    if (quantity <= 0) {
      await cartItem.destroy();
      await this.updateCartTotal(cartItem.cartId);
      return null;
    }
    
    cartItem.quantity = quantity;
    await cartItem.save();
    
    // Update total price
    await this.updateCartTotal(cartItem.cartId);
    
    return cartItem;
  }

  async removeCartItem(itemId) {
    const cartItem = await cart_row.findByPk(itemId);
    if (!cartItem) {
      throw new Error('Cart item not found');
    }
    
    const cartId = cartItem.cartId;
    await cartItem.destroy();
    
    // Update total price
    await this.updateCartTotal(cartId);
    
    return true;
  }

  async clearCart(userId) {
    const userCart = await cart.findOne({ where: { userId } });
    if (!userCart) {
      throw new Error('Cart not found');
    }
    
    await cart_row.destroy({ where: { cartId: userCart.id } });
    
    // Reset total price
    userCart.totalPris = 0;
    await userCart.save();
    
    return true;
  }

  async updateCartTotal(cartId) {
    const cartRows = await cart_row.findAll({
      where: { cartId },
      include: [products]
    });
    
    const total = cartRows.reduce((sum, row) => {
      return sum + (row.quantity * row.product.price);
    }, 0);
    
    await cart.update(
      { totalPris: total },
      { where: { id: cartId } }
    );
    
    return total;
  }

  async checkout(userId) {
    const userCart = await cart.findOne({ where: { userId } });
    
    if (!userCart) {
      throw new Error('Cart not found');
    }
    
    if (userCart.payed) {
      throw new Error('Cart is already paid');
    }
    
    // Check if cart has items
    const cartItems = await cart_row.count({ where: { cartId: userCart.id } });
    if (cartItems === 0) {
      throw new Error('Cannot checkout empty cart');
    }
    
    // Mark as paid
    userCart.payed = true;
    await userCart.save();
    
    // Create a new cart for the user
    await cart.create({ 
      userId, 
      payed: false, 
      totalPris: 0 
    });
    
    return userCart;
  }
}

module.exports = new CartService();

 