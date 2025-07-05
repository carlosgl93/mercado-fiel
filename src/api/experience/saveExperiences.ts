import { ExperienceState } from '@/store/construirPerfil/experiencia';
import { db } from '@/firebase/firebase';
import { doc, setDoc } from 'firebase/firestore';

export const saveExperiences = async (
  prestadorId: string,
  aggregatedExperience: ExperienceState,
) => {
  const providerRef = doc(db, 'providers', prestadorId);
  const res = await setDoc(
    providerRef,
    {
      experience: aggregatedExperience,
      settings: {
        experiencia: true,
      },
    },
    { merge: true },
  );

  return res;
};
