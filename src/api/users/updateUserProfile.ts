import { db, storage } from '@/firebase/firebase';
import { doc, updateDoc } from 'firebase/firestore';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { IFormInput } from '@/pages/PerfilUsuario/PerfilUsuarioController';

type TUpdateUserDocument = {
  user: IFormInput;
  id: string;
};

export const updateUserDocument = async ({ user, id }: TUpdateUserDocument) => {
  const userDoc = doc(db, 'users', id);
  try {
    if (user.profileImage) {
      const storageRef = ref(storage, `profileImages/${id}/${user.profileImage?.name}`);
      const snapshot = await uploadBytes(storageRef, user?.profileImage);
      const photoUrl = await getDownloadURL(snapshot.ref);
      delete user.profileImage;
      await updateDoc(userDoc, { ...user, profileImageUrl: photoUrl });
    } else {
      await updateDoc(userDoc, { ...user });
    }
    return user;
  } catch (error) {
    console.error('Failed to update user:', error);
    throw new Error('Failed to update user');
  }
};
