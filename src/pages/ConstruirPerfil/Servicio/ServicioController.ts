import { useAuthNew } from '@/hooks';
import { useServicios } from '@/hooks/useServicios';
import { servicioState } from '@/store/construirPerfil/servicios';
import { notificationState } from '@/store/snackbar';
import { SelectChangeEvent } from '@mui/material';
import { useRecoilState, useSetRecoilState } from 'recoil';

export const serviceDurationOptions = [
  { value: 15, label: '15 minutos' },
  { value: 30, label: '30 minutos' },
  { value: 45, label: '45 minutos' },
  { value: 60, label: '1 hora' },
  { value: 120, label: '2 horas' },
  { value: 180, label: '3 horas' },
  { value: 240, label: '4 horas' },
  { value: 300, label: '5 horas' },
  { value: 360, label: '6 horas' },
  { value: 420, label: '7 horas' },
  { value: 480, label: '8 horas' },
  { value: 540, label: '9 horas' },
  { value: 600, label: '10 horas' },
  { value: 660, label: '11 horas' },
  { value: 720, label: '12 horas' },
  { value: 960, label: '16 horas' },
  { value: 1440, label: '24 horas' },
];

export const ServicioController = () => {
  const setNotification = useSetRecoilState(notificationState);
  const [servicio, setServicio] = useRecoilState(servicioState);
  const { description, especialidad, isCreatingServicio, nombreServicio, tarifa, duration } =
    servicio;
  const {
    allServicios,
    prestadorCreatedServicios,
    prestadorCreatedServiciosLoading,
    prestadorServicio,
    saveServicioLoading,
    deleteServicioLoading,
    saveServicio,
    deleteServicio,
  } = useServicios();
  const { prestador } = useAuthNew();

  const handleNombreServicioChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setServicio((prev) => ({ ...prev, nombreServicio: e.target.value }));
  };

  const handleChangeEspecialidad = (e: SelectChangeEvent<string>) => {
    setServicio((prev) => ({ ...prev, especialidad: e.target.value }));
  };

  const handleChangeDescription = (e: React.ChangeEvent<HTMLInputElement>) => {
    setServicio((prev) => ({ ...prev, description: e.target.value }));
  };

  const handleChangeTarifa = (e: React.ChangeEvent<HTMLInputElement>) => {
    setServicio((prev) => ({ ...prev, tarifa: e.target.value }));
  };

  const handleSelectDuration = (e: SelectChangeEvent<number>) => {
    setServicio((prev) => ({ ...prev, duration: Number(e.target.value) }));
  };

  const handleIsCreatingServicio = () => {
    setServicio((prev) => ({ ...prev, isCreatingServicio: !prev.isCreatingServicio }));
  };

  const handleDeleteServicio = (providerId: string, serviceId: string) => {
    deleteServicio({
      prestadorId: providerId,
      serviceId,
    });
  };

  const isTarifaFloat = tarifa.includes('.') || tarifa.includes(',');
  const isTarifaAmountEnough = Number(tarifa) < 100;

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (isTarifaFloat) {
      setNotification({
        open: true,
        message: 'Ingresa el monto sin puntos ni comas',
        severity: 'error',
      });
      return;
    }

    if (isTarifaAmountEnough) {
      setNotification({
        open: true,
        message: 'El monto minimo es 100',
        severity: 'error',
      });
      return;
    }

    const newServicio = {
      name: nombreServicio,
      description,
      speciality: especialidad,
      price: tarifa,
      duration,
    };
    saveServicio({
      prestadorId: prestador?.id,
      servicio: newServicio,
    });
  };

  return {
    prestadorCreatedServicios,
    prestadorCreatedServiciosLoading,
    prestador,
    especialidad,
    nombreServicio,
    tarifa,
    description,
    allServicios,
    prestadorServicio,
    isCreatingServicio,
    duration,
    saveServicioLoading,
    deleteServicioLoading,
    handleIsCreatingServicio,
    setServicioState: setServicio,
    handleChangeEspecialidad,
    handleNombreServicioChange,
    handleChangeDescription,
    handleChangeTarifa,
    handleSubmit,
    handleSelectDuration,
    handleDeleteServicio,
  };
};
