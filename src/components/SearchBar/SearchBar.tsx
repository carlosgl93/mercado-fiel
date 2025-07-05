import { useState } from 'react';
import { Box } from '@mui/system';
import { useNavigate } from 'react-router-dom';
import { useComunas } from '@/hooks/useComunas';
import useRecibeApoyo from '@/store/recibeApoyo';
import { IconButton, InputAdornment, List, ListItem, OutlinedInput } from '@mui/material';
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';

type SearchBarProps = {
  routeToResultados?: boolean;
};

function SearchBar({ routeToResultados = true }: SearchBarProps) {
  const { allComunas } = useComunas();
  const [, { addComuna }] = useRecibeApoyo();
  const [comunasState, setComunasState] = useState(allComunas);
  const router = useNavigate();

  const onChangeHandler = (e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
    const match = allComunas.filter((comuna) => {
      if (comuna.name.toLowerCase().includes(e.target.value.toLowerCase())) {
        return comuna;
      }
    });
    if (match.length > 0) {
      addComuna(match[0]);
      setComunasState(match);
    }
  };

  const onEnterDown = (e: KeyboardEvent) => {
    if (e.code === 'Enter' && comunasState.length === 1) {
      addComuna(comunasState[0]);
      if (!routeToResultados) return;
      router(`/resultados`);
    }
  };

  const clickComunaHandler = () => {
    setComunasState(allComunas);
    if (!routeToResultados) {
      return;
    }
    router(`/resultados`);
  };

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
            xs: '100%',
            sm: '100%',
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

      {comunasState?.length > 0 && comunasState?.length <= 1 && (
        <List
          sx={{
            width: {
              xs: '100%',
              sm: '100%',
              md: '60vw',
              lg: '50vw',
            },
            backgroundColor: 'white',
            borderRadius: '5px',
            maxHeight: '10rem',
            overflow: 'auto',
          }}
        >
          {comunasState?.map((comuna) => {
            const { name, id } = comuna;
            return (
              <ListItem
                value={name}
                defaultValue={name}
                key={id}
                onClick={clickComunaHandler}
                onKeyDown={(e) => onEnterDown(e as unknown as KeyboardEvent)}
                sx={{
                  display: 'flex',
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  margin: '0.5rem',
                  padding: 'auto',
                  cursor: 'pointer',
                  width: '80%',
                }}
              >
                {name}
              </ListItem>
            );
          })}
        </List>
      )}
    </>
  );
}

export default SearchBar;
