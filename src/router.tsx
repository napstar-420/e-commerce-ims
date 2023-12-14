import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
} from 'react-router-dom';
import ErrorPage from './pages/ErrorPage';
import LoginPage from './pages/LoginPage';

export const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path='/' element={<LoginPage />} errorElement={<ErrorPage />}></Route>
  )
);
