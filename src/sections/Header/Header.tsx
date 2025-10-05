import { useMediaQuery } from '@mui/material';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import { tablet } from '../../theme/breakpoints';
import DesktopHeaderContent from './Desktop/DesktopHeaderContent';
import MobileHeaderContent from './MobileHeaderContent';

function Header() {
  const isTablet = useMediaQuery(tablet);

  return (
    <Box>
      <AppBar
        color="transparent"
        elevation={1}
        sx={{
          borderBottom: '1px solid #e0e0e0',
          zIndex: 1200,
          backgroundColor: '#fcf9f4',
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
        }}
      >
        <Toolbar sx={{ justifyContent: 'space-between', pr: 0 }}>
          {isTablet ? <MobileHeaderContent /> : <DesktopHeaderContent />}
        </Toolbar>
      </AppBar>
    </Box>
  );
}

export default Header;
