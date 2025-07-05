import { List, ListItem, ListItemButton, ListItemText, ListItemIcon } from '@mui/material';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import { Link } from 'react-router-dom';
import { ReactNode } from 'react';

type Item = {
  url: string;
  text: string;
  icon?: ReactNode;
};

type ListProps = {
  items: Item[];
};

const StyledList = ({ items }: ListProps) => {
  return (
    <>
      <List>
        {items.map((item) => (
          <ListItemButton
            component={Link}
            to={item.url}
            sx={{
              color: 'primary.main',
            }}
            key={item.text}
          >
            <ListItem
              sx={{
                display: 'grid',
                gridTemplateColumns: '90% 10%',
                alignItems: 'center',
                border: '1px solid',
                borderColor: 'primary.dark',
                borderRadius: '0.25rem',
                minWidth: '300px',
                padding: '0.5rem 1rem',
              }}
            >
              <ListItemText primary={item.text} />
              <ListItemIcon
                sx={{
                  color: 'primary.main',
                  marginLeft: 'auto',
                }}
              >
                {item.icon ? item.icon : <ChevronRightIcon />}
              </ListItemIcon>
            </ListItem>
          </ListItemButton>
        ))}
      </List>
    </>
  );
};

export default StyledList;
