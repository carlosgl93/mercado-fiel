import { useRecoilValue } from 'recoil';
import { Link } from 'react-router-dom';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import { useAuthNew } from '@/hooks/useAuthNew';
import { Avatar, Box, Divider } from '@mui/material';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';

import ListItemButton from '@mui/material/ListItemButton';
import { Prestador, prestadorState } from '@/store/auth/prestador';
import LogoutOutlinedIcon from '@mui/icons-material/LogoutOutlined';
import ChevronRightOutlinedIcon from '@mui/icons-material/ChevronRightOutlined';
import { generalOptionsDrawerList, prestadorDrawerOptions } from './prestadorDrawerOptions';
import { FlexBox } from '@/components/styled';

type PrestadorDrawerListProps = {
  closeDrawer: () => void;
};

function PrestadorDrawerList({ closeDrawer }: PrestadorDrawerListProps) {
  const { logout } = useAuthNew();

  const prestador = useRecoilValue(prestadorState) as Prestador;

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
