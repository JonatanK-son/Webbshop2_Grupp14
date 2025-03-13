import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './styles/index.css'
import App from './App.jsx'
import Home from './views/Home.jsx'
import ProductDetails from './views/ProductDetails.jsx'
import ProductEdit from './views/ProductEdit.jsx'
import Products from './views/Products.jsx'
import Cart from './views/Cart.jsx'
import Admin from './views/Admin.jsx'
import {createBrowserRouter, RouterProvider } from 'react-router-dom' ;

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
        path: '/cart',
        element: <Cart />
      },
      {
        path: '/admin',
        element: <Admin />
      }
    ]
  }
]);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
)
