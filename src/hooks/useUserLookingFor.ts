import { useRecoilState } from 'recoil';
import { userLookingForState } from '../store/userLooksFor/userLooksForStore';

export enum UserLookingFor {
  SUPPLIERS = 'suppliers',
  CUSTOMERS = 'customers',
}

export const useUserLookingFor = () => {
  const [userLookingFor, setUserLookingFor] = useRecoilState(userLookingForState);

  const handleSelectLookingFor = (lookingFor: UserLookingFor) => {
    setUserLookingFor(lookingFor);
  };

  const translatedLookingFor = () => {
    switch (userLookingFor) {
      case UserLookingFor.SUPPLIERS:
        return 'Proveedores';
      case UserLookingFor.CUSTOMERS:
        return 'Clientes';
      default:
        return null;
    }
  };

  const lookingFor = translatedLookingFor();

  return {
    userLookingFor,
    lookingFor,
    handleSelectLookingFor,
    translatedLookingFor,
  };
};
