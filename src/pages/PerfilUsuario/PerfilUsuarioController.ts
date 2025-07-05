import { useRef, useState } from 'react';
import { useMutation } from 'react-query';
import { User, userState } from '@/store/auth/user';
import { notificationState } from '@/store/snackbar';
import { useRecoilState, useSetRecoilState } from 'recoil';
import { updateUserDocument } from '@/api/users/updateUserProfile';
import { useForm } from 'react-hook-form';
import { Comuna } from '@/types';

export interface IFormInput {
  email: string;
  firstname: string;
  lastname: string;
  gender: string;
  dob: string;
  phone: string;
  address: string;
  comuna: Comuna | undefined;
  profileImage?: File;
  patientName: string;
  age: number;
  patientAge: number;
}

export const usePerfilUsuarioController = () => {
  const [user, setUserState] = useRecoilState(userState);
  const setNotification = useSetRecoilState(notificationState);
  const [loadingPreview, setLoadingPreview] = useState(false);
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | ArrayBuffer | null>(
    user?.profileImageUrl ? user.profileImageUrl : null,
  );
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { register, handleSubmit, formState, setValue, control } = useForm<IFormInput>({
    defaultValues: {
      email: user?.email || '',
      firstname: user?.firstname || '',
      lastname: user?.lastname || '',
      gender: user?.gender || '',
      dob: user?.dob || '',
      phone: user?.phone || '',
      address: user?.address || '',
      comuna: user?.comuna,
      profileImage: image as File,
      patientName: user?.patientName || '',
    },
  });

  const { errors, isValid } = formState;

  const { mutate: updateUser, isLoading: updateUserLoading } = useMutation(updateUserDocument, {
    onSuccess: (data) => {
      setNotification({
        open: true,
        message: 'Perfil actualizado correctamente',
        severity: 'success',
      });
      setUserState(
        (prev) =>
          ({
            ...prev,
            ...data,
            comuna: data.comuna,
          } as User),
      );
    },
    onError: (error) => {
      console.error('Failed to update profile:', error);
      alert('Failed to update profile. Please try again.');
    },
  });

  const onSubmit = async (data: IFormInput) => {
    try {
      updateUser({ user: data, id: user?.id ?? '' });
    } catch (error) {
      console.error('Failed to update profile:', error);
    }
  };

  const handleEditPicture = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setLoadingPreview(true);
      setImage(file);
      const reader = new FileReader();

      reader.onloadend = () => {
        setImagePreview(reader.result);
        setValue('profileImage', file, { shouldValidate: true });
        setLoadingPreview(false);
      };

      reader.readAsDataURL(file);
    }
  };

  return {
    updateUserLoading,
    loadingPreview,
    imagePreview,
    fileInputRef,
    isValid,
    control,
    errors,
    user,
    register,
    setValue,
    onSubmit,
    handleSubmit,
    handleImageChange,
    handleEditPicture,
  };
};
