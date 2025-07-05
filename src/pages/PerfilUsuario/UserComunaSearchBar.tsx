import { IconButton, InputAdornment, OutlinedInput } from '@mui/material';
import { Search } from '@mui/icons-material';
import { Box } from '@mui/system';
import { useState } from 'react';
import Loading from '@/components/Loading';
import { Comuna } from '@/types/Comuna';
import { useComunas } from '@/hooks/useComunas';
import { useRecoilState } from 'recoil';
import { User, userState } from '@/store/auth/user';
import { UseFormSetValue } from 'react-hook-form';
import { IFormInput } from './PerfilUsuarioController';

type UserComunaSearchBarProps = {
  register: UseFormSetValue<IFormInput>;
};

function UserComunaSearchBar({ register }: UserComunaSearchBarProps) {
  const [comunasState, setComunasState] = useState<Comuna[]>([]);
  const [user, setUser] = useRecoilState(userState);
  const comunaName = user?.comuna?.name;

  const { allComunas } = useComunas();

  const clickComunaHandler = (c: Comuna) => {
    const textInput = document.getElementById('searchByComuna') as HTMLInputElement;
    register('comuna', c);
    setUser((prev) => ({ ...prev, comuna: c } as User));
    setComunasState(allComunas);
    textInput.value = '';
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
        sx={{
          backgroundColor: 'white',
          borderRadius: '2rem',
          mt: '1rem',
        }}
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
        placeholder={comunaName ? comunaName : 'Indicanos tu comuna'}
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
            >
              {comuna.name}
            </Box>
          ))}
      </Box>
    </>
  );
}

export default UserComunaSearchBar;
