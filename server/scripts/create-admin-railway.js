/**
 * Script to create an admin user in the Railway database
 * 
 * Usage: node create-admin-railway.js
 * 
 * This script will create an admin user with the following credentials:
 * Email: admin@example.com
 * Password: adminpassword
 * Username: admin
 */

// Load environment variables
require('dotenv').config();

// Set the environment to railway before requiring models
process.env.RAILWAY_ENVIRONMENT = 'true';

const { sequelize } = require('../models');
const userService = require('../services/userService');

async function createAdminUser() {
  try {
    // Admin user details
    const adminData = {
      email: 'admin@example.com',
      password: 'adminpassword',
      username: 'admin',
      firstName: 'Admin',
      lastName: 'User',
      role: 'admin'
    };

    console.log('Creating admin user in Railway database...');
    const admin = await userService.createAdminUser(adminData);
    console.log('Admin user created successfully:');
    console.log(admin);
    
    // Close the database connection
    await sequelize.close();
    console.log('Database connection closed');
  } catch (error) {
    console.error('Error creating admin user:', error.message);
    
    // If the error is about duplicate entry, the admin might already exist
    if (error.name === 'SequelizeUniqueConstraintError') {
      console.log('An admin user with this email or username already exists.');
    }
    
    // Close the database connection
    await sequelize.close();
    process.exit(1);
  }
}

// Run the function
createAdminUser(); 