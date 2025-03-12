const { users } = require('../models');

class UserService {
  async getAllUsers() {
    return await users.findAll({
      attributes: { exclude: ['password'] }
    });
  }

  async getUserById(id) {
    const user = await users.findByPk(id, {
      attributes: { exclude: ['password'] }
    });
    if (!user) {
      throw new Error('User not found');
    }
    return user;
  }

  async createUser(userData) {
    // TODO: Add password hashing before saving
    const newUser = await users.create(userData);
    
    // Return user without password
    const { password, ...userWithoutPassword } = newUser.toJSON();
    return userWithoutPassword;
  }

  async updateUser(id, userData) {
    const user = await users.findByPk(id);
    if (!user) {
      throw new Error('User not found');
    }
    
    // Remove password from update data for security
    const { password, ...updateData } = userData;
    await user.update(updateData);
    
    // Return user without password
    const updatedUser = await this.getUserById(id);
    return updatedUser;
  }

  async deleteUser(id) {
    const user = await users.findByPk(id);
    if (!user) {
      throw new Error('User not found');
    }
    
    await user.destroy();
    return true;
  }
}

module.exports = new UserService(); 