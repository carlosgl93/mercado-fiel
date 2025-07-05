import { IconButton, InputAdornment, OutlinedInput } from '@mui/material';
import { Search } from '@mui/icons-material';
import { Box } from '@mui/system';
import Loading from '@/components/Loading';
import { useComunas } from '@/hooks/useComunas';
import { Comuna } from '@/types';

type ComunasSearchBarProps = {
  handleSelectComuna: (comuna: Comuna) => void;
  matchedComunas: Comuna[];
  comunasSearched: string;
  handleChangeSearchComuna: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  placeholder?: string;
};

export function ComunasSearchBar({
  handleSelectComuna,
  matchedComunas,
  comunasSearched,
  handleChangeSearchComuna,
  placeholder,
}: ComunasSearchBarProps) {
  const { allComunas } = useComunas();

  if (allComunas && allComunas.length) {
    return (
      <>
        <OutlinedInput
          id="searchByComuna"
          type={'text'}
          value={comunasSearched}
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
          placeholder={placeholder ? placeholder : 'Indicanos tu comuna'}
          sx={{
            width: {
              xs: '100%',
              sm: '80vw',
              md: '60vw',
              lg: '50vw',
            },
            maxWidth: '100%',
            backgroundColor: 'white',
            borderRadius: '2rem',
            mt: '1rem',
          }}
          onChange={handleChangeSearchComuna}
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
          {matchedComunas?.length <= 5 &&
            matchedComunas?.map((comuna) => (
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
                onClick={() => handleSelectComuna(comuna)}
              >
                {comuna.name}
              </Box>
            ))}
        </Box>
      </>
    );
  } else {
    return <Loading />;
  }
}
