import { InputAdornment, IconButton, Box, TextField, CircularProgress } from '@mui/material';
import useRecibeApoyo from '@/store/recibeApoyo';
import { Search } from '@mui/icons-material';
import { SearchBarIcon, StyledComunaSearchBar, StyledResults } from './StyledRegistrarUsuario';
import { useComunas } from '@/hooks/useComunas';
import { Comuna } from '@/types';

type ComunaSearchbarProps = {
  isTablet: boolean;
};

export const ComunaSearchbar = ({ isTablet }: ComunaSearchbarProps) => {
  const {
    allComunas,
    setComunasSearched,
    matchedComunas,
    setMatchedComunas,
    handleChangeSearchComuna,
  } = useComunas();
  const [{ comuna }, { addComuna, removeComuna }] = useRecibeApoyo();

  const clickComunaHandler = (_comuna: Comuna) => {
    if (comuna === _comuna) {
      removeComuna(comuna);
      setComunasSearched('');
      setMatchedComunas(allComunas);
    } else {
      addComuna(_comuna);
      setMatchedComunas(allComunas);
    }
  };

  if (!allComunas) return <CircularProgress />;

  if (comuna == null) {
    return (
      <>
        <StyledComunaSearchBar
          sx={{
            width: isTablet ? '225px' : '465px',
          }}
          id="searchByComuna"
          type={'text'}
          endAdornment={
            <InputAdornment position="end">
              <IconButton aria-label="buscar por comuna" edge="end">
                <SearchBarIcon>
                  <Search
                    sx={{
                      color: 'white',
                    }}
                  />
                </SearchBarIcon>
              </IconButton>
            </InputAdornment>
          }
          placeholder="Indicanos la comuna donde necesitas apoyo"
          onChange={handleChangeSearchComuna}
        />
        <StyledResults>
          {matchedComunas?.length <= 5 &&
            matchedComunas?.map((_comuna) => (
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
        </StyledResults>
      </>
    );
  } else {
    return (
      <TextField
        label={'Comuna seleccionada'}
        name={'comuna'}
        variant="outlined"
        type={'text'}
        onClick={() => removeComuna(comuna)}
        value={comuna.name}
        sx={{
          m: {
            xs: 1,
            sm: 2,
            md: 3,
          },
        }}
      />
    );
  }
};
