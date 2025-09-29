import { Customer } from '@/models/Customer';
import { createTheme } from '@mui/material';
import { ThemeProvider } from '@mui/material/styles';
import '@testing-library/jest-dom';
import { fireEvent, render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { MobileResultsListCustomer } from '../MobileResultsListCustomer';

// Mock components
jest.mock('@/components/Reviews', () => {
  return function Reviews({ average, total_reviews }: { average: number; total_reviews: number }) {
    return <div data-testid="reviews">{`${average} stars, ${total_reviews} reviews`}</div>;
  };
});

const theme = createTheme();

const mockCustomer: Customer = {
  idCliente: 1,
  idUsuario: 1,
  idDireccion: null,
  telefono: '+56912345678',
  fechaRegistro: '2024-01-01T00:00:00Z',
  createdAt: '2024-01-01T00:00:00Z',
  updatedAt: '2024-01-01T00:00:00Z',
  activo: true,
  profilePictureUrl: 'https://example.com/avatar.jpg',
  usuario: {
    idUsuario: 1,
    nombre: 'Juan Pérez',
    email: 'juan@example.com',
    contrasenaHash: 'hashed_password',
    fechaRegistro: '2024-01-01T00:00:00Z',
    activo: true,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
    profilePictureUrl: 'https://example.com/avatar.jpg',
    idPlan: null,
  },
};

const mockSetPage = jest.fn();
const mockSetLimit = jest.fn();

const renderWithProviders = (customers: Customer[]) => {
  return render(
    <BrowserRouter>
      <ThemeProvider theme={theme}>
        <MobileResultsListCustomer
          customers={customers}
          setPage={mockSetPage}
          setLimit={mockSetLimit}
        />
      </ThemeProvider>
    </BrowserRouter>
  );
};

describe('MobileResultsListCustomer', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render empty state when no customers provided', () => {
    renderWithProviders([]);
    
    expect(screen.getByText('No hay clientes para mostrar con estos filtros.')).toBeInTheDocument();
  });

  it('should render customer list when customers are provided', () => {
    renderWithProviders([mockCustomer]);
    
    expect(screen.getByText('Juan Pérez')).toBeInTheDocument();
    expect(screen.getByTestId('reviews')).toBeInTheDocument();
    expect(screen.getByText('Ver perfil')).toBeInTheDocument();
  });

  it('should render multiple customers', () => {
    const customers = [
      mockCustomer,
      {
        ...mockCustomer,
        idCliente: 2,
        idUsuario: 2,
        usuario: {
          ...mockCustomer.usuario,
          idUsuario: 2,
          nombre: 'María García',
        },
      },
    ];
    
    renderWithProviders(customers);
    
    expect(screen.getByText('Juan Pérez')).toBeInTheDocument();
    expect(screen.getByText('María García')).toBeInTheDocument();
  });

  it('should call pagination functions when load more is clicked', () => {
    renderWithProviders([mockCustomer]);
    
    const loadMoreButton = screen.getByText('Cargar más resultados');
    fireEvent.click(loadMoreButton);
    
    expect(mockSetPage).toHaveBeenCalledWith(expect.any(Function));
    expect(mockSetLimit).toHaveBeenCalledWith(expect.any(Function));
  });

  it('should not render customer without usuario', () => {
    const customerWithoutUser = {
      ...mockCustomer,
      usuario: null as any,
    };
    
    renderWithProviders([customerWithoutUser]);
    
    expect(screen.queryByText('Juan Pérez')).not.toBeInTheDocument();
  });

  it('should generate correct link to customer profile', () => {
    renderWithProviders([mockCustomer]);
    
    const link = screen.getByRole('link');
    expect(link).toHaveAttribute('href', '/perfil-cliente/1');
  });

  it('should display customer avatar', () => {
    renderWithProviders([mockCustomer]);
    
    const avatar = screen.getByRole('img');
    expect(avatar).toHaveAttribute('src', 'https://example.com/avatar.jpg');
  });


});