import { useRef, useState } from 'react';
import { useTheme } from '@mui/material';
import { SubmitHandler, useForm } from 'react-hook-form';
import { useMutation } from 'react-query';
import { updateDescriptionAndImage } from '@/api/perfil/prestador/updateDescription';
import { useRecoilState, useSetRecoilState } from 'recoil';
import { notificationState } from '@/store/snackbar';
import { Prestador, prestadorState } from '@/store/auth/prestador';

type SobreMiInputs = {
  description: string;
  profileImage: File;
};

type UpdateDescriptionParams = {
  id: string;
  description: string;
  profileImage: File;
};

export const useSobreMi = () => {
  const [loadingPreview, setLoadingPreview] = useState(false);
  const setNotification = useSetRecoilState(notificationState);
  const [prestador, setPrestador] = useRecoilState(prestadorState);
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | ArrayBuffer | null>(
    prestador?.profileImageUrl ? prestador.profileImageUrl : null,
  );
  const fileInputRef = useRef<HTMLInputElement>(null);

  const theme = useTheme();
  const {
    handleSubmit,
    register,
    setValue,
    formState: { errors, isValid, isDirty },
    watch,
  } = useForm<SobreMiInputs>({
    defaultValues: {
      description: prestador?.description,
      profileImage: image as File,
    },
  });

  const onSubmit: SubmitHandler<SobreMiInputs> = ({ description, profileImage }) =>
    updateDescriptionMutation({ id: prestador!.id, description, profileImage });

  const { mutate: updateDescriptionMutation, isLoading: updateDescriptionLoading } = useMutation(
    'updateDescription',
    ({ id, description, profileImage }: UpdateDescriptionParams) =>
      updateDescriptionAndImage(id, description, profileImage),
    {
      onSuccess(data: { description: string; photoUrl: string }) {
        setPrestador(
          (prev) =>
            ({
              ...prev,
              settings: {
                ...prev?.settings,
                sobreMi: true,
              },
              description: watch('description'),
              profileImageUrl: data.photoUrl,
            } as Prestador),
        );
        setNotification({
          open: true,
          message: 'Información actualizada.',
          severity: 'success',
        });
      },
      // onSuccess( data, variables, context ) {
      //   console.log(data)
      // },
      onError() {
        setNotification({
          open: true,
          message: 'Hubo un error! Intentalo nuevamente.',
          severity: 'error',
        });
      },
    },
  );

  const handleEditPicture = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      console.log(file);
      setLoadingPreview(true);
      setImage(file);
      const reader = new FileReader();

      reader.onloadend = () => {
        console.log(reader);
        setImagePreview(reader.result);
        setValue('profileImage', file, { shouldValidate: true });
        setLoadingPreview(false);
      };

      reader.readAsDataURL(file);
    }
  };

  const descriptionLength = watch('description')?.length || 0;
  const maxLength = 300;
  const overMaxLength = descriptionLength > maxLength;
  const errorTextColor = theme.palette.secondary.contrastText;
  const validTextColor = theme.palette.primary.main;
  const disable = !isValid && isDirty;

  return {
    handleSubmit,
    onSubmit,
    register,
    watch,
    loadingPreview,
    fileInputRef,
    theme,
    updateDescriptionLoading,
    formState: { errors, isValid },
    disable,
    overMaxLength,
    errorTextColor,
    validTextColor,
    maxLength,
    prestador,
    descriptionLength,
    handleEditPicture,
    handleImageChange,
    imagePreview,
  };
};
