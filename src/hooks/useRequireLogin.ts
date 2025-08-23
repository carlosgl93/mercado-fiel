import { useAuth } from '@/hooks/useAuthSupabase';
import { protectedRoutes } from '@/routes';
import { redirectToAfterLoginState } from '@/store/auth';
import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useRecoilState } from 'recoil';

export function useRequireLogin() {
  const [redirectAfterLogin, setRedirectAfterLogin] = useRecoilState(redirectToAfterLoginState);
  const { user, customer, supplier, isAuthenticated, isInitialized } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const isCustomer = !!customer?.idCliente;
  const isSupplier = !!supplier?.idProveedor;
  const isLoggedIn = isAuthenticated();

  useEffect(() => {
    // Don't run redirects until auth is initialized
    if (!isInitialized) return;

    // case where the user is logged in as a customer and tries to access the backoffice
    if (location.pathname.includes('/backoffice') && isCustomer) {
      navigate('/usuario-dashboard');
      return;
    }

    if (location.pathname.includes('/backoffice') && !isLoggedIn) {
      navigate('/backoffice/login');
      return;
    }

    // If not logged in and trying to access protected route, redirect to login
    if (!isLoggedIn && protectedRoutes?.includes(location.pathname)) {
      setRedirectAfterLogin(location.pathname);
      navigate('/ingresar');
      return;
    }

    // If supplier is logged in and tries to access login page, redirect to supplier dashboard
    if (isSupplier && location.pathname.includes('/ingresar')) {
      navigate('/prestador-dashboard');
      return;
    }

    // If customer is logged in and tries to access login page, redirect to customer dashboard
    if (isCustomer && location.pathname.includes('/ingresar')) {
      console.log('navigating to usuario dashboard');
      navigate('/usuario-dashboard');
      return;
    }

    // Chat redirects for customers
    if (!isCustomer && (location.pathname.includes('/chat') || redirectAfterLogin === '/chat')) {
      navigate('/usuario-inbox');
      return;
    }

    // Chat redirects for suppliers
    if (
      !isSupplier &&
      (location.pathname.includes('/prestador-chat') || redirectAfterLogin === '/prestador-chat')
    ) {
      navigate('/prestador-inbox');
      return;
    }

    // General protected route check
    if (
      !isCustomer &&
      !isSupplier &&
      protectedRoutes.find((route) => location.pathname.includes(route))
    ) {
      console.log('navigating to login - no auth');
      navigate('/ingresar');
      return;
    }
  }, [
    isCustomer,
    isSupplier,
    isLoggedIn,
    isInitialized,
    protectedRoutes,
    location.pathname,
    navigate,
    setRedirectAfterLogin,
    redirectAfterLogin,
  ]);
}
