// Temporarily removing date picker imports due to date-fns compatibility issues
// import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
// import { esES } from '@mui/x-date-pickers/locales';
// import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { Fragment, lazy, Suspense } from 'react';
import { BrowserRouter } from 'react-router-dom';
import './styles.css';

import CssBaseline from '@mui/material/CssBaseline';

import { withErrorHandler } from '@/error-handling';
import AppErrorBoundaryFallback from '@/error-handling/fallbacks/App';
import { QueryClient, QueryClientProvider } from 'react-query';
import { ShoppingCartDrawer } from './components/ShoppingCartDrawer';
import { NotificationSnackbar } from './components/Snackbar';

const Loading = lazy(() => import('@/components/Loading'));
const Pages = lazy(() => import('@/routes/Pages'));
const Header = lazy(() => import('@/sections/Header'));
const SW = lazy(() => import('@/sections/SW'));
const Sidebar = lazy(() => import('@/sections/Sidebar'));

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      refetchOnMount: false,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      {/* Temporarily removing LocalizationProvider due to date-fns compatibility issues */}
      <Fragment>
        <CssBaseline />
        <Suspense fallback={<Loading />}>
          <SW />
          <BrowserRouter>
            <Header />
            <Sidebar />
            <Pages />
            <NotificationSnackbar />
            <ShoppingCartDrawer />
          </BrowserRouter>
        </Suspense>
      </Fragment>
    </QueryClientProvider>
  );
}

export default withErrorHandler(App, AppErrorBoundaryFallback);
