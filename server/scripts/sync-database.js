/**
 * Script to sync all database models, dropping and recreating the tables
 * 
 * Usage: node sync-database.js
 * 
 * WARNING: This will drop and recreate all tables. All data will be lost.
 */

const db = require('../models');

async function syncDatabase() {
  console.log('Starting database sync...');
  try {
    // Force: true will drop the table if it already exists
    await db.sequelize.sync({ force: true });
    console.log('Database sync completed successfully.');
    
    // Create some example data
    await createExampleData();
    
    console.log('All done! You can now start the application.');
  } catch (error) {
    console.error('Error syncing database:', error);
  } finally {
    process.exit();
  }
}

async function createExampleData() {
  console.log('Creating example products...');
  
  // Create some example products
  const products = [
    {
      name: 'Smartphone XYZ',
      description: 'Latest model with high-resolution camera and fast processor.',
      price: 799.99,
      category: 'Electronics',
      stock: 25,
      image: 'https://via.placeholder.com/300x200?text=Smartphone'
    },
    {
      name: 'Laptop Pro',
      description: 'Powerful laptop for professionals and gamers.',
      price: 1299.99,
      category: 'Electronics',
      stock: 15,
      image: 'https://via.placeholder.com/300x200?text=Laptop'
    },
    {
      name: 'Casual T-Shirt',
      description: 'Comfortable cotton t-shirt for everyday wear.',
      price: 24.99,
      category: 'Clothing',
      stock: 100,
      image: 'https://via.placeholder.com/300x200?text=TShirt'
    },
    {
      name: 'Coffee Table',
      description: 'Modern design coffee table for your living room.',
      price: 149.99,
      category: 'Home',
      stock: 10,
      image: 'https://via.placeholder.com/300x200?text=Table'
    },
    {
      name: 'Fitness Tracker',
      description: 'Track your steps, heart rate, and sleep patterns.',
      price: 89.99,
      category: 'Sports',
      stock: 30,
      image: 'https://via.placeholder.com/300x200?text=Fitness'
    }
  ];
  
  // Create products
  await db.products.bulkCreate(products);
  console.log(`Created ${products.length} example products.`);
}

// Run the function
syncDatabase(); 