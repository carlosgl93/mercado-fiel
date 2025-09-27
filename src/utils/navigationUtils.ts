import { AuthCustomer, AuthSupplier } from '@/types/auth';

export interface NavigationUser {
  cliente?: { idCliente: number } | null;
  proveedor?: { idProveedor: number } | null;
}

export interface NavigateToUserDashboardParams {
  pathname: string;
  user?: NavigationUser | null;
  customer?: AuthCustomer | null;
  supplier?: AuthSupplier | null;
  navigate: (path: string) => void;
}

/**
 * Navigates authenticated users to their appropriate dashboard based on user type
 * and current location. Prevents logged-in users from accessing login/registration pages.
 * 
 * @param params - Configuration object containing pathname, user data, and navigation function
 * @returns boolean - true if navigation occurred, false otherwise
 */
export const navigateToUserDashboard = ({
  pathname,
  user,
  customer,
  supplier,
  navigate,
}: NavigateToUserDashboardParams): boolean => {
  // Define paths where authenticated users should be redirected
  const authRestrictedPaths = ['/ingresar', '/registrar-usuario', '/registrar-proveedor'];
  
  // Check if current path requires redirection for authenticated users
  if (!authRestrictedPaths.includes(pathname)) {
    return false;
  }

  // Determine user type and navigate accordingly
  // Priority: direct customer/supplier props, then user object properties
  const isCustomer = customer?.idCliente || user?.cliente?.idCliente;
  const isSupplier = supplier?.idProveedor || user?.proveedor?.idProveedor;

  if (isCustomer) {
    navigate('/usuario-dashboard');
    return true;
  }

  if (isSupplier) {
    navigate('/proveedor-dashboard');
    return true;
  }

  return false;
};

/**
 * Hook-like wrapper for navigateToUserDashboard to be used in React components
 */
export const useNavigateToUserDashboard = () => {
  return navigateToUserDashboard;
};

/**
 * Gets the appropriate dashboard path for a user type
 */
export const getUserDashboardPath = (
  user?: NavigationUser | null,
  customer?: AuthCustomer | null,
  supplier?: AuthSupplier | null,
): string | null => {
  const isCustomer = customer?.idCliente || user?.cliente?.idCliente;
  const isSupplier = supplier?.idProveedor || user?.proveedor?.idProveedor;

  if (isCustomer) return '/usuario-dashboard';
  if (isSupplier) return '/proveedor-dashboard';
  
  return null;
};

/**
 * Checks if a user should be redirected from the current path
 */
export const shouldRedirectAuthenticatedUser = (
  pathname: string,
  user?: NavigationUser | null,
  customer?: AuthCustomer | null,
  supplier?: AuthSupplier | null,
): boolean => {
  console.log({ user, customer, supplier });
  const authRestrictedPaths = ['/ingresar', '/registrar-usuario', '/registrar-proveedor'];
  const isAuthenticated = customer?.idCliente || supplier?.idProveedor || 
                         user?.cliente?.idCliente || user?.proveedor?.idProveedor;
  
  return authRestrictedPaths.includes(pathname) && !!isAuthenticated;
};