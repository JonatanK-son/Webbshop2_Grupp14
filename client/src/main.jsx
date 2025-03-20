import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './styles/index.css'
import App from './App.jsx'
import Home from './views/Home.jsx'
import ProductDetails from './views/ProductDetails.jsx'
import Products from './views/Products.jsx'
import Admin from './views/Admin.jsx'
import Login from './views/Login.jsx'
import Register from './views/Register.jsx'
import Checkout from './pages/Checkout.jsx'
import OrderHistory from './pages/OrderHistory.jsx'
import OrderDetail from './pages/OrderDetail.jsx'
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { CartProvider } from './context/CartContext.jsx';
import { UserProvider } from './context/UserContext.jsx';

const router = createBrowserRouter([
  { 
    path: '/', 
    element: <App />, 
    children: [
      {
        path: '/',
        element: <Home />
      },
      { 
        path: '/products', 
        element: <Products /> 
      },
      { 
        path: '/products/:id', 
        element: <ProductDetails /> 
      },
      {
        path: '/admin',
        element: <Admin />
      },
      {
        path: '/login',
        element: <Login />
      },
      {
        path: '/register',
        element: <Register />
      },
      {
        path: '/checkout',
        element: <Checkout />
      },
      {
        path: '/orders',
        element: <OrderHistory />
      },
      {
        path: '/orders/:orderId',
        element: <OrderDetail />
      }
    ]
  }
]);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <UserProvider>
      <CartProvider>
        <RouterProvider router={router} />
      </CartProvider>
    </UserProvider>
  </StrictMode>,
)
