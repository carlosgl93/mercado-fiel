import { Route, Routes, useLocation } from 'react-router-dom';

import Box from '@mui/material/Box';

import Footer from '@/components/Footer';
import { useNavigationHistory, useRenderFooter, useRequireLogin } from '@/hooks';
import routes from '..';

function Pages() {
  useNavigationHistory();
  useRequireLogin();
  const renderFooter = useRenderFooter();
  const location = useLocation();
  const shouldAddPaddingTop = location.pathname !== '/' && location.pathname !== '/';

  return (
    <Box
      sx={{
        height: 'fit-content',
        minHeight: '75vh',
        backgroundColor: '#f7f7f7',
        paddingTop: shouldAddPaddingTop ? '6rem' : '0',
      }}
    >
      <Routes>
        {Object.values(routes).map(({ path, component: Component }) => {
          return <Route key={path} path={path} element={<Component />} />;
        })}
      </Routes>
      {renderFooter && <Footer />}
    </Box>
  );
}

export default Pages;
