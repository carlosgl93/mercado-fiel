import { navigationHistoryState } from '@/store/history';
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useRecoilState } from 'recoil';

// Create a custom hook to interact with the navigation history
export function useNavigationHistory() {
  const [history, setHistory] = useRecoilState(navigationHistoryState);
  const location = useLocation();

  useEffect(() => {
    setHistory((prevHistory: string[]) => [...prevHistory, location.pathname]);
  }, [location, setHistory]);

  return history;
}
