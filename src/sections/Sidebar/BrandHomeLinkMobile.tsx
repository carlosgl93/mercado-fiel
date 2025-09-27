import { HeaderIconImage } from '@/components/styled';
import { Box } from '@mui/system';
import { Link } from 'react-router-dom';

export const BrandHomeLinkMobile = () => {
  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        backgroundColor: '#fcf9f4',
      }}
    >
      <Link
        to="/"
        style={{
          display: 'flex',
          alignItems: 'center',
        }}
      >
        <HeaderIconImage src={`/images/mercadofiel.png`} alt="Mercado Fiel logo" loading="lazy" />
      </Link>
    </Box>
  );
};
