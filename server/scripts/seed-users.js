/**
 * Script to seed the database with sample users
 * 
 * This script creates 3 sample users with different roles
 */

const { sequelize } = require('../models');
const userService = require('../services/userService');

async function seedUsers() {
  try {
    // Sample user data
    const users = [
      {
        email: 'user1@example.com',
        password: 'password123',
        username: 'user1',
        firstName: 'John',
        lastName: 'Doe',
        role: 'user'
      },
      {
        email: 'user2@example.com',
        password: 'password123',
        username: 'user2',
        firstName: 'Jane',
        lastName: 'Smith',
        role: 'user'
      },
      {
        email: 'user3@example.com',
        password: 'password123',
        username: 'user3',
        firstName: 'Bob',
        lastName: 'Johnson',
        role: 'user'
      }
    ];

    console.log('Creating sample users...');
    
    for (const userData of users) {
      try {
        await userService.createUser(userData);
        console.log(`User created: ${userData.username} (${userData.email})`);
      } catch (error) {
        // If user already exists, skip
        if (error.name === 'SequelizeUniqueConstraintError') {
          console.log(`User ${userData.email} already exists, skipping...`);
        } else {
          console.error(`Error creating user ${userData.email}:`, error.message);
        }
      }
    }
    
    console.log('Sample users created successfully!');
    
    // Close the database connection
    await sequelize.close();
    console.log('Database connection closed');
  } catch (error) {
    console.error('Error seeding users:', error.message);
    
    // Close the database connection
    await sequelize.close();
    process.exit(1);
  }
}

// Run the function
seedUsers(); 