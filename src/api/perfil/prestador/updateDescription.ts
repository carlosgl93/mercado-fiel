/**;
 *
 * @param id: string;
 * @param  description: string;
 * @param  profileImage: File;
 * @returns  Returns
 *
 */

import { db, storage } from '@/firebase';
import { doc, updateDoc } from 'firebase/firestore';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';

export async function updateDescriptionAndImage(
  id: string,
  description: string,
  profileImage: File,
): Promise<{ description: string; photoUrl: string }> {
  const docRef = doc(db, 'providers', id);
  const storageRef = ref(storage, `profileImages/${id}/${profileImage?.name}`);
  try {
    const snapshot = await uploadBytes(storageRef, profileImage);
    const photoUrl = await getDownloadURL(snapshot.ref);
    await updateDoc(docRef, {
      description,
      profileImageUrl: photoUrl,
      'settings.sobreMi': true,
    });
    return {
      description,
      photoUrl,
    };
  } catch (error) {
    console.error(error);
    throw new Error('error updating info');
  }
}
