import { getPrestadorById } from '@/api/prestadores/getPrestadorById';
import { Prestador } from '@/types';
import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';

type usePrestadorProps = {
  id?: string;
};

export const usePrestador = ({ id }: usePrestadorProps) => {
  const [params] = useSearchParams();
  const [prestadorState, setPrestadorState] = useState<{
    prestador: Prestador | null;
    loading: boolean;
    error: boolean;
  }>({
    prestador: null,
    loading: false,
    error: false,
  });

  const prestadorId = id ? id : params.get('prestadorId');

  useEffect(() => {
    console.log('prestadorId', prestadorId);
    console.log('useefect');

    if (prestadorId) {
      setPrestadorState((prevState) => ({ ...prevState, loading: true }));
      getPrestadorById(prestadorId)
        .then((res) => {
          setPrestadorState((prevState) => ({ ...prevState, prestador: res }));
        })
        .catch((err) => {
          console.log(err);
          setPrestadorState((prevState) => ({ ...prevState, error: true }));
        })
        .finally(() => {
          setPrestadorState((prevState) => ({ ...prevState, loading: false }));
        });
    }
  }, []);

  return prestadorState;
};
