import { CuentaBancariaInputs } from '@/pages/ConstruirPerfil/CuentaBancaria/CuentaBancaria';
import { db } from '@/firebase/firebase';
import { doc, setDoc, updateDoc } from 'firebase/firestore';

interface SaveCuentaBancaria extends CuentaBancariaInputs {
  id: string;
}

export const postCuentaBancaria = async (
  prestadorId: string | undefined,
  data: SaveCuentaBancaria,
) => {
  if (!prestadorId) {
    throw new Error('Prestador no encontrado, intenta ingresando nuevamente');
  }

  const bankAccountRef = doc(db, 'bankAccounts', data.id);
  const prestadorDocRef = doc(db, 'providers', prestadorId);

  try {
    const result = await setDoc(bankAccountRef, data);
    await updateDoc(prestadorDocRef, { 'settings.cuentaBancaria': true });
    return result;
  } catch (error) {
    console.error('Error adding document: ', error);
    throw error;
  }
};
