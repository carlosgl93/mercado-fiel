// useUpdatePrestador.ts
import { Prestador } from '@/store/auth/prestador';
import { useEffect, useState } from 'react';

export const useUpdatePrestador = (initialPrestador: Prestador | null) => {
  const [prestador, setPrestador] = useState<Prestador | null>(initialPrestador);

  useEffect(() => {
    if (prestador) {
      localStorage.setItem('prestador', JSON.stringify(prestador));
    }
  }, [prestador]);

  const updatePrestador = (update: (prev: Prestador | null) => Prestador) => {
    setPrestador((prev) => {
      const updated = update(prev);
      return updated;
    });
  };

  return updatePrestador;
};
