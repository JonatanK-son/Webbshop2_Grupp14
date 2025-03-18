# Webbshop

## Setup and Running the Application

### Server Setup

1. Navigate to the server directory:
   ```
   cd server
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Run the server:
   ```
   npm start
   ```

4. Initialize the database:
   ```
   npm run db:sync
   npm run db:create-admin
   ```

### Client Setup

1. Navigate to the client directory:
   ```
   cd client
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Run the client:
   ```
   npm run dev
   ```
   
   Or use the local environment configuration:
   ```
   npm run dev:local
   ```

### Environment Configuration

The application uses environment variables to configure the backend URL:

- For the client:
  - Edit `.env.local` to configure the local backend URL

- For the server:
  - Edit `.env` to configure the database connection

## Admin Account

The default admin account created by the setup scripts:

- Email: admin@example.com
- Password: adminpassword
- Username: admin 