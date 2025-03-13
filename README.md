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

3. Run the server with local database:
   ```
   npm start
   ```

4. Run the server with Railway database:
   ```
   npm run start:railway
   ```

5. Initialize the database:
   - For local database:
     ```
     npm run db:sync
     npm run db:create-admin
     ```
   
   - For Railway database:
     ```
     npm run db:sync:railway
     npm run db:create-admin:railway
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

3. Run the client pointing to local backend:
   ```
   npm run dev:local
   ```

4. Run the client pointing to Railway backend:
   ```
   npm run dev:railway
   ```

### Environment Configuration

The application uses environment variables to configure the backend URL:

- For the client:
  - Edit `.env.local` to configure the local backend URL
  - Edit `.env.railway` to configure the Railway backend URL

- For the server:
  - Edit `.env` to configure the Railway database connection

## Admin Account

The default admin account created by the setup scripts:

- Email: admin@example.com
- Password: adminpassword
- Username: admin 