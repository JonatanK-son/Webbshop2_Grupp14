const { users } = require('../models');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// Set JWT secret from environment variable or use a default for development
const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret_key';

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
    // Hash the password before saving
    const saltRounds = 10;
    userData.password = await bcrypt.hash(userData.password, saltRounds);
    
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
    
    // Hash password if it's being updated
    if (userData.password) {
      const saltRounds = 10;
      userData.password = await bcrypt.hash(userData.password, saltRounds);
    }
    
    // Remove password from update data for security if not being updated
    const updateData = userData.password ? userData : { ...userData, password: undefined };
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

  async login(credentials) {
    const { email, password } = credentials;
    
    // Find user by email
    const user = await users.findOne({ where: { email } });
    if (!user) {
      throw new Error('Invalid email or password');
    }
    
    // Compare passwords
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new Error('Invalid email or password');
    }
    
    // Generate JWT token
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: '24h' }
    );
    
    // Return user info and token (exclude password)
    const { password: _, ...userWithoutPassword } = user.toJSON();
    return {
      user: userWithoutPassword,
      token
    };
  }

  async createAdminUser(userData) {
    // Set role to admin
    userData.role = 'admin';
    return await this.createUser(userData);
  }
}

module.exports = new UserService(); 