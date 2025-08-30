import { carritoApi } from '@/api';
import BackButton from '@/components/BackButton';
import { FlexBox, HeaderIconImage } from '@/components/styled';
import { ChatTitle } from '@/pages/Chat/StyledChatMensajes';
import { chatState } from '@/store/chat/chatStore';
import useSidebar from '@/store/sidebar';
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import MenuIcon from '@mui/icons-material/Menu';
import PaymentOutlinedIcon from '@mui/icons-material/PaymentOutlined';
import PeopleOutlineOutlinedIcon from '@mui/icons-material/PeopleOutlineOutlined';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import { Badge, Box, Button, Drawer, IconButton, useTheme } from '@mui/material';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import { Theme } from '@mui/material/styles';
import { styled } from '@mui/system';
import { useState } from 'react';
import { useQuery } from 'react-query';
import { Link, useNavigate } from 'react-router-dom';
import { useRecoilValue } from 'recoil';
import { useAuth } from '../../../hooks/useAuthSupabase';
import { AuthUser } from '../../../types/auth';

const DesktopHeaderContent = () => {
  const { user, signOut } = useAuth();
  const [, sidebarActions] = useSidebar();
  const chats = useRecoilValue(chatState);
  const username = chats?.username;
  const prestadorName = chats?.providerName;
  const isUserChat = location.pathname === '/chat';
  const isProviderChat = location.pathname === '/prestador-chat';
  const [isCartOpen, setIsCartOpen] = useState(false);

  // Fetch cart data for customers
  const { data: cartResponse } = useQuery({
    queryKey: ['carrito', user?.data?.cliente?.id_cliente],
    queryFn: () => carritoApi.getCartItems(user?.data?.cliente?.id_cliente || 0),
    enabled: !!user?.data?.cliente?.id_cliente,
  });

  const cartItems = cartResponse?.data?.items || [];

  const getTotalCartItems = () => {
    return cartItems.reduce((total: number, item: any) => total + item.cantidad, 0);
  };
  if (isUserChat) {
    return (
      <FlexBox
        sx={{
          alignItems: 'center',
          width: '100%',
          justifyContent: 'space-between',
        }}
      >
        <Box
          sx={{
            width: '100px',
          }}
        >
          <BackButton ignoreMargin displayText={false} />
        </Box>
        <Box
          sx={{
            width: '100%',
          }}
        >
          <ChatTitle
            sx={{
              fontSize: '1.5rem',
            }}
          >
            Chateando con{' '}
            {prestadorName
              ? prestadorName
              : user?.data?.proveedor?.nombre_negocio
              ? user?.data?.proveedor?.nombre_negocio
              : user?.data?.nombre}
          </ChatTitle>
        </Box>
      </FlexBox>
    );
  }

  if (isProviderChat) {
    return (
      <FlexBox
        sx={{
          alignItems: 'center',
          width: '100%',
          justifyContent: 'space-between',
        }}
      >
        <Box
          sx={{
            width: '100px',
          }}
        >
          <BackButton ignoreMargin displayText={false} />
        </Box>
        <Box
          sx={{
            width: '100%',
          }}
        >
          <ChatTitle
            sx={{
              fontSize: '1.5rem',
            }}
          >
            Chateando con {username}
          </ChatTitle>
        </Box>
      </FlexBox>
    );
  }

  return (
    <FlexBox sx={{ alignItems: 'center', width: '100%', justifyContent: 'space-between' }}>
      <FlexBox
        alignContent={'center'}
        sx={{
          width: '100%',
          justifyContent: 'start',
          alignItems: 'center',
        }}
      >
        <BurgerIconWithLogo user={user} toggle={sidebarActions.toggle} />
        <Button
          variant="outlined"
          sx={{
            border: 'none',
          }}
          component={Link}
          to="/"
          title="Ir a la página principal"
          aria-label="Ir a la página principal"
        >
          Mercado Fiel
        </Button>
      </FlexBox>

      {/* Navigation links for logged-in users */}
      {user?.data?.isLoggedIn &&
        (user?.data?.cliente?.id_cliente || user?.data?.proveedor?.id_proveedor) && (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            {user?.data?.cliente && (
              <>
                <Button
                  component={Link}
                  to="/explorar-productos"
                  variant="text"
                  sx={{ color: 'primary.main' }}
                >
                  Productos
                </Button>
                <Button
                  component={Link}
                  to="/mis-pedidos"
                  variant="text"
                  sx={{ color: 'primary.main' }}
                >
                  Mis Pedidos
                </Button>
              </>
            )}
            {user?.data?.proveedor && (
              <>
                <Button
                  component={Link}
                  to="/mis-productos"
                  variant="text"
                  sx={{ color: 'primary.main' }}
                >
                  Mis Productos
                </Button>
                <Button
                  component={Link}
                  to="/pedidos-recibidos"
                  variant="text"
                  sx={{ color: 'primary.main' }}
                >
                  Pedidos Recibidos
                </Button>
              </>
            )}
          </Box>
        )}

      {/* Authentication and cart buttons */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        {user?.data?.isLoggedIn &&
        (user?.data?.cliente?.id_cliente || user?.data?.proveedor?.id_proveedor) ? (
          <>
            {/* Shopping cart for customers only */}
            {user?.data?.cliente && (
              <IconButton onClick={() => setIsCartOpen(true)} sx={{ color: 'primary.main' }}>
                <Badge badgeContent={getTotalCartItems()} color="secondary">
                  <ShoppingCartIcon />
                </Badge>
              </IconButton>
            )}
            {/* Logout button for both customers and suppliers */}
            <UserHeaderContent />
          </>
        ) : (
          <UnauthenticatedHeaderContent />
        )}
      </Box>

      {/* Cart Drawer */}
      {user?.data?.cliente && (
        <Drawer anchor="right" open={isCartOpen} onClose={() => setIsCartOpen(false)}>
          {/* Cart content will be imported from ExplorarProductos components */}
          <Box sx={{ width: 400, p: 2 }}>
            <Box sx={{ textAlign: 'center', py: 4 }}>
              <ShoppingCartIcon sx={{ fontSize: 64, color: 'text.disabled' }} />
              <Box sx={{ mt: 2 }}>Carrito de compras</Box>
              <Button
                variant="contained"
                component={Link}
                to="/explorar-productos"
                onClick={() => setIsCartOpen(false)}
                sx={{ mt: 2 }}
              >
                Ver Productos
              </Button>
            </Box>
          </Box>
        </Drawer>
      )}
    </FlexBox>
  );
};

export default DesktopHeaderContent;

type BurgerIconWithLogoProps = {
  user: AuthUser | null;
  toggle: () => void;
};

const BurgerIconWithLogo = ({ user, toggle }: BurgerIconWithLogoProps) => {
  return (
    <FlexBox>
      {user?.data?.isLoggedIn &&
        (user?.data?.cliente?.id_cliente || user?.data?.proveedor?.id_proveedor) && (
          <IconButton
            onClick={toggle}
            size="large"
            edge="start"
            color="primary"
            aria-label="menu"
            sx={{ mr: 1 }}
          >
            <MenuIcon />
          </IconButton>
        )}

      <Link
        to="/"
        style={{
          display: 'flex',
          alignItems: 'center',
        }}
      >
        <HeaderIconImage src={`/images/mercadofiel.png`} alt="Mercado Fiel logo" />
      </Link>
    </FlexBox>
  );
};

const StyledListItem = styled(ListItemText)({
  cursor: 'pointer',
});

const AdminHeaderContent = () => {
  const { signOut } = useAuth();
  const theme = useTheme<Theme>();
  const navigate = useNavigate();
  return (
    <>
      <ListItem sx={{ mx: 'auto' }} onClick={() => navigate('/backoffice')}>
        <ListItemIcon>
          <HomeOutlinedIcon />
        </ListItemIcon>
        <StyledListItem>Backoffice</StyledListItem>
      </ListItem>
      <ListItem sx={{ mx: 'auto' }} onClick={() => navigate('/backoffice/prestadores')}>
        <ListItemIcon>
          <PeopleOutlineOutlinedIcon />
        </ListItemIcon>
        <StyledListItem>Prestadores</StyledListItem>
      </ListItem>
      <ListItem sx={{ mx: 'auto' }} onClick={() => navigate('/backoffice/pagos')}>
        <ListItemIcon>
          <PaymentOutlinedIcon />
        </ListItemIcon>
        <StyledListItem>Pagos</StyledListItem>
      </ListItem>
      <ListItem sx={{ mx: 'auto' }}>
        <Button
          variant="contained"
          sx={{
            '&:hover': {
              backgroundColor: theme.palette.primary.dark,
            },
          }}
          onClick={() => signOut()}
        >
          Salir
        </Button>
      </ListItem>
    </>
  );
};

const UserHeaderContent = () => {
  const theme = useTheme();
  const { signOut } = useAuth();
  return (
    <>
      <Button
        onClick={() => signOut()}
        variant="contained"
        sx={{
          backgroundColor: theme.palette.primary.main,
          color: '#FFFFFF',
          '&:hover': {
            backgroundColor: theme.palette.primary.dark,
          },
        }}
      >
        Salir
      </Button>
    </>
  );
};

const ProviderHeaderContent = () => {
  const theme = useTheme();
  const { signOut } = useAuth();
  return (
    <>
      <Button
        onClick={() => signOut()}
        variant="contained"
        sx={{
          backgroundColor: theme.palette.primary.main,
          color: '#FFFFFF',
          '&:hover': {
            backgroundColor: theme.palette.primary.dark,
          },
        }}
      >
        Salir
      </Button>
    </>
  );
};

const UnauthenticatedHeaderContent = () => {
  const theme = useTheme();

  return (
    <>
      <Button
        component={Link}
        to="/ingresar"
        variant="contained"
        sx={{
          backgroundColor: theme.palette.primary.main,
          color: '#FFFFFF',
          '&:hover': {
            backgroundColor: theme.palette.primary.dark,
          },
        }}
      >
        Ingresar
      </Button>
    </>
  );
};
