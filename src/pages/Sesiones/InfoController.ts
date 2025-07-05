import { useState } from 'react';

export const InfoController = () => {
  const [openInfo, setOpenInfo] = useState(false);
  const handleOpenInfo = () => setOpenInfo(true);
  const handleCloseInfo = () => setOpenInfo(false);

  return {
    openInfo,
    handleOpenInfo,
    handleCloseInfo,
  };
};
