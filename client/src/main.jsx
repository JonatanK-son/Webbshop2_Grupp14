import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './styles/index.css'
import App from './App.jsx'
import Home from './views/Home.jsx'
import ProductDetails from './views/ProductDetails.jsx'
import ProductEdit from './views/ProductEdit.jsx'
import Products from './views/Products.jsx'
import Admin from './views/Admin.jsx'
import Login from './views/Login.jsx'
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { CartProvider } from './context/CartContext.jsx';

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
        path: '/products/new', 
        element: <ProductEdit /> 
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
      }
    ]
  }
]);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <CartProvider>
      <RouterProvider router={router} />
    </CartProvider>
  </StrictMode>,
)
