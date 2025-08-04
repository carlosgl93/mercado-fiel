import { Text, Title } from '@/components/StyledComponents';
import { formatCLP } from '@/utils/formatCLP';
import { Card, CardContent } from '@mui/material';
import { Carousel } from 'react-responsive-carousel';
import 'react-responsive-carousel/lib/styles/carousel.min.css';
import { ProductForSupplier } from '../../models/Product';

type ProductosCarouselProps = {
  productos: ProductForSupplier[];
};

export const ProductosCarousel = ({ productos }: ProductosCarouselProps) => {
  return (
    <Carousel
      autoPlay
      centerMode={productos && productos.length > 1 ? true : false}
      emulateTouch
      showThumbs={false}
      showIndicators={false}
      stopOnHover={true}
      infiniteLoop
      interval={5000}
      width={'90vw'}
      className="hide-status"
      showArrows={true}
      useKeyboardArrows={true}
    >
      {(productos ?? [])?.map((p) => (
        <Card
          key={p.nombreProducto + p.precioUnitario}
          sx={{
            mx: {
              xs: '1rem',
              md: '0',
            },
            my: '1rem',
            boxShadow: `0px 4px 8px 0px`,
            borderRadius: '1rem',
            p: '1rem',
            maxWidth: {
              xs: '100%',
              sm: '90vw',
              md: '33vw',
            },
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'start',
          }}
        >
          <Title
            sx={{
              fontSize: '1.5rem',
            }}
          >
            {p.nombreProducto}
          </Title>
          <Text variant="caption">{formatCLP(p.precioUnitario)}</Text>
          <CardContent
            sx={{
              mb: '2rem',
              px: 0,
            }}
          >
            <img src={p.imagenUrl || ''} alt={p.nombreProducto} />
            <Text>{p.descripcion}</Text>
          </CardContent>
        </Card>
      ))}
    </Carousel>
  );
};
