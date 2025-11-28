import { usersApi } from '@/api/users';
import { useAuth } from '@/hooks/useAuthSupabase';
import { useImageUpload } from '@/utils/supabaseStorage';
import { useEffect, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from 'react-query';

interface UserProfileData {
  nombre: string;
  email: string;
  activo: boolean;
  isEditingName: boolean;
  isEditingEmail: boolean;
  isEditingStatus: boolean;
}

interface SnackbarState {
  open: boolean;
  message: string;
  severity: 'success' | 'error';
}

const ALLOWED_IMAGE_EXTENSIONS = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg'];
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

export const usePerfilUsuario = () => {
  const { cliente } = useAuth();
  const { uploadImage } = useImageUpload();
  const queryClient = useQueryClient();

  const [userProfileData, setUserProfileData] = useState<UserProfileData>({
    nombre: '',
    email: '',
    activo: true,
    isEditingName: false,
    isEditingEmail: false,
    isEditingStatus: false,
  });

  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [snackbar, setSnackbar] = useState<SnackbarState>({
    open: false,
    message: '',
    severity: 'success',
  });

  // Query for current user data
  const {
    data: userResponse,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['user', 'current'],
    queryFn: () => usersApi.getUser(cliente?.idUsuario || 0),
    enabled: !!cliente?.idUsuario,
  });

  // Mutation for updating user profile
  const updateUserProfileMutation = useMutation({
    mutationFn: async (userData: {
      nombre?: string;
      email?: string;
      profilePictureUrl?: string;
      activo?: boolean;
    }) => {
      return await usersApi.updateProfile(cliente?.idUsuario || 0, userData);
    },
    onMutate: async (userData) => {
      await queryClient.cancelQueries(['user', 'current']);
      const previousData = queryClient.getQueryData(['user', 'current']);

      queryClient.setQueryData(['user', 'current'], (old: any) => {
        if (old?.data) {
          return {
            ...old,
            data: {
              ...old.data,
              ...userData,
            },
          };
        }
        return old;
      });

      return { previousData };
    },
    onSuccess: async (response) => {
      await queryClient.invalidateQueries(['user', 'current']);
      await queryClient.invalidateQueries(['user']);
      await queryClient.refetchQueries(['user', 'current']);

      setSnackbar({
        open: true,
        message: response.message || 'Perfil actualizado exitosamente',
        severity: 'success',
      });

      setUserProfileData((prev) => ({
        ...prev,
        isEditingName: false,
        isEditingEmail: false,
        isEditingStatus: false,
      }));
    },
    onError: (error: any, userData, context) => {
      if (context?.previousData) {
        queryClient.setQueryData(['user', 'current'], context.previousData);
      }

      const message = error.response?.data?.message || 'Error al actualizar el perfil';
      setSnackbar({
        open: true,
        message,
        severity: 'error',
      });
    },
  });

  // Load user data when query succeeds
  useEffect(() => {
    if (userResponse?.data) {
      const userData = userResponse.data;
      setUserProfileData({
        nombre: userData.nombre || '',
        email: userData.email || '',
        activo: userData.activo !== false,
        isEditingName: false,
        isEditingEmail: false,
        isEditingStatus: false,
      });
    }
  }, [userResponse]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!userProfileData.nombre.trim()) {
      newErrors.nombre = 'El nombre es obligatorio';
    }

    if (!userProfileData.email.trim()) {
      newErrors.email = 'El email es obligatorio';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(userProfileData.email)) {
      newErrors.email = 'Por favor ingresa un email válido';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field: string, value: any) => {
    setUserProfileData((prev) => ({
      ...prev,
      [field]: value,
    }));

    if (errors[field]) {
      setErrors((prev) => ({
        ...prev,
        [field]: '',
      }));
    }
  };

  const handleSaveField = async (field: string) => {
    if (!validateForm()) return;

    const updateData: Record<string, any> = {};
    updateData[field] = userProfileData[field as keyof typeof userProfileData];

    await updateUserProfileMutation.mutateAsync(updateData);
  };

  const handleToggleEdit = (field: string) => {
    const editingField = `isEditing${
      field.charAt(0).toUpperCase() + field.slice(1)
    }` as keyof typeof userProfileData;
    setUserProfileData((prev) => ({
      ...prev,
      [editingField]: !prev[editingField],
    }));
  };

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const fileExtension = file.name.split('.').pop()?.toLowerCase() || '';

    // Validate file type
    if (!file.type.startsWith('image/') || !ALLOWED_IMAGE_EXTENSIONS.includes(fileExtension)) {
      setSnackbar({
        open: true,
        message: `Por favor selecciona un archivo de imagen válido. Formatos permitidos: ${ALLOWED_IMAGE_EXTENSIONS.join(
          ', ',
        ).toUpperCase()}`,
        severity: 'error',
      });
      return;
    }

    // Validate file size
    if (file.size > MAX_FILE_SIZE) {
      setSnackbar({
        open: true,
        message: 'El archivo debe ser menor a 5MB',
        severity: 'error',
      });
      return;
    }

    setIsUploadingImage(true);

    try {
      const uploadResult = await uploadImage(file, 'profile-images', 'users');

      if (!uploadResult.success) {
        throw new Error(uploadResult.error || 'Error al subir la imagen');
      }

      const imageUrl = uploadResult.key || uploadResult.url!;

      await updateUserProfileMutation.mutateAsync({
        profilePictureUrl: imageUrl,
      });

      setSnackbar({
        open: true,
        message: 'Imagen actualizada exitosamente',
        severity: 'success',
      });
    } catch (error: any) {
      console.error('Error uploading profile image:', error);
      setSnackbar({
        open: true,
        message: error.message || 'Error al subir la imagen',
        severity: 'error',
      });
    } finally {
      setIsUploadingImage(false);
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar((prev) => ({ ...prev, open: false }));
  };

  return {
    userProfileData,
    userResponse,
    isLoading,
    error,
    isUploadingImage,
    errors,
    snackbar,
    updateUserProfileMutation,
    handleInputChange,
    handleSaveField,
    handleToggleEdit,
    handleImageUpload,
    handleCloseSnackbar,
  };
};
