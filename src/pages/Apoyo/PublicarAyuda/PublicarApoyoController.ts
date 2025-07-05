import { useAuthNew, useComunas } from '@/hooks';
import { useCallback, useEffect, useState } from 'react';
import { useMutation } from 'react-query';
import { addSupportRequest, Apoyo } from '@/api/supportRequests';
import { useSetRecoilState } from 'recoil';
import { notificationState } from '@/store/snackbar';
import { useServicios } from '@/hooks/useServicios';
import { useNavigate } from 'react-router-dom';
import { Dayjs } from 'dayjs';
import { Recurrency } from '@/utils/getRecurrencyText';
import { Patient } from '@/pages/RegistrarUsuario/RegistrarUsuarioController';
import { SelectChangeEvent } from '@mui/material';

export const PublicarApoyoController = () => {
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const { allServicios } = useServicios();
  const { selectedComunas } = useComunas();
  const { user, setUserState } = useAuthNew();
  const [description, setDescription] = useState('');
  const [recurrency, setRecurrency] = useState<Recurrency>('one-off');
  const [address, setAddress] = useState(user?.address || '');
  const [service, setService] = useState(user?.service || '');
  const setNotification = useSetRecoilState(notificationState);
  const [speciality, setSpeciality] = useState(user?.speciality || '');
  const [sessionsPerRecurrency, setSessionsPerRecurrency] = useState('1');
  const [patientName, setPatientName] = useState('');
  const [patientAge, setPatientAge] = useState(0);
  const [patientRut, setPatientRut] = useState('');

  const [selectedDates, setSelectedDates] = useState<Dayjs[]>([]);
  const [totalHours, setTotalHours] = useState('1');
  const [startingDateAndTime, setStartingDateAndTime] = useState<Dayjs>();
  const [selectedPatient, setSelectedPatient] = useState<Patient>(
    user?.pacientes && user.pacientes.length > 0 ? user.pacientes[0] : ({} as Patient),
  );
  const [isCreatingNewPatient, setIsCreatingNewPatient] = useState(false);

  const handleChangeSelectedPatient = (e: SelectChangeEvent<string>) => {
    setSelectedPatient(user?.pacientes?.find((p) => p.rut === e.target.value) || ({} as Patient));
  };

  const {
    mutate: mutateAddSupportRequest,
    isLoading,
    isError,
  } = useMutation(addSupportRequest, {
    onSuccess: (data) => {
      setNotification({
        open: true,
        message: 'Publicación exitosa',
        severity: 'success',
      });
      const newPatient: Patient = {
        name: data.patientName,
        age: data.patientAge,
        rut: data.patientRut,
        service: data.serviceName,
        speciality: data.specialityName,
      };
      setUserState((prev) => ({
        ...prev!,
        pacientes: [...(prev?.pacientes || []), newPatient],
      }));
      navigate(`/ver-apoyo/${data.id}`, {
        replace: true,
        state: {
          apoyo: data,
        },
      });
    },
    onError: (error) => {
      console.error('Error adding document: ', error);
      setNotification({
        open: true,
        message: 'Error al publicar, revisa los campos e intentalo nuevamente',
        severity: 'error',
      });
      // Handle error (e.g., show an error message)
    },
  });

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (!user) {
      setNotification({
        open: true,
        message: 'Error al publicar, al parecer debes iniciar sesion nuevamente',
        severity: 'error',
      });
      throw new Error('User is not defined');
    }
    const newApoyo: Apoyo = {
      title,
      userId: user.id!,
      description,
      address,
      comunasIds: selectedComunas.map((comuna) => comuna.id),
      recurrency,
      sessionsPerRecurrency,
      serviceName: service,
      specialityName: speciality,
      forWhom: user.forWhom!,
      patientName: selectedPatient.name,
      patientAge: selectedPatient.age,
      patientRut: selectedPatient.rut,
      withNewPatient: isCreatingNewPatient,
    };
    if (isCreatingNewPatient) {
      newApoyo.patientName = patientName;
      newApoyo.patientAge = patientAge;
      newApoyo.patientRut = patientRut;
      newApoyo.withNewPatient = isCreatingNewPatient;
    }

    if (user) {
      mutateAddSupportRequest(newApoyo);
    }
  };

  const handleSelectDate = useCallback(
    (e: Dayjs) => {
      if (recurrency !== 'one-off') {
        // CASE WHERE IS MULTIPLE DATES TO SELECT
        setSelectedDates((prev) => {
          if (prev.length >= Number(sessionsPerRecurrency)) {
            // CASE WHERE THE USER SELECTS MORE SESSIONS THAN THE SESSIONS PER RECURRENCY
            return [...prev.slice(1), e];
          } else if (prev?.some((date) => date.isSame(e))) {
            const newSelectedDates = prev
              .filter((date) => !date.isSame(e))
              .sort((a, b) => (a.isAfter(b) ? 1 : -1));
            return newSelectedDates;
          } else {
            return [...prev, e];
          }
        });
      } else {
        // CASE WHERE THE USER ONLY SELECTS ONE DATE
        setSelectedDates([e]);
      }
    },
    [recurrency, sessionsPerRecurrency],
  );

  useEffect(() => {
    if (user?.forWhom === 'tercero' && user.pacientes && user.pacientes.length === 0) {
      setIsCreatingNewPatient(true);
    }
    if (user?.forWhom === 'tercero' && !user.pacientes) {
      setIsCreatingNewPatient(true);
    }
  }, [user?.forWhom]);

  return {
    user,
    title,
    setTitle,
    description,
    setDescription,
    patientName,
    setPatientName,
    patientAge,
    setPatientAge,
    patientRut,
    setPatientRut,
    address,
    setAddress,
    handleSubmit,
    isLoading,
    isError,
    service,
    setService,
    speciality,
    setSpeciality,
    setUserState,
    allServicios,
    recurrency,
    setRecurrency,
    sessionsPerRecurrency,
    setSessionsPerRecurrency,
    selectedDates,
    handleSelectDate,
    totalHours,
    setTotalHours,
    startingDateAndTime,
    setStartingDateAndTime,
    selectedPatient,
    handleChangeSelectedPatient,
    isCreatingNewPatient,
    setIsCreatingNewPatient,
  };
};
