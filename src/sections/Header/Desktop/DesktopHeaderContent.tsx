import BackButton from '@/components/BackButton';
import { FlexBox, HeaderIconImage } from '@/components/styled';
import { useAuthNew } from '@/hooks';
import { ChatTitle } from '@/pages/Chat/StyledChatMensajes';
import routes from '@/routes';
import { Prestador } from '@/store/auth/prestador';
import { User } from '@/store/auth/user';
import { chatState } from '@/store/chat/chatStore';
import useSidebar from '@/store/sidebar';
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import MenuIcon from '@mui/icons-material/Menu';
import PaymentOutlinedIcon from '@mui/icons-material/PaymentOutlined';
import PeopleOutlineOutlinedIcon from '@mui/icons-material/PeopleOutlineOutlined';
import { Box, Button, IconButton, useTheme } from '@mui/material';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import { Theme } from '@mui/material/styles';
import { styled } from '@mui/system';
import { Link, useNavigate } from 'react-router-dom';
import { useRecoilValue } from 'recoil';
import { SubTitle } from '../../../components/StyledComponents';
import { routesToExcludeInHeader } from '../routesToExcludeInHeader';

const DesktopHeaderContent = () => {
  const { user, prestador } = useAuthNew();
  const [, sidebarActions] = useSidebar();
  const chats = useRecoilValue(chatState);
  const username = chats?.username;
  const prestadorName = chats?.providerName;
  const isUserChat = location.pathname === '/chat';
  const isProviderChat = location.pathname === '/prestador-chat';

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
              : prestador?.firstname
              ? prestador?.firstname
              : prestador?.email}
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
        <BurgerIconWithLogo prestador={prestador} toggle={sidebarActions.toggle} user={user} />
        <SubTitle>Mercado Fiel</SubTitle>
      </FlexBox>
      <List
        sx={{
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'center',
        }}
      >
        {user?.role !== 'admin' &&
          Object.values(routes)
            .filter((route) => route.title)
            .map(({ path, title, icon: Icon }) =>
              routesToExcludeInHeader.includes(path) ? null : (
                <div
                  key={path}
                  style={{
                    display: 'flex',
                    justifyContent: 'center',
                  }}
                >
                  <ListItem>
                    <ListItemButton
                      component={Link}
                      to={path as string}
                      sx={{
                        backgroundColor: '#FFF',
                        '&:hover': {
                          backgroundColor: '#FFF',
                        },
                      }}
                    >
                      {Icon && (
                        <ListItemIcon>
                          <Icon />
                        </ListItemIcon>
                      )}

                      <ListItemText
                        sx={{
                          cursor: 'pointer',
                        }}
                      >
                        {title}
                      </ListItemText>
                    </ListItemButton>
                  </ListItem>
                </div>
              ),
            )}

        {user?.role === 'admin' ? (
          <AdminHeaderContent />
        ) : user?.role === 'user' ? (
          <UserHeaderContent />
        ) : prestador?.email ? (
          <ProviderHeaderContent />
        ) : (
          <UnauthenticatedHeaderContent />
        )}
      </List>
    </FlexBox>
  );
};

export default DesktopHeaderContent;

type BurgerIconWithLogoProps = {
  user: User | null;
  prestador: Prestador | null;
  toggle: () => void;
};

const BurgerIconWithLogo = ({ user, prestador, toggle }: BurgerIconWithLogoProps) => {
  return (
    <FlexBox>
      {(user?.email || prestador?.email) && (
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
  const { logout } = useAuthNew();
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
          onClick={() => logout()}
        >
          Salir
        </Button>
      </ListItem>
    </>
  );
};

const UserHeaderContent = () => {
  const theme = useTheme();
  const { logout } = useAuthNew();
  return (
    <>
      <ListItem sx={{ mx: 'auto' }}>
        <Button
          component={Link}
          to="/resultados"
          variant="contained"
          sx={{
            backgroundColor: theme.palette.secondary.main,
            color: theme.palette.primary.main,
            '&:hover': {
              backgroundColor: theme.palette.primary.main,
              color: theme.palette.secondary.main,
            },
          }}
        >
          Buscar
        </Button>
      </ListItem>
      <ListItem sx={{ mx: 'auto' }}>
        <Button
          component={Link}
          to="/usuario-dashboard"
          variant="contained"
          sx={{
            backgroundColor: theme.palette.secondary.main,
            color: theme.palette.primary.main,
            '&:hover': {
              backgroundColor: theme.palette.primary.main,
              color: theme.palette.secondary.main,
            },
          }}
        >
          Perfil
        </Button>
      </ListItem>
      <ListItem sx={{ mx: 'auto' }}>
        <Button
          onClick={() => logout()}
          variant="contained"
          sx={{
            '&:hover': {
              backgroundColor: theme.palette.primary.dark,
            },
          }}
        >
          Salir
        </Button>
      </ListItem>
    </>
  );
};

const ProviderHeaderContent = () => {
  const theme = useTheme();
  const { logout } = useAuthNew();
  return (
    <>
      <ListItem sx={{ mx: 'auto' }}>
        <Button
          component={Link}
          to="/prestador-dashboard"
          variant="contained"
          sx={{
            backgroundColor: theme.palette.secondary.main,
            color: theme.palette.primary.main,
            '&:hover': {
              backgroundColor: theme.palette.primary.main,
              color: theme.palette.secondary.main,
            },
          }}
        >
          Perfil
        </Button>
      </ListItem>
      <ListItem sx={{ mx: 'auto' }}>
        <Button
          onClick={() => logout()}
          variant="contained"
          sx={{
            '&:hover': {
              backgroundColor: theme.palette.primary.dark,
            },
          }}
        >
          Salir
        </Button>
      </ListItem>
    </>
  );
};

const UnauthenticatedHeaderContent = () => {
  const theme = useTheme();

  return (
    <>
      <ListItem sx={{ mx: 'auto' }}>
        <Button
          component={Link}
          to="/ingresar"
          variant="contained"
          sx={{
            backgroundColor: theme.palette.secondary.main,
            color: '#FFFFFF',
            '&:hover': {
              backgroundColor: theme.palette.primary.main,
              color: theme.palette.background.paper,
            },
          }}
        >
          Ingresar
        </Button>
      </ListItem>
      <ListItem sx={{ mx: 'auto' }}>
        <Button
          component={Link}
          to="/resultados"
          variant="contained"
          sx={{
            '&:hover': {
              backgroundColor: theme.palette.primary.dark,
            },
          }}
        >
          Explorar
        </Button>
      </ListItem>
      <ListItem sx={{ mx: 'auto' }}>
        <Button
          component={Link}
          to="/comienzo"
          variant="contained"
          sx={{
            '&:hover': {
              backgroundColor: theme.palette.primary.dark,
            },
          }}
        >
          Comenzar
        </Button>
      </ListItem>
    </>
  );
};
