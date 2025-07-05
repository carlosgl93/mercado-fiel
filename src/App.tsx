import { lazy, Suspense, Fragment } from 'react';
import { BrowserRouter } from 'react-router-dom';
import './styles.css';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { esES } from '@mui/x-date-pickers/locales';

import CssBaseline from '@mui/material/CssBaseline';

import { withErrorHandler } from '@/error-handling';
import AppErrorBoundaryFallback from '@/error-handling/fallbacks/App';
import { QueryClient, QueryClientProvider } from 'react-query';
import { NotificationSnackbar } from './components/Snackbar';

const Loading = lazy(() => import('@/components/Loading'));
const Pages = lazy(() => import('@/routes/Pages'));
const Header = lazy(() => import('@/sections/Header'));
const HotKeys = lazy(() => import('@/sections/HotKeys'));
const SW = lazy(() => import('@/sections/SW'));
const Sidebar = lazy(() => import('@/sections/Sidebar'));

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: true,
      refetchOnMount: true,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <LocalizationProvider
        dateAdapter={AdapterDayjs}
        adapterLocale="es-mx"
        localeText={esES.components.MuiLocalizationProvider.defaultProps.localeText}
      >
        <Fragment>
          <CssBaseline />
          <Suspense fallback={<Loading />}>
            <HotKeys />
            <SW />
            <BrowserRouter>
              <Header />
              <Sidebar />
              <Pages />
              <NotificationSnackbar />
            </BrowserRouter>
          </Suspense>
        </Fragment>
      </LocalizationProvider>
    </QueryClientProvider>
  );
}

export default withErrorHandler(App, AppErrorBoundaryFallback);
