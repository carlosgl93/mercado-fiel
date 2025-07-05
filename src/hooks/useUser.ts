import { notificationState } from '@/store/snackbar';
import { doc, getDoc } from 'firebase/firestore';
import { useSetRecoilState } from 'recoil';
import { db } from '@/firebase/firebase';
import { User } from '@/store/auth/user';
import { useQuery } from 'react-query';

const getUserById = async (id: string) => {
  const usersRef = doc(db, 'users', id);
  try {
    const res = await getDoc(usersRef);
    return res.data() as User;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const useUser = (userId: string) => {
  const setNotification = useSetRecoilState(notificationState);

  const {
    data: user,
    isError,
    isLoading,
    error,
  } = useQuery(['user', userId], () => getUserById(userId), {
    enabled: !!userId,
    onError: (error) => {
      console.error(error);
      setNotification({
        open: true,
        message: 'Ocurrió un error al cargar el usuario',
        severity: 'error',
      });
    },
  });

  return {
    user,
    isError,
    isLoading,
    error,
  };
};
