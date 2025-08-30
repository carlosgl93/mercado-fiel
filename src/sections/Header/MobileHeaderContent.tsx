import MenuIcon from '@mui/icons-material/Menu';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import { Badge, Button, Drawer, IconButton, useTheme } from '@mui/material';
import { useState } from 'react';
import { useQuery } from 'react-query';
import { Link, useLocation } from 'react-router-dom';

import { carritoApi } from '@/api/carrito';
import BackButton from '@/components/BackButton';
import { FlexBox, HeaderIconImage } from '@/components/styled';
import { ChatTitle } from '@/pages/Chat/StyledChatMensajes';
import { chatState } from '@/store/chat/chatStore';
import { interactedProveedorState } from '@/store/resultados/interactedPrestador';
import useSidebar from '@/store/sidebar';
import { Box, styled } from '@mui/material';
import { useRecoilValue } from 'recoil';
import { SubTitle } from '../../components/StyledComponents';
import { useAuth } from '../../hooks/useAuthSupabase';

const MobileHeaderContent = () => {
  const [, sidebarActions] = useSidebar();
  const location = useLocation();
  const prestador = useRecoilValue(interactedProveedorState);
  const chats = useRecoilValue(chatState);
  const { customer, supplier, signOut, user } = useAuth();
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

  console.log({ user, customer, supplier });
  const theme = useTheme();
  const username = chats?.username;
  const prestadorName = chats?.providerName;
  const isUserChat = location.pathname === '/chat';
  const isProviderChat = location.pathname === '/prestador-chat';

  if (isUserChat) {
    return (
      <StyledChatHeaderContainer>
        <BackButton ignoreMargin displayText={false} />
        <ChatTitle>
          {prestadorName
            ? prestadorName
            : prestador?.firstname
            ? prestador?.firstname
            : prestador?.email}
        </ChatTitle>
      </StyledChatHeaderContainer>
    );
  }

  if (isProviderChat) {
    return (
      <StyledChatHeaderContainer>
        <BackButton ignoreMargin displayText={false} />
        <ChatTitle>{username}</ChatTitle>
      </StyledChatHeaderContainer>
    );
  }

  return (
    <FlexBox
      sx={{
        alignItems: 'center',
        justifyContent: 'space-between',
        width: '100%',
      }}
    >
      <FlexBox sx={{ alignItems: 'center', justifyContent: 'start', flex: 1 }}>
        <IconButton
          onClick={sidebarActions.toggle}
          size="large"
          edge="start"
          color="primary"
          aria-label="menu"
          sx={{
            mr: 1,
          }}
        >
          <MenuIcon />
        </IconButton>
        <Link
          to="/"
          style={{
            display: 'flex',
            alignItems: 'center',
          }}
        >
          <HeaderIconImage src={`/images/mercadofiel.png`} alt="Mercado Fiel logo" />
        </Link>
        <SubTitle
          sx={{
            fontSize: '1rem',
            p: 1,
            borderRadius: '8px',
          }}
        >
          Mercado Fiel
        </SubTitle>
      </FlexBox>

      {/* Right side - Cart for customers, Logout for suppliers, or Login for unauthenticated */}
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        {user?.data?.isLoggedIn &&
        (user?.data?.cliente?.id_cliente || user?.data?.proveedor?.id_proveedor) ? (
          // For logged-in users
          user?.data?.cliente ? (
            // Show cart for customers
            <IconButton onClick={() => setIsCartOpen(true)} sx={{ color: 'primary.main', mr: 1 }}>
              <Badge badgeContent={getTotalCartItems()} color="secondary">
                <ShoppingCartIcon />
              </Badge>
            </IconButton>
          ) : (
            // Show logout for suppliers
            <Button
              onClick={() => signOut()}
              variant="contained"
              size="small"
              sx={{
                backgroundColor: theme.palette.primary.main,
                color: '#FFFFFF',
                '&:hover': {
                  backgroundColor: theme.palette.primary.dark,
                },
                mr: '1rem',
              }}
            >
              Salir
            </Button>
          )
        ) : (
          // For unauthenticated users, show "Ingresar" button
          <Button
            component={Link}
            to="/ingresar"
            variant="contained"
            size="small"
            sx={{
              backgroundColor: theme.palette.primary.main,
              color: '#FFFFFF',
              '&:hover': {
                backgroundColor: theme.palette.primary.dark,
              },
              mr: '1rem',
            }}
          >
            Ingresar
          </Button>
        )}
      </Box>

      {/* Cart Drawer */}
      {user?.data?.cliente && (
        <Drawer anchor="right" open={isCartOpen} onClose={() => setIsCartOpen(false)}>
          <Box sx={{ width: 300, p: 2 }}>
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

export default MobileHeaderContent;

const StyledChatHeaderContainer = styled(Box)(({ theme }) => ({
  display: 'grid',
  gridTemplateColumns: '20% 75%',
  gridColumnGap: theme.spacing(4),
  height: theme.spacing(10),
  width: '100%',
  alignItems: 'center',
  justifyContent: 'space-around',
}));
