import useSidebar from '@/store/sidebar';
import Drawer from '@mui/material/Drawer';
import { useAuth } from '../../hooks/useAuthSupabase';
import { BrandHomeLinkMobile } from './BrandHomeLinkMobile';
import { NotLoggedInDrawerList } from './NotLoggedInDrawerList';
import PrestadorDrawerList from './PrestadorDrawer';
import { UsuarioDrawerList } from './UsuarioDrawerList';

function Sidebar() {
  const [isSidebarOpen, sidebarActions] = useSidebar();
  const { supplier, user, customer } = useAuth();

  const isLoggedIn = user !== null && user !== undefined;
  const closeDrawer = sidebarActions.close;

  if (!isLoggedIn) {
    return (
      <Drawer anchor="left" open={isSidebarOpen} onClose={closeDrawer}>
        <BrandHomeLinkMobile />
        <NotLoggedInDrawerList closeDrawer={closeDrawer} />
      </Drawer>
    );
  } else if (isLoggedIn && supplier?.id_usuario) {
    return (
      <Drawer anchor="left" open={isSidebarOpen} onClose={closeDrawer}>
        <BrandHomeLinkMobile />
        <PrestadorDrawerList closeDrawer={closeDrawer} />;
      </Drawer>
    );
  } else {
    return (
      <Drawer anchor="left" open={isSidebarOpen} onClose={closeDrawer}>
        <BrandHomeLinkMobile />
        <UsuarioDrawerList closeDrawer={closeDrawer} />
      </Drawer>
    );
  }
}

export default Sidebar;
