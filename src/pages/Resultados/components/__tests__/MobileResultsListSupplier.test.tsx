import { Supplier } from '@/types/supplier';
import { createTheme } from '@mui/material';
import { ThemeProvider } from '@mui/material/styles';
import '@testing-library/jest-dom';
import { fireEvent, render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { MobileResultsListSupplier } from '../MobileResultsListSupplier';

// Mock components
jest.mock('@/components/Reviews', () => {
  return function Reviews({ average, total_reviews }: { average: number; total_reviews: number }) {
    return <div data-testid="reviews">{`${average} stars, ${total_reviews} reviews`}</div>;
  };
});

const theme = createTheme();

const mockSupplier: Supplier = {
  idProveedor: 1,
  idUsuario: 1,
  nombreNegocio: 'Negocio Test',
  descripcion: 'Un negocio de prueba',
  telefonoContacto: '+56912345678',
  idDireccion: 1,
  latitud: -33.4489,
  longitud: -70.6693,
  destacado: false,
  email: 'contacto@negocio.com',
  radioEntregaKm: 10,
  cobraEnvio: true,
  envioGratisDesde: 50000,
  createdAt: new Date('2024-01-01T00:00:00Z'),
  updatedAt: new Date('2024-01-01T00:00:00Z'),
  usuario: {
    idUsuario: 1,
    nombre: 'Juan Pérez',
    email: 'juan@example.com',
    profilePictureUrl: 'https://example.com/avatar.jpg',
  },
  direccion: {
    idDireccion: 1,
    calle: 'Calle Test',
    numero: '123',
    departamento: '4B',
    idComuna: 1,
    idRegion: 1,
    codigoPostal: '7500000',
    referencia: 'Casa azul',
    direccionCompleta: 'Calle Test 123, 4B',
  },
};

const mockSetPage = jest.fn();
const mockSetLimit = jest.fn();

const renderWithProviders = (suppliers: Supplier[]) => {
  return render(
    <BrowserRouter>
      <ThemeProvider theme={theme}>
        <MobileResultsListSupplier
          suppliers={suppliers}
          setPage={mockSetPage}
          setLimit={mockSetLimit}
        />
      </ThemeProvider>
    </BrowserRouter>
  );
};

describe('MobileResultsListSupplier', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render empty state when no suppliers provided', () => {
    renderWithProviders([]);
    
    expect(screen.getByText('No hay proveedores para mostrar con estos filtros.')).toBeInTheDocument();
  });

  it('should render supplier list when suppliers are provided', () => {
    renderWithProviders([mockSupplier]);
    
    expect(screen.getByText('Negocio Test')).toBeInTheDocument();
    expect(screen.getByTestId('reviews')).toBeInTheDocument();
    expect(screen.getByText('Ver perfil')).toBeInTheDocument();
  });

  it('should render multiple suppliers', () => {
    const suppliers: Supplier[] = [
      mockSupplier,
      {
        ...mockSupplier,
        idProveedor: 2,
        idUsuario: 2,
        nombreNegocio: 'Otro Negocio',
        usuario: {
          idUsuario: 2,
          nombre: 'María García',
          email: 'maria@example.com',
          profilePictureUrl: 'https://example.com/avatar2.jpg',
        },
      },
    ];
    
    renderWithProviders(suppliers);
    
    expect(screen.getByText('Negocio Test')).toBeInTheDocument();
    expect(screen.getByText('Otro Negocio')).toBeInTheDocument();
  });

  it('should call pagination functions when load more is clicked', () => {
    renderWithProviders([mockSupplier]);
    
    const loadMoreButton = screen.getByText('Cargar más resultados');
    fireEvent.click(loadMoreButton);
    
    expect(mockSetPage).toHaveBeenCalledWith(expect.any(Function));
    expect(mockSetLimit).toHaveBeenCalledWith(expect.any(Function));
  });

  it('should not render supplier without usuario', () => {
    const supplierWithoutUser = {
      ...mockSupplier,
      usuario: undefined,
    };
    
    renderWithProviders([supplierWithoutUser]);
    
    expect(screen.queryByText('Negocio Test')).not.toBeInTheDocument();
  });

  it('should generate correct link to supplier profile', () => {
    renderWithProviders([mockSupplier]);
    
    const link = screen.getByRole('link');
    expect(link).toHaveAttribute('href', '/perfil-proveedor/1');
  });

  it('should display supplier avatar', () => {
    renderWithProviders([mockSupplier]);
    
    const avatar = screen.getByRole('img');
    expect(avatar).toHaveAttribute('src', 'https://example.com/avatar.jpg');
  });



  it('should display business name when available', () => {
    renderWithProviders([mockSupplier]);
    
    expect(screen.getByText('Negocio Test')).toBeInTheDocument();
  });

  it('should fallback to user name when business name is not available', () => {
    const supplierWithoutBusinessName = {
      ...mockSupplier,
      nombreNegocio: '',
    };
    
    renderWithProviders([supplierWithoutBusinessName]);
    
    expect(screen.getByText('Juan Pérez')).toBeInTheDocument();
  });
});