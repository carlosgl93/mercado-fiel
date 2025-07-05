import { TarifaFront } from '@/types';
import { atom } from 'recoil';

export const defaultTarifas = [
  {
    id: 1,
    dayName: 'Día de semana',
    price: '0',
  },
  {
    id: 2,
    dayName: 'Sábado',
    price: '0',
  },
  {
    id: 3,
    dayName: 'Domingo',
    price: '0',
  },
];

export const tarifasState = atom<TarifaFront[]>({
  key: 'tarifasState',
  default: defaultTarifas,
});

export const offersFreeMeetAndGreetState = atom<boolean>({
  key: 'offersFreeMeetAndGreetState',
  default: false,
});
