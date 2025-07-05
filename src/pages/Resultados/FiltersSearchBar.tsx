import { useState } from 'react';
import { IconButton, InputAdornment, OutlinedInput, Box } from '@mui/material';
import { Search } from '@mui/icons-material';
import useRecibeApoyo from '@/store/recibeApoyo';
import { Comuna } from '@/types/Comuna';
import { useComunas } from '@/hooks/useComunas';

function FiltersSearchBar() {
  const { allComunas } = useComunas();
  const [{ comuna }, { addComuna, removeComuna }] = useRecibeApoyo();
  const [comunasState, setComunasState] = useState(allComunas);
  const [comunaInput, setComunaInput] = useState('');

  const clickComunaHandler = (_comuna: Comuna) => {
    if (comuna === _comuna) {
      removeComuna(comuna);
      setComunasState(allComunas);
    } else {
      addComuna(_comuna);
      setComunasState(allComunas);
    }
    setComunaInput('');
  };

  const onChangeHandler = (e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
    setComunaInput(e.target.value);
    const match = allComunas.filter((comuna: Comuna) => {
      if (comuna.name.toLowerCase().includes(e.target.value.toLowerCase())) {
        return comuna;
      }
    });
    setComunasState(match);
  };

  return (
    <>
      <OutlinedInput
        id="searchByComuna"
        type={'text'}
        value={comunaInput}
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
                <Search
                  sx={{
                    color: 'white',
                  }}
                />
              </Box>
            </IconButton>
          </InputAdornment>
        }
        placeholder="Comunas"
        sx={{
          width: '100%',
          backgroundColor: 'white',
          borderRadius: '2rem',
          mt: '1rem',
        }}
        onChange={onChangeHandler}
      />
      <Box
        sx={{
          backgroundColor: 'white',
          borderRadius: '5px',
          maxHeight: '10rem',
          overflow: 'auto',
        }}
      >
        {comunasState.length <= 5 &&
          comunasState.map((_comuna) => (
            <Box
              key={_comuna.id}
              sx={{
                px: '1rem',
                py: '1rem',
                borderBottom: '1px solid #ccc',
                '&:hover': {
                  backgroundColor: '#ccc',
                },
              }}
              onClick={() => clickComunaHandler(_comuna as Comuna)}
            >
              {_comuna.name}
            </Box>
          ))}
      </Box>
    </>
  );
}

export default FiltersSearchBar;
