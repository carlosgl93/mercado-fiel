import { Box, Typography, useMediaQuery, useTheme } from '@mui/material';
import { styled } from '@mui/material/styles';
import { useEffect, useState } from 'react';
import { UserSearchesForCTAs } from './UserSearchesForCTAs';

interface ImageSliderProps {
  interval?: number;
}

const ImageSliderImage = styled(Box)({
  position: 'absolute',
  top: 0,
  left: 0,
  width: '100%',
  height: '100%',
  backgroundSize: 'cover',
  backgroundPosition: 'center',
  transition: 'opacity 0.5s ease-in-out',
});

const ImageSliderOverlay = styled(Box)({
  position: 'absolute',
  top: 0,
  left: 0,
  width: '100%',
  height: '100%',
  backgroundColor: 'rgba(0, 0, 0, 0.6)',
});

export const ImageSliderText = styled(Typography)({
  color: 'white',
  zIndex: 1,
});

const desktopImages = [
  '/images/first-hero-1080p.jpg',
  '/images/second-hero-1080p.jpg',
  '/images/third-hero-1287p.jpg',
];
const mobileImages = [
  '/images/first-hero-960p.jpg',
  '/images/second-hero-426p.jpg',
  '/images/third-hero-429p.jpg',
];

function ImageSlider({ interval = 5000 }: ImageSliderProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  // const navigate = useNavigate();

  // Use responsive images based on screen size
  const images = isMobile ? mobileImages : desktopImages;

  // const handleSelectCategory = () => {
  //   if (navigate) {
  //     navigate('/resultados');
  //   }
  // };

  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentImageIndex((currentImageIndex + 1) % images.length);
    }, interval);

    return () => clearInterval(intervalId);
  }, [currentImageIndex, interval, images.length]);

  return (
    <Box
      sx={{
        position: 'relative',
        width: '100%',
        height: {
          xs: '100vh',
          sm: '95vh',
          md: '85vh',
          lg: '80vh',
        },
        overflow: 'hidden',
      }}
    >
      {images.map((image, index) => (
        <ImageSliderImage
          key={index}
          style={{
            backgroundImage: `url(${image})`,
            backgroundPosition: 'center',
            opacity: index === currentImageIndex ? 1 : 0,
          }}
        >
          {index === currentImageIndex && <ImageSliderOverlay />}
        </ImageSliderImage>
      ))}
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100%',
          textAlign: 'center',
          p: {
            xs: '1rem',
          },
        }}
      >
        <ImageSliderText
          variant="h2"
          sx={{
            fontSize: '2.5rem',
            mb: '1rem',
            fontWeight: 'bold',
            color: '#fcf9f4',
            // backgroundColor: '#fcf9f4',
          }}
        >
          Mercado Fiel{' '}
        </ImageSliderText>
        <ImageSliderText
          variant="h2"
          sx={{
            fontSize: '2rem',
            mb: '1rem',
            fontWeight: 'bold',
            color: 'white',
          }}
        >
          Conecta con proveedores y clientes en un solo lugar
        </ImageSliderText>
        <ImageSliderText
          variant="subtitle1"
          sx={{
            color: 'white',
          }}
        >
          Más clientes para tus productos.
        </ImageSliderText>
        <ImageSliderText
          variant="subtitle1"
          sx={{
            color: 'white',
          }}
        >
          Mejores precios para tus compras.
        </ImageSliderText>
        <ImageSliderText
          variant="subtitle1"
          sx={{
            color: 'white',
            fontWeight: 'bolder',
          }}
        >
          Juntos somos más fuertes.
        </ImageSliderText>

        <UserSearchesForCTAs />
      </Box>
    </Box>
  );
}

export default ImageSlider;
