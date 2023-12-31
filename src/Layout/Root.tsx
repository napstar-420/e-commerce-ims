import { Outlet } from 'react-router-dom';
import Alert from '../components/Alert';

export default function Root() {
  return (
    <>
      <Alert />
      <Outlet />
    </>
  );
}
