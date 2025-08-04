import { Avatar, Box, Divider } from '@mui/material';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import { Link } from 'react-router-dom';
import { useRecoilValue } from 'recoil';

import { FlexBox } from '@/components/styled';
import { Prestador, proveedorState } from '@/store/auth/proveedor';
import ChevronRightOutlinedIcon from '@mui/icons-material/ChevronRightOutlined';
import LogoutOutlinedIcon from '@mui/icons-material/LogoutOutlined';
import ListItemButton from '@mui/material/ListItemButton';
import { useAuth } from '../../hooks/useAuthSupabase';
import { generalOptionsDrawerList, prestadorDrawerOptions } from './prestadorDrawerOptions';

type PrestadorDrawerListProps = {
  closeDrawer: () => void;
};

function PrestadorDrawerList({ closeDrawer }: PrestadorDrawerListProps) {
  const { signOut } = useAuth();

  const prestador = useRecoilValue(proveedorState) as Prestador;

  const { firstname, lastname, servicio, email } = prestador;

  return (
    <List
      component={'nav'}
      sx={{
        width: 250,
        // pt: (theme) => `${theme.mixins.toolbar.minHeight}px`,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
      }}
    >
      <ListItem
        sx={{
          ml: '0.5rem',
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
          {firstname && lastname ? (
            <ListItemText>{firstname + ' ' + lastname}</ListItemText>
          ) : (
            <ListItemText>{email}</ListItemText>
          )}

          <span
            style={{
              fontSize: '0.85rem',
            }}
          >
            {servicio}
          </span>
        </Box>
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
          minHeight: '35vh',
          flexDirection: 'column',
          justifyContent: 'space-evenly',
        }}
      >
        {prestadorDrawerOptions.map(({ path, title, icon: Icon }) => (
          <ListItem sx={{ p: 'auto' }} key={path}>
            <ListItemButton component={Link} to={path as string} onClick={closeDrawer}>
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
      {generalOptionsDrawerList.map((item) => {
        const { title, path } = item;
        return (
          <ListItem key={path}>
            <ListItemButton component={Link} to={path} onClick={closeDrawer}>
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
}

export default PrestadorDrawerList;
