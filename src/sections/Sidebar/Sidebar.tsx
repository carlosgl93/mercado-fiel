import { NotLoggedInDrawerList } from './NotLoggedInDrawerList';
import { BrandHomeLinkMobile } from './BrandHomeLinkMobile';
import { UsuarioDrawerList } from './UsuarioDrawerList';
import PrestadorDrawerList from './PrestadorDrawer';
import { useAuthNew } from '@/hooks/useAuthNew';
import { userState } from '@/store/auth/user';
import Drawer from '@mui/material/Drawer';
import useSidebar from '@/store/sidebar';
import { useRecoilValue } from 'recoil';

function Sidebar() {
  const [isSidebarOpen, sidebarActions] = useSidebar();
  const { prestador } = useAuthNew();
  const user = useRecoilValue(userState);

  const isLoggedIn = user?.isLoggedIn || prestador?.isLoggedIn;

  const closeDrawer = sidebarActions.close;

  if (!isLoggedIn) {
    return (
      <Drawer anchor="left" open={isSidebarOpen} onClose={closeDrawer}>
        <BrandHomeLinkMobile />
        <NotLoggedInDrawerList closeDrawer={closeDrawer} />
      </Drawer>
    );
  } else if (isLoggedIn && prestador?.id.length) {
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
