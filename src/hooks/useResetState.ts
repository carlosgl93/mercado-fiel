/**;
 * Function to reset the state of the app.
 * no params
 * @returns void
 *
 */

import { userAppointmentsState } from '@/store/appointments';
import { providerAppointmentsState } from '@/store/appointments/providerAppointmentsState';
import { defaultProveedor, proveedorState } from '@/store/auth/proveedor';
import { userState } from '@/store/auth/user';
import { chatState } from '@/store/chat/chatStore';
import { availabilityState } from '@/store/construirPerfil/availability';
import { comunasState } from '@/store/construirPerfil/comunas';
import { aggregatedExperienceState } from '@/store/construirPerfil/experiencia';
import { defaultServicio, servicioState } from '@/store/construirPerfil/servicios';
import { tarifasState } from '@/store/construirPerfil/tarifas';
import useEntregaApoyo from '@/store/entregaApoyo';
import { hotKeysDialogState } from '@/store/hotkeys';
import useRecibeApoyo from '@/store/recibeApoyo';
import { interactedProveedorState } from '@/store/resultados/interactedPrestador';
import { defaultScheduleState, scheduleState } from '@/store/schedule/sheduleState';
import { defaultTarifas } from '@/utils/constants';
import { useSetRecoilState } from 'recoil';
import { navigationHistoryState } from '../store/history/index';

export function useResetState() {
  const setProviderAppointments = useSetRecoilState(providerAppointmentsState);
  const setUserAppointments = useSetRecoilState(userAppointmentsState);
  const setExperience = useSetRecoilState(aggregatedExperienceState);
  const setAvailability = useSetRecoilState(availabilityState);
  const setPrestador = useSetRecoilState(proveedorState);
  const setServicio = useSetRecoilState(servicioState);
  const setComunas = useSetRecoilState(comunasState);
  const setUser = useSetRecoilState(userState);
  const setChat = useSetRecoilState(chatState);
  const setTarifa = useSetRecoilState(tarifasState);
  const [, { resetEntregaApoyoState }] = useEntregaApoyo();
  const setNavigationHistory = useSetRecoilState(navigationHistoryState);
  const setHotKeys = useSetRecoilState(hotKeysDialogState);
  const [, { resetRecibeApoyoState }] = useRecibeApoyo();
  const setInteractedPrestador = useSetRecoilState(interactedProveedorState);
  const setSchedule = useSetRecoilState(scheduleState);

  const resetState = () => {
    setUserAppointments([]);
    setProviderAppointments([]);
    setUser(null);
    setPrestador(defaultProveedor);
    setChat({
      id: '',
      providerId: '',
      userId: '',
      providerName: '',
      messages: [],
    });
    setAvailability([]);
    setComunas([]);
    setExperience([]);
    setServicio(defaultServicio);
    setTarifa(defaultTarifas);
    resetEntregaApoyoState();
    setNavigationHistory([]);
    setHotKeys(false);
    resetRecibeApoyoState();
    setInteractedPrestador(null);
    setSchedule(defaultScheduleState);
  };

  return {
    resetState,
  };
}
