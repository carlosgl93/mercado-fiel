import LogoutOutlinedIcon from '@mui/icons-material/LogoutOutlined';
import {
  Avatar,
  Divider,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from '@mui/material';
import { Link } from 'react-router-dom';

import { FlexBox } from '@/components/styled';
import ChevronRightOutlinedIcon from '@mui/icons-material/ChevronRightOutlined';
import { useAuth } from '../../hooks/useAuthSupabase';
import { generalOptionsDrawerList, usuarioDrawerOptions } from './usuarioDrawerOptions';

type UsuarioDrawerListProps = {
  closeDrawer: () => void;
};

export const UsuarioDrawerList = ({ closeDrawer }: UsuarioDrawerListProps) => {
  const { user, signOut } = useAuth();

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
        {/* <Box
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
        </Box> */}
      </ListItem>
      <ListItem>
        <ListItemButton
          onClick={() => {
            signOut();
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
