import { Servicio } from '@/types/Servicio';
import { services } from '../utils/services';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { getPrestadorCreatedServices } from '@/api/servicios/getPrestadorCreatedServices';
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';
import { notificationState } from '@/store/snackbar';
import {
  savePrestadorCreatedService,
  SavePrestadorCreatedServiceParams,
} from '../api/servicios/savePrestadorCreatedService';
import { servicioState } from '@/store/construirPerfil/servicios';
import { interactedPrestadorState } from '@/store/resultados/interactedPrestador';
import { defaultPrestador, Prestador, prestadorState } from '@/store/auth/prestador';
import { UserCreatedServicio } from '@/pages/ConstruirPerfil/Servicio/types';
import { deleteService, DeleteServiceParams } from '../api/servicios/deleteService';
import SupportOutlinedIcon from '@mui/icons-material/SupportOutlined';

export const useServicios = () => {
  const setNotification = useSetRecoilState(notificationState);
  const setServicioState = useSetRecoilState(servicioState);
  const [prestador, setPrestadorState] = useRecoilState(prestadorState);
  const allServicios: Servicio[] = services;
  const interactedPrestador = useRecoilValue(interactedPrestadorState);
  const prestadorServicio = allServicios.find((s) => s.serviceName === prestador?.servicio);

  const queryClient = useQueryClient();
  const { data: prestadorCreatedServicios, isLoading: prestadorCreatedServiciosLoading } = useQuery<
    UserCreatedServicio[]
  >(
    'prestadorCreatedServices',
    () => getPrestadorCreatedServices(prestador?.id ? prestador.id : interactedPrestador?.id ?? ''),
    {
      enabled: !!prestador?.id || !!interactedPrestador?.id,
      onError: () => {
        setNotification({
          open: true,
          message:
            'Error al cargar servicios, comprueba tu conexión a internet y recarga la página.',
          severity: 'error',
        });
      },
    },
  );

  const { mutate: saveServicio, isLoading: saveServicioLoading } = useMutation(
    (data: SavePrestadorCreatedServiceParams) => savePrestadorCreatedService(data),
    {
      onSuccess: () => {
        setNotification({
          open: true,
          message: 'Servicio guardado exitosamente',
          severity: 'success',
        });
        queryClient.refetchQueries(['prestadorCreatedServices']);
        setPrestadorState((prev) => {
          if (prev === null) return defaultPrestador as Prestador;
          return {
            ...prev,
            settings: {
              ...prev?.settings,
              servicios: true,
            },
          };
        });
        setServicioState((prev) => ({
          ...prev,
          isCreatingServicio: false,
          description: '',
          especialidad: '',
          nombreServicio: '',
          tarifa: '',
          duration: 0,
        }));
      },
      onError: () => {
        setNotification({
          open: true,
          message: 'Hubo un error guardando el servicio, intentalo nuevamente',
          severity: 'error',
        });
      },
    },
  );

  // add a react query mutation to delete a servicio
  const { mutate: deleteServicio, isLoading: deleteServicioLoading } = useMutation(
    (data: DeleteServiceParams) => deleteService(data),
    {
      onSuccess: () => {
        queryClient.refetchQueries(['prestadorCreatedServices']);
        setNotification({
          open: true,
          message: 'Servicio eliminado exitosamente',
          severity: 'success',
        });
        setServicioState((prev) => ({
          ...prev,
          isCreatingServicio: false,
          description: '',
          especialidad: '',
          nombreServicio: '',
          tarifa: '',
          duration: 0,
        }));
      },
      onError: () => {
        setNotification({
          open: true,
          message: 'Hubo un error eliminando el servicio, intentalo nuevamente',
          severity: 'error',
        });
      },
    },
  );

  const getServiceIcon = (serviceName: string) => {
    const servicio = allServicios.find((s) => s.serviceName === serviceName);
    if (servicio) {
      return servicio.icon;
    } else {
      return SupportOutlinedIcon;
    }
  };

  return {
    prestadorCreatedServiciosLoading,
    allServicios,
    prestadorServicio,
    prestadorCreatedServicios,
    saveServicioLoading,
    deleteServicioLoading,
    saveServicio,
    deleteServicio,
    getServiceIcon,
  };
};
