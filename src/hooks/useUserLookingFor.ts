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

  return {
    userLookingFor,
    handleSelectLookingFor,
  };
};
