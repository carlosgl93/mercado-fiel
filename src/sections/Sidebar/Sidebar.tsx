import useSidebar from '@/store/sidebar';
import Drawer from '@mui/material/Drawer';
import { useAuth } from '../../hooks/useAuthSupabase';
import { BrandHomeLinkMobile } from './BrandHomeLinkMobile';
import { NotLoggedInDrawerList } from './NotLoggedInDrawerList';
import PrestadorDrawerList from './PrestadorDrawer';
import { UsuarioDrawerList } from './UsuarioDrawerList';

function Sidebar() {
  const [isSidebarOpen, sidebarActions] = useSidebar();
  const { supplier, user } = useAuth();

  const isLoggedIn = user?.data?.isLoggedIn;
  const isSupplier = isLoggedIn && supplier?.idUsuario;
  const closeDrawer = sidebarActions.close;

  // Determine which drawer content to render
  const getDrawerContent = () => {
    if (!isLoggedIn) {
      return <NotLoggedInDrawerList closeDrawer={closeDrawer} />;
    }

    if (isSupplier) {
      return <PrestadorDrawerList closeDrawer={closeDrawer} />;
    }

    return <UsuarioDrawerList closeDrawer={closeDrawer} />;
  };

  // Common drawer props
  const drawerProps = {
    anchor: 'left' as const,
    open: isSidebarOpen,
    onClose: closeDrawer,
    ...(isLoggedIn ? {} : { sx: { backgroundColor: '#fcf9f4' } }),
  };

  return (
    <Drawer {...drawerProps}>
      <BrandHomeLinkMobile />
      {getDrawerContent()}
    </Drawer>
  );
}

export default Sidebar;
