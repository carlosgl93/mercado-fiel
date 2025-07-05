import { prestadoresGridPaginationModelState } from '@/store/backoffice/prestadores';
import { GridColDef, GridActionsCellItem, GridRowParams } from '@mui/x-data-grid';
import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined';
import DoneOutlinedIcon from '@mui/icons-material/DoneOutlined';
import { Prestador } from '@/store/auth/prestador';
import { useMutation, useQueryClient } from 'react-query';
import { useRecoilState, useSetRecoilState } from 'recoil';
import { useMemo } from 'react';
import dayjs from 'dayjs';
import { failedVerifyPrestadorMutation, verifyPrestadorMutation } from '@/api/prestadores';
import { notificationState } from '@/store/snackbar';
import { useGetPrestadores } from '@/hooks/useGetPrestadores';
import { onSuccessVerifyPrestador } from './onSuccessVerifyPrestador';
import { onSuccessFailedVerifyPrestador } from './onSuccessFailVerifyPrestador';

type PrestadoresRow = Prestador;

export const PrestadoresGridController = () => {
  const [paginationModel, setPaginationModel] = useRecoilState(prestadoresGridPaginationModelState);
  const setNotification = useSetRecoilState(notificationState);
  const client = useQueryClient();

  const {
    allPrestadores: prestadores,
    allPrestadoresLoading,
    totalPrestadores,
    isLoadingTotalPrestadores,
  } = useGetPrestadores();

  const { mutate: verifyPrestador, isLoading: isLoadingVerifyPrestador } = useMutation(
    verifyPrestadorMutation,
    {
      onSuccess: (prestador) => onSuccessVerifyPrestador(prestador, client, setNotification),
    },
  );

  const { mutate: failedVerifyPrestador, isLoading: isLoadingFailedVerifyPrestador } = useMutation(
    failedVerifyPrestadorMutation,
    {
      onSuccess: (prestador) => onSuccessFailedVerifyPrestador(prestador, client, setNotification),
    },
  );

  const columns = useMemo<GridColDef<PrestadoresRow>[]>(
    () => [
      { field: 'id', headerName: 'ID', width: 90 },
      {
        field: 'rut',
        valueGetter: (_value, row) => {
          return row.rut;
        },
        headerName: 'Rut',
        width: 150,
        editable: false,
      },
      {
        field: 'provider',
        valueGetter: (_value, row) => {
          return `${row.firstname} ${row.lastname}`;
        },
        headerName: 'Nombre',
        width: 150,
        editable: false,
      },
      {
        field: 'servicio',
        valueGetter: (_value, row) => {
          return row?.servicio;
        },
        headerName: 'Servicio',
        width: 175,
        editable: false,
      },
      {
        field: 'especialidad',
        valueGetter: (_value, row) => {
          return row?.especialidad;
        },
        headerName: 'Especialidad',
        width: 100,
        editable: false,
      },
      {
        field: 'verified',
        valueGetter: (_value, row) => {
          return row?.verified;
        },
        headerName: 'Verificación',
        width: 150,
        editable: false,
      },
      {
        field: 'createdAt',
        headerName: 'Fecha de creación',
        valueGetter: (_value, row) => {
          return dayjs(`${row.createdAt}`).format('DD/MM/YYYY HH:mm');
        },
        width: 150,
        editable: false,
      },
      {
        field: 'verifyPrestador',
        type: 'actions',
        headerName: 'Acciones',
        getActions: (params: GridRowParams) => [
          <GridActionsCellItem
            key={params.id}
            icon={<CancelOutlinedIcon sx={{ color: 'red' }} />}
            label="Rechazar"
            onClick={() => {
              handleFailedVerifyPrestador(params.row);
            }}
          />,
          <GridActionsCellItem
            key={params.id}
            icon={<DoneOutlinedIcon sx={{ color: 'green' }} />}
            label="Verificado"
            onClick={() => handleVerifyPrestador(params.row)}
          />,
        ],
      },
    ],
    [failedVerifyPrestador, verifyPrestador],
  );

  const handleVerifyPrestador = (prestador: Prestador) => {
    verifyPrestador(prestador);
  };

  const handleFailedVerifyPrestador = (prestador: Prestador) => {
    failedVerifyPrestador(prestador);
  };

  return {
    columns,
    paginationModel,
    totalPrestadores,
    rows: prestadores,
    setPaginationModel,
    allPrestadoresLoading,
    isLoadingVerifyPrestador,
    isLoadingTotalPrestadores,
    isLoadingFailedVerifyPrestador,
  };
};
