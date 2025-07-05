import { IconButton, InputAdornment, List, ListItem, OutlinedInput } from '@mui/material';

import { Box } from '@mui/system';
import { useState } from 'react';
import useEntregaApoyo from '@/store/entregaApoyo';
import { Comuna } from '@/types/Comuna';
import { useComunas } from '@/hooks/useComunas';
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';

function SearchBar() {
  const [{ selectedComunas }, { addComuna, removeComuna }] = useEntregaApoyo();
  const { allComunas } = useComunas();
  const [comunaBuscada, setComunaBuscada] = useState('');
  const [comunasState, setComunasState] = useState(allComunas || []);

  const clickComunaHandler = (comuna: Comuna) => {
    if (selectedComunas?.includes(comuna)) {
      removeComuna(comuna);
    } else {
      setComunasState(allComunas || []);
      addComuna(comuna);
      setComunaBuscada('');
    }
  };

  const onChangeHandler = (e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
    setComunaBuscada(e.target.value);
    const match = allComunas?.filter((comuna) => {
      if (comuna.name.toLowerCase().includes(comunaBuscada.toLowerCase())) {
        return comuna;
      }
    });
    if (match) {
      setComunasState(match);
    }
  };

  if (allComunas && allComunas.length) {
    return (
      <>
        <OutlinedInput
          value={comunaBuscada}
          id="searchByComuna"
          type={'text'}
          endAdornment={
            <InputAdornment position="end">
              <IconButton aria-label="buscar por comuna" edge="end">
                <Box
                  sx={{
                    backgroundColor: 'primary.main',
                    borderRadius: '3rem',
                    height: '2.5rem',
                    width: '2.5rem',
                    padding: '0.25rem',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}
                >
                  <SearchOutlinedIcon
                    sx={{
                      color: 'white',
                    }}
                  />
                </Box>
              </IconButton>
            </InputAdornment>
          }
          placeholder="Indicanos tu comuna"
          sx={{
            width: {
              xs: '80%',
              sm: '80vw',
              md: '60vw',
              lg: '50vw',
            },

            backgroundColor: 'white',
            borderRadius: '2rem',
            mt: '1rem',
          }}
          onChange={onChangeHandler}
        />
        <Box
          sx={{
            width: {
              xs: '80%',
              sm: '80vw',
              md: '60vw',
              lg: '50vw',
            },
            backgroundColor: 'white',
            borderRadius: '5px',
            maxHeight: '10rem',
            overflow: 'auto',
          }}
        >
          {comunasState.length <= 5 && (
            <List>
              {comunasState?.length <= 5 &&
                comunasState?.map((comuna) => (
                  <ListItem
                    title={comuna.name}
                    key={comuna.id}
                    sx={{
                      px: '1rem',
                      py: '1rem',
                      borderBottom: '1px solid #ccc',
                      '&:hover': {
                        backgroundColor: '#ccc',
                      },
                      cursor: 'pointer',
                    }}
                    onClick={() => clickComunaHandler(comuna)}
                  >
                    {comuna.name}
                  </ListItem>
                ))}
            </List>
          )}
        </Box>
      </>
    );
  } else {
    return <></>;
  }
}

export default SearchBar;
