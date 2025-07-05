import { GridColDef } from '@mui/x-data-grid';
import { useRecoilState } from 'recoil';
import { useMemo } from 'react';
import { useStats } from '@/hooks/useStats';
import { usersGridPaginationModelState } from '@/store/backoffice/users';
import { useComunas } from '@/hooks';

type Row = {
  id: number;
  comuna: string;
  nUsuarios: number;
  nPrestadores: number;
  total: number;
  nUsuariosSoporteTerapeutico: number;
  nUsuariosEnfermeria: number;
  nUsuariosCuidadora: number;
  nUsuariosSanaCompania: number;
  nPrestadoresSoporteTerapeutico: number;
  nPrestadoresEnfermeria: number;
  nPrestadoresCuidadora: number;
  nPrestadoresSanaCompania: number;
};

export const UsersGridController = () => {
  const [paginationModel, setPaginationModel] = useRecoilState(usersGridPaginationModelState);

  const {
    usersCount,
    usersCountLoading,
    usersCountError,
    prestadoresCount,
    prestadoresCountLoading,
    prestadoresCountError,
    providersPerComunaCount,
    providersPerComunaCountLoading,
    providersPerComunaCountError,
    usersPerComunaCount,
    usersPerComunaCountLoading,
    usersPerComunaCountError,
  } = useStats();

  const { allComunas } = useComunas();

  const columns = useMemo<GridColDef<Row>[]>(
    () => [
      { field: 'id', headerName: 'ID', width: 10 },
      { field: 'comuna', headerName: 'Comuna', width: 75 },
      { field: 'nUsuarios', headerName: 'N° Usuarios', width: 75 },
      { field: 'nPrestadores', headerName: 'N° Prestadores', width: 75 },
      { field: 'total', headerName: 'Total', width: 75 },
      {
        field: 'nUsuariosSoporteTerapeutico',
        headerName: 'U. Soporte Terapéutico',
        width: 100,
      },
      { field: 'nUsuariosEnfermeria', headerName: 'U. Enfermería', width: 100 },
      { field: 'nUsuariosCuidadora', headerName: 'U. Cuidadora', width: 100 },
      { field: 'nUsuariosSanaCompania', headerName: 'U. Sana Compañía', width: 100 },
      {
        field: 'nPrestadoresSoporteTerapeutico',
        headerName: 'P. Soporte Terapéutico',
        width: 100,
      },
      { field: 'nPrestadoresEnfermeria', headerName: 'P. Enfermería', width: 100 },
      { field: 'nPrestadoresCuidadora', headerName: 'P. Cuidadora', width: 100 },
      { field: 'nPrestadoresSanaCompania', headerName: 'P. Sana Compañía', width: 100 },
    ],
    [],
  );

  const rows = useMemo(
    () =>
      allComunas?.map((comuna, i) => {
        const providersComuna = providersPerComunaCount?.find((p) => p.name === comuna.name);
        const usersComuna = usersPerComunaCount?.find((u) => u.name === comuna.name);
        return {
          id: i,
          comuna: comuna.name,
          nUsuarios: usersComuna?.count.total || 0,
          nPrestadores: providersComuna?.count.total || 0,
          total: (usersComuna?.count.total || 0) + (providersComuna?.count.total || 0),
          nUsuariosSoporteTerapeutico: usersComuna?.count['Soporte Terapéutico'] || 0,
          nUsuariosEnfermeria: usersComuna?.count['Servicios de enfermería'] || 0,
          nUsuariosCuidadora: usersComuna?.count['Cuidadora'] || 0,
          nUsuariosSanaCompania: usersComuna?.count['Sana Compañía'] || 0,
          nPrestadoresSoporteTerapeutico: providersComuna?.count['Soporte Terapéutico'] || 0,
          nPrestadoresEnfermeria: providersComuna?.count['Servicios de enfermería'] || 0,
          nPrestadoresCuidadora: providersComuna?.count['Cuidadora'] || 0,
          nPrestadoresSanaCompania: providersComuna?.count['Sana Compañía'] || 0,
        };
      }),
    [usersPerComunaCount, providersPerComunaCount, allComunas],
  );

  return {
    rows,
    columns,
    paginationModel,
    setPaginationModel,
    usersCount,
    usersCountLoading,
    usersCountError,
    prestadoresCount,
    prestadoresCountLoading,
    prestadoresCountError,
    providersPerComunaCount,
    providersPerComunaCountLoading,
    providersPerComunaCountError,
    usersPerComunaCount,
    usersPerComunaCountLoading,
    usersPerComunaCountError,
  };
};
