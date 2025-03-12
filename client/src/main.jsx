import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import Home from './views/Home.jsx'
import ProductDetails from './views/ProductDetails.jsx'
import ProductEdit from './views/ProductEdit.jsx'
import Products from './views/Products.jsx'
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
        path: '/products/1', 
        element: <ProductDetails /> 
      },
    ]
  }
]);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
)
