import { getAllExperiences, saveExperiences } from '@/api/experience';
import {
  aggregatedExperienceState,
  allExperiencesState,
  ExperienceOption,
  ExperienceType,
} from '@/store/construirPerfil/experiencia';
import { notificationState } from '@/store/snackbar';
import { AxiosError } from 'axios';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { useRecoilState, useRecoilValue } from 'recoil';
import { prestadorState } from '@/store/auth/prestador';

export const useExperiencia = () => {
  const [notification, setNotification] = useRecoilState(notificationState);
  const [prestador, setPrestadorState] = useRecoilState(prestadorState);

  const [aggregatedExperience, setAggregatedExperience] = useRecoilState(aggregatedExperienceState);
  const experienceOptions = useRecoilValue(allExperiencesState);

  const queryClient = useQueryClient();

  const providerId = prestador?.id;

  const {
    data: allExperiences,
    isError,
    isLoading,
    error,
  } = useQuery(['allExperiences'], () => getAllExperiences(providerId ?? ''), {
    enabled: Boolean(providerId?.length),
    onError: (error: { message: string }) => {
      setNotification({
        ...notification,
        open: true,
        message: error.message,
        severity: 'error',
      });
    },
    onSuccess: (data) => {
      if (!data) return;
      setAggregatedExperience(data);
    },
  });

  const {
    isLoading: saveExpLoading,
    error: saveExpError,
    mutate,
  } = useMutation(() => saveExperiences(providerId ?? '', aggregatedExperience), {
    onSuccess: () => {
      // Handle success
      setNotification({
        ...notification,
        open: true,
        message: 'Experiencia guardada',
        severity: 'success',
      });
      // invalidate prestador Experiences
      queryClient.resetQueries();
      setPrestadorState((prev) => {
        if (!prev) return null;
        return { ...prev, settings: { ...prev.settings, experiencia: true } };
      });
    },
    onError: (error: AxiosError) => {
      // Handle error
      console.log({ error });
      setNotification({
        ...notification,
        open: true,
        message: `Hubo un error, intentalo nuevamente: ${error.message}`,
        severity: 'error',
      });
    },
    onMutate: () => {
      setNotification({
        ...notification,
        open: true,
        message: 'Guardando experiencia...',
        severity: 'info',
      });
    },
  });

  const selectPreviousExperience = (option: ExperienceOption) => {
    const { id, label } = option;
    setAggregatedExperience((prev) => {
      const experience = prev?.find((exp) => exp.id === id);
      if (experience) {
        return prev.filter((e) => e.id !== id);
      } else {
        return [
          ...prev,
          {
            id,
            name: label,
            type: [],
            mainArea: '',
            otherAreas: [],
          },
        ];
      }
    });
  };

  const detectPreviousExperience = (id: number) => {
    return Boolean(aggregatedExperience?.find((e) => e.id === id));
  };

  const selectExperienceType = (type: ExperienceType, id: number) => {
    const experience = aggregatedExperience?.find((exp) => exp.id === id);
    if (experience) {
      setAggregatedExperience((prev) => {
        return prev.map((exp) => {
          if (exp.id === id) {
            return {
              ...exp,
              type: exp.type.includes(type)
                ? exp.type.filter((item) => item !== type)
                : [...exp.type, type],
            };
          }
          return exp;
        });
      });
    }
  };

  const detectSelectedExperienceType = (type: ExperienceType, id: number) => {
    return Boolean(aggregatedExperience?.find((e) => e.id === id)?.type.includes(type));
  };

  const selectMainExperienceAreas = (label: string, id: number) => {
    setAggregatedExperience((prev) => {
      return prev.map((exp) => {
        if (exp.id === id) {
          return {
            ...exp,
            type: [...exp.type],
            mainArea: label,
            otherAreas: exp.otherAreas.includes(label)
              ? exp.otherAreas.filter((l) => l !== label)
              : [...exp.otherAreas, label],
          };
        }
        return exp;
      });
    });
  };

  const detectMainExperienceAreas = (label: string, id: number) => {
    return Boolean(aggregatedExperience?.find((e) => e.id === id)?.mainArea.includes(label));
  };

  const detectOtherExperienceAreas = (label: string, id: number) => {
    return Boolean(aggregatedExperience?.find((e) => e.id === id)?.otherAreas.includes(label));
  };

  const selectOtherExperienceAreas = (label: string, id: number) => {
    setAggregatedExperience((prev) => {
      return prev.map((exp) => {
        if (exp.id === id) {
          return {
            ...exp,
            otherAreas: exp.otherAreas.includes(label)
              ? exp.otherAreas.filter((item) => item !== label)
              : [...exp.otherAreas, label],
          };
        }
        return exp;
      });
    });
  };

  const handleSaveExperience = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    mutate();
  };

  return {
    saveExpError,
    saveExpLoading,
    isLoading,
    isError,
    error,
    experienceOptions,
    aggregatedExperience,
    allExperiences,
    selectPreviousExperience,
    detectPreviousExperience,
    selectExperienceType,
    detectSelectedExperienceType,
    selectMainExperienceAreas,
    detectMainExperienceAreas,
    detectOtherExperienceAreas,
    selectOtherExperienceAreas,
    handleSaveExperience,
    setAggregatedExperience,
  };
};
