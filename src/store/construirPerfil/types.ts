import { Comuna, TarifaFront } from '@/types';

type Actions = {
  getPrestador(id: string): Promise<void>;
  getDisponibilidad(id: string): Promise<void>;
  getComunas(id: string): Promise<void>;
  getTarifas(id: string): Promise<void>;
  handleEditDisponibilidad: () => void;
  handleToggleDisponibilidadDay: (id: string) => void;
  handleTimeChange: (
    e: React.ChangeEvent<HTMLSelectElement>,
    startOrEnd: 'startTime' | 'endTime',
  ) => void;
  handleChangeFreeMeetGreet: () => void;
  handleSaveDisponibilidad: () => Promise<void>;
  handleSelectComuna: (comuna: Comuna) => void;
  handleRemoveComuna: (comuna: Comuna) => void;
  handleUpdatePrestadorComunas: () => Promise<void>;
  handleSearchComunaOnChange: (
    e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>,
  ) => void;
  handleVerPerfil: () => void;
  handleChangeTarifa: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    tarifa: TarifaFront,
  ) => void;
  handleSaveTarifas: (e: React.FormEvent<HTMLFormElement>) => Promise<void>;
};

export type { Actions };
