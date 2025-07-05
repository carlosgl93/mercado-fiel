import { useLocation } from 'react-router-dom';

export const useRenderFooter = () => {
  const location = useLocation();
  return location.pathname !== '/chat' && location.pathname !== '/prestador-chat';
};
