import { List, ListItemButton, ListItemText, ListItemIcon } from '@mui/material';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import useRecibeApoyo from '@/store/recibeApoyo';
import { ForWhom } from '@/api/auth';

type ForWhomOptions = {
  value: ForWhom;
  text: string;
};

export const forWhomOptions: ForWhomOptions[] = [
  {
    value: 'paciente',
    text: 'Para mí',
  },
  {
    value: 'tercero',
    text: 'Para un amigo(a) o familiar',
  },
];

const ForWhomList = () => {
  const [{ forWhom }, { selectForWhom, increaseStep }] = useRecibeApoyo();

  const handleSelectForWhom = (whom: ForWhom) => {
    selectForWhom(whom);
    increaseStep();
  };

  return (
    <>
      <List
        sx={{
          gap: 1,
        }}
      >
        {forWhomOptions?.map((item) => {
          const alreadySelected = forWhom?.includes(item.value);
          return (
            <ListItemButton
              onClick={() => handleSelectForWhom(item.value)}
              sx={{
                color: alreadySelected ? 'secondary.main' : 'primary.main',
                display: 'grid',
                gridTemplateColumns: '90% 10%',
                alignItems: 'center',
                border: '1px solid',
                borderColor: 'primary.dark',
                borderRadius: '0.25rem',
                minWidth: '300px',
                padding: '0.5rem 1rem',
                backgroundColor: alreadySelected ? 'primary.dark' : 'white',
                ':hover': {
                  backgroundColor: alreadySelected ? 'primary.dark' : 'primary.light',
                  color: alreadySelected ? 'white' : 'primary.dark',
                },
              }}
              key={item.text}
            >
              <ListItemText primary={item.text} />
              <ListItemIcon
                sx={{
                  color: 'primary.main',
                  marginLeft: 'auto',
                }}
              >
                <ChevronRightIcon />
              </ListItemIcon>
            </ListItemButton>
          );
        })}
      </List>
    </>
  );
};

export default ForWhomList;
