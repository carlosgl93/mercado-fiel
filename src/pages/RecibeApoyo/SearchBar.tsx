import { IconButton, InputAdornment, OutlinedInput } from '@mui/material';
import { Box } from '@mui/system';
import { useState } from 'react';
import Loading from '@/components/Loading';
import { Comuna } from '@/types/Comuna';
import { useComunas } from '@/hooks/useComunas';
import useRecibeApoyo from '@/store/recibeApoyo';
import { useNavigate } from 'react-router-dom';
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';

function SearchBar() {
  const [comunasState, setComunasState] = useState<Comuna[]>([]);

  const { selectedComunas, allComunas, handleSelectComuna, handleRemoveComuna } = useComunas();
  const [, { addComuna }] = useRecibeApoyo();
  const router = useNavigate();

  const clickComunaHandler = (c: Comuna) => {
    const textInput = document.getElementById('searchByComuna') as HTMLInputElement;
    if (selectedComunas.find((co) => co.id === c.id)) {
      handleRemoveComuna(c);
    } else {
      handleSelectComuna(c);
      addComuna(c);
      setComunasState(allComunas);
      textInput.value = '';
    }
  };

  const onEnterDown = (e: KeyboardEvent) => {
    if (e.code === 'Enter' && comunasState.length === 1) {
      addComuna(comunasState[0]);
      router(`/resultados`);
    }
  };

  const onChangeHandler = (e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
    const match = allComunas.filter((comuna: Comuna) => {
      if (comuna.name.toLowerCase().includes(e.target.value.toLowerCase())) {
        return comuna;
      }
    });
    setComunasState(match);
  };

  if (!allComunas) return <Loading />;
  return (
    <>
      <OutlinedInput
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
        onKeyDown={(e) => onEnterDown(e as unknown as KeyboardEvent)}
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
        {comunasState?.length <= 5 &&
          comunasState.map((comuna) => (
            <Box
              key={comuna.id}
              sx={{
                px: '1rem',
                py: '1rem',
                borderBottom: '1px solid #ccc',
                '&:hover': {
                  backgroundColor: '#ccc',
                },
              }}
              onClick={() => clickComunaHandler(comuna)}
              onKeyDown={(e) => onEnterDown(e as unknown as KeyboardEvent)}
            >
              {comuna.name}
            </Box>
          ))}
      </Box>
    </>
  );
}

export default SearchBar;
