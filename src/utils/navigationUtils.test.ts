import {
  getUserDashboardPath,
  navigateToUserDashboard,
  shouldRedirectAuthenticatedUser,
  type NavigateToUserDashboardParams,
  type NavigationUser,
} from '@/utils/navigationUtils';
import { beforeEach, describe, expect, it, vi } from 'vitest';

describe('navigationUtils', () => {
  const mockNavigate = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('navigateToUserDashboard', () => {
    it('should navigate customer to usuario-dashboard from login page', () => {
      const customer = { idCliente: 123 } as any;

      const params: NavigateToUserDashboardParams = {
        pathname: '/ingresar',
        customer,
        navigate: mockNavigate,
      };

      const result = navigateToUserDashboard(params);

      expect(result).toBe(true);
      expect(mockNavigate).toHaveBeenCalledWith('/usuario-dashboard');
    });

    it('should navigate supplier to proveedor-dashboard from login page', () => {
      const supplier = { idProveedor: 456 } as any;

      const params: NavigateToUserDashboardParams = {
        pathname: '/ingresar',
        supplier,
        navigate: mockNavigate,
      };

      const result = navigateToUserDashboard(params);

      expect(result).toBe(true);
      expect(mockNavigate).toHaveBeenCalledWith('/proveedor-dashboard');
    });

    it('should navigate customer from registrar-usuario page', () => {
      const customer = { idCliente: 123 } as any;

      const params: NavigateToUserDashboardParams = {
        pathname: '/registrar-usuario',
        customer,
        navigate: mockNavigate,
      };

      const result = navigateToUserDashboard(params);

      expect(result).toBe(true);
      expect(mockNavigate).toHaveBeenCalledWith('/usuario-dashboard');
    });

    it('should navigate supplier from registrar-prestador page', () => {
      const supplier = { idProveedor: 456 } as any;

      const params: NavigateToUserDashboardParams = {
        pathname: '/registrar-prestador',
        supplier,
        navigate: mockNavigate,
      };

      const result = navigateToUserDashboard(params);

      expect(result).toBe(true);
      expect(mockNavigate).toHaveBeenCalledWith('/proveedor-dashboard');
    });

    it('should use user object properties when direct props are not provided', () => {
      const user: NavigationUser = {
        cliente: { idCliente: 123 },
      };

      const params: NavigateToUserDashboardParams = {
        pathname: '/ingresar',
        user,
        navigate: mockNavigate,
      };

      const result = navigateToUserDashboard(params);

      expect(result).toBe(true);
      expect(mockNavigate).toHaveBeenCalledWith('/usuario-dashboard');
    });

    it('should prioritize direct customer prop over user object', () => {
      const customer = { idCliente: 123 } as any;
      const user: NavigationUser = {
        proveedor: { idProveedor: 456 },
      };

      const params: NavigateToUserDashboardParams = {
        pathname: '/ingresar',
        user,
        customer,
        navigate: mockNavigate,
      };

      const result = navigateToUserDashboard(params);

      expect(result).toBe(true);
      expect(mockNavigate).toHaveBeenCalledWith('/usuario-dashboard');
    });

    it('should not navigate from non-restricted paths', () => {
      const customer = { idCliente: 123 } as any;

      const params: NavigateToUserDashboardParams = {
        pathname: '/some-other-page',
        customer,
        navigate: mockNavigate,
      };

      const result = navigateToUserDashboard(params);

      expect(result).toBe(false);
      expect(mockNavigate).not.toHaveBeenCalled();
    });

    it('should not navigate when user is not authenticated', () => {
      const params: NavigateToUserDashboardParams = {
        pathname: '/ingresar',
        navigate: mockNavigate,
      };

      const result = navigateToUserDashboard(params);

      expect(result).toBe(false);
      expect(mockNavigate).not.toHaveBeenCalled();
    });

    it('should handle customer priority over supplier when both are provided', () => {
      const customer = { idCliente: 123 } as any;
      const supplier = { idProveedor: 456 } as any;

      const params: NavigateToUserDashboardParams = {
        pathname: '/ingresar',
        customer,
        supplier,
        navigate: mockNavigate,
      };

      const result = navigateToUserDashboard(params);

      expect(result).toBe(true);
      // Should navigate to customer dashboard as it's checked first
      expect(mockNavigate).toHaveBeenCalledWith('/usuario-dashboard');
    });

    it('should handle all restricted paths', () => {
      const customer = { idCliente: 123 } as any;
      const restrictedPaths = ['/ingresar', '/registrar-usuario', '/registrar-prestador'];

      restrictedPaths.forEach((pathname) => {
        mockNavigate.mockClear();
        
        const params: NavigateToUserDashboardParams = {
          pathname,
          customer,
          navigate: mockNavigate,
        };

        const result = navigateToUserDashboard(params);

        expect(result).toBe(true);
        expect(mockNavigate).toHaveBeenCalledWith('/usuario-dashboard');
      });
    });
  });

  describe('getUserDashboardPath', () => {
    it('should return customer dashboard path for customer', () => {
      const customer = { idCliente: 123 } as any;
      const result = getUserDashboardPath(undefined, customer);
      expect(result).toBe('/usuario-dashboard');
    });

    it('should return supplier dashboard path for supplier', () => {
      const supplier = { idProveedor: 456 } as any;
      const result = getUserDashboardPath(undefined, undefined, supplier);
      expect(result).toBe('/proveedor-dashboard');
    });

    it('should return customer path from user object', () => {
      const user: NavigationUser = {
        cliente: { idCliente: 123 },
      };
      const result = getUserDashboardPath(user);
      expect(result).toBe('/usuario-dashboard');
    });

    it('should return supplier path from user object', () => {
      const user: NavigationUser = {
        proveedor: { idProveedor: 456 },
      };
      const result = getUserDashboardPath(user);
      expect(result).toBe('/proveedor-dashboard');
    });

    it('should return null for unauthenticated user', () => {
      const result = getUserDashboardPath();
      expect(result).toBe(null);
    });
  });

  describe('shouldRedirectAuthenticatedUser', () => {
    it('should return true for authenticated customer on restricted path', () => {
      const customer = { idCliente: 123 } as any;
      const result = shouldRedirectAuthenticatedUser('/ingresar', undefined, customer);
      expect(result).toBe(true);
    });

    it('should return true for authenticated supplier on restricted path', () => {
      const supplier = { idProveedor: 456 } as any;
      const result = shouldRedirectAuthenticatedUser('/registrar-prestador', undefined, undefined, supplier);
      expect(result).toBe(true);
    });

    it('should return false for authenticated user on non-restricted path', () => {
      const customer = { idCliente: 123 } as any;
      const result = shouldRedirectAuthenticatedUser('/dashboard', undefined, customer);
      expect(result).toBe(false);
    });

    it('should return false for unauthenticated user on restricted path', () => {
      const result = shouldRedirectAuthenticatedUser('/ingresar');
      expect(result).toBe(false);
    });

    it('should return true for user object with client data on restricted path', () => {
      const user: NavigationUser = {
        cliente: { idCliente: 123 },
      };
      const result = shouldRedirectAuthenticatedUser('/ingresar', user);
      expect(result).toBe(true);
    });

    it('should return true for user object with supplier data on restricted path', () => {
      const user: NavigationUser = {
        proveedor: { idProveedor: 456 },
      };
      const result = shouldRedirectAuthenticatedUser('/registrar-prestador', user);
      expect(result).toBe(true);
    });
  });
});