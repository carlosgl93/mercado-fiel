import { atom, useRecoilState } from 'recoil';

import type { Actions } from './types';
import { Especialidad, Servicio } from '@/types/Servicio';
import { Comuna } from '@/types/Comuna';

type EntregaApoyoState = {
  step: number;
  selectedComunas: Comuna[];
  selectedServicio: Servicio | null;
  especialidadesFromServicio: null | Especialidad[];
  selectedEspecialidad: Especialidad | null;
  allServicios: Servicio[] | null;
  allComunas: Comuna[] | null;
};
const entregaApoyoState = atom<EntregaApoyoState>({
  key: 'entregaApoyoState',
  default: {
    step: 0,
    selectedComunas: [],
    selectedServicio: null,
    especialidadesFromServicio: null,
    selectedEspecialidad: null,
    allServicios: null,
    allComunas: [],
  },
});

function useEntregaApoyo(): [EntregaApoyoState, Actions] {
  const [apoyo, setApoyo] = useRecoilState(entregaApoyoState);

  const resetEntregaApoyoState = () => {
    setApoyo({
      step: 0,
      selectedComunas: [],
      selectedServicio: null,
      especialidadesFromServicio: null,
      selectedEspecialidad: null,
      allServicios: null,
      allComunas: [],
    });
  };

  const addComuna = (comuna: Comuna) => {
    if (apoyo.selectedComunas.find((c) => c.id === comuna.id)) return;
    setApoyo((prev) => ({
      ...prev,
      selectedComunas: [...prev.selectedComunas, comuna],
    }));
  };

  const removeComuna = (comuna: Comuna) => {
    setApoyo((prev) => ({
      ...prev,
      selectedComunas: prev.selectedComunas.filter((c) => c !== comuna),
    }));
  };

  const increaseStep = () => {
    setApoyo((prev) => ({
      ...prev,
      step: prev.step + 1,
    }));
  };

  const decreaseStep = () => {
    setApoyo((prev) => ({
      ...prev,
      step: prev.step - 1,
    }));
  };

  const selectServicio = (servicio: Servicio) => {
    setApoyo((prev) => ({
      ...prev,
      selectedServicio: servicio,
    }));

    setApoyo((prev) => ({
      ...prev,
      especialidadesFromServicio: servicio?.especialidades || [],
    }));
  };
  const selectEspecialidad = (especialidad: Especialidad) => {
    setApoyo((prev) => ({
      ...prev,
      selectedEspecialidad: especialidad,
    }));
  };

  return [
    apoyo,
    {
      addComuna,
      removeComuna,
      increaseStep,
      selectServicio,
      selectEspecialidad,
      decreaseStep,
      resetEntregaApoyoState,
    },
  ];
}

export default useEntregaApoyo;
