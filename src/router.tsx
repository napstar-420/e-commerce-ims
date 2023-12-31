import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
} from 'react-router-dom';
import Layout from './Layout/ImsLayout';
import Root from './Layout/Root';
import ErrorPage from './pages/ErrorPage';
import LoginPage from './pages/LoginPage';
import Dashboard from './pages/Dashboard';
import Orders from './pages/Orders';
import Products from './pages/Products';
import Customers from './pages/Customers';
import RequireAuth from './components/RequireAuth';

export const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<Root />} errorElement={<ErrorPage />}>
      <Route path="login" element={<LoginPage />} />

      {/* Below routes need to be protected */}
      <Route element={<RequireAuth />}>
        <Route element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="products" element={<Products />} />
          <Route path="orders" element={<Orders />} />
          <Route path="customers" element={<Customers />} />
        </Route>
      </Route>

      {/* 404 */}
      <Route path="*" element={<div>404 page not found</div>} />
    </Route>
  )
);
