import {
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Avatar,
  Box,
  Divider,
} from '@mui/material';
import { Link } from 'react-router-dom';
import LogoutOutlinedIcon from '@mui/icons-material/LogoutOutlined';

import { generalOptionsDrawerList, usuarioDrawerOptions } from './usuarioDrawerOptions';
import ChevronRightOutlinedIcon from '@mui/icons-material/ChevronRightOutlined';
import { useAuthNew } from '@/hooks/useAuthNew';
import { User } from '@/store/auth/user';
import { FlexBox } from '@/components/styled';

type UsuarioDrawerListProps = {
  closeDrawer: () => void;
};

export const UsuarioDrawerList = ({ closeDrawer }: UsuarioDrawerListProps) => {
  const { user, logout } = useAuthNew();

  const { firstname, email, patientName, forWhom } = user as User;

  return (
    <List
      component={'nav'}
      sx={{
        width: 250,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
      }}
    >
      <ListItem
        sx={{
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'flex-start',
          paddingLeft: '1.5rem',
        }}
      >
        <Avatar />
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            ml: '1rem',
          }}
        >
          <ListItemText>{firstname ? firstname : email}</ListItemText>
          {forWhom === 'tercero' && patientName ? (
            <span
              style={{
                fontSize: '0.85rem',
              }}
            >
              Paciente: {patientName}
            </span>
          ) : null}
        </Box>
      </ListItem>
      <ListItem>
        <ListItemButton
          onClick={() => {
            logout();
            closeDrawer();
          }}
        >
          <ListItemIcon>
            <LogoutOutlinedIcon />
          </ListItemIcon>
          Salir
        </ListItemButton>
      </ListItem>

      <Divider />
      <FlexBox
        sx={{
          minHeight: '45vh',
          flexDirection: 'column',
          justifyContent: 'space-evenly',
        }}
      >
        {usuarioDrawerOptions.map(({ path, title, icon: Icon }) => (
          <ListItem sx={{ p: '0 auto' }} key={path}>
            <ListItemButton
              component={Link}
              to={path as string}
              onClick={closeDrawer}
              sx={{ py: '0' }}
            >
              {Icon && (
                <ListItemIcon>
                  <Icon />
                </ListItemIcon>
              )}

              <ListItemText>{title}</ListItemText>
            </ListItemButton>
          </ListItem>
        ))}
      </FlexBox>
      <Divider />
      <FlexBox
        sx={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          gap: '.66rem',
          mt: '1rem',
        }}
      />
      {generalOptionsDrawerList.map((item) => {
        const { title, path } = item;
        return (
          <ListItem key={path}>
            <ListItemButton component={Link} to={path} onClick={closeDrawer} sx={{ py: '0' }}>
              <ListItemText
                sx={{
                  ml: '0.5rem',
                }}
              >
                {title}
              </ListItemText>
              <ChevronRightOutlinedIcon />
            </ListItemButton>
          </ListItem>
        );
      })}
    </List>
  );
};
