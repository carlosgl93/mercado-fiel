/**;
 * Function to reset the state of the app.
 * no params
 * @returns void
 *
 */

import { useSetRecoilState } from 'recoil';
import { userState } from '@/store/auth/user';
import { chatState } from '@/store/chat/chatStore';
import { defaultTarifas } from '@/utils/constants';
import { userAppointmentsState } from '@/store/appointments';
import { tarifasState } from '@/store/construirPerfil/tarifas';
import { comunasState } from '@/store/construirPerfil/comunas';
import { availabilityState } from '@/store/construirPerfil/availability';
import { defaultPrestador, prestadorState } from '@/store/auth/prestador';
import { aggregatedExperienceState } from '@/store/construirPerfil/experiencia';
import { defaultServicio, servicioState } from '@/store/construirPerfil/servicios';
import { providerAppointmentsState } from '@/store/appointments/providerAppointmentsState';
import useEntregaApoyo from '@/store/entregaApoyo';
import { navigationHistoryState } from '../store/history/index';
import { hotKeysDialogState } from '@/store/hotkeys';
import useRecibeApoyo from '@/store/recibeApoyo';
import { interactedPrestadorState } from '@/store/resultados/interactedPrestador';
import { defaultScheduleState, scheduleState } from '@/store/schedule/sheduleState';

export function useResetState() {
  const setProviderAppointments = useSetRecoilState(providerAppointmentsState);
  const setUserAppointments = useSetRecoilState(userAppointmentsState);
  const setExperience = useSetRecoilState(aggregatedExperienceState);
  const setAvailability = useSetRecoilState(availabilityState);
  const setPrestador = useSetRecoilState(prestadorState);
  const setServicio = useSetRecoilState(servicioState);
  const setComunas = useSetRecoilState(comunasState);
  const setUser = useSetRecoilState(userState);
  const setChat = useSetRecoilState(chatState);
  const setTarifa = useSetRecoilState(tarifasState);
  const [, { resetEntregaApoyoState }] = useEntregaApoyo();
  const setNavigationHistory = useSetRecoilState(navigationHistoryState);
  const setHotKeys = useSetRecoilState(hotKeysDialogState);
  const [, { resetRecibeApoyoState }] = useRecibeApoyo();
  const setInteractedPrestador = useSetRecoilState(interactedPrestadorState);
  const setSchedule = useSetRecoilState(scheduleState);

  const resetState = () => {
    setUserAppointments([]);
    setProviderAppointments([]);
    setUser(null);
    setPrestador(defaultPrestador);
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
