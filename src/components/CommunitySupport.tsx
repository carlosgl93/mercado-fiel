import { Box, Typography } from '@mui/material';

const communitySupportContent = [
  {
    title: 'Estricto proceso de aprobación',
    text: 'Toda persona que entregue apoyo en nuestra comunidad ha sido sujeta a una estricta revisión a través de una exhaustiva investigación tanto de sus antecedentes penales como académicos y personales, así como también respecto de sus referencias laborales.',
  },
  {
    title: 'Valoraciones y reseñas',
    text: 'Creemos que quienes se encuentran en la mejor posición para evaluar el desempeño de las personas de apoyo es la misma comunidad. Por esta razón, nuestra plataforma ha incorporado un sistema de calificaciones y comentarios por parte de otros usuarios de Mercado Fiel respecto a sus propias experiencias.',
  },
  // {
  //   title: 'Cobertura de seguro',
  //   text: 'Para protegerte a ti y a tu equipo de apoyo, nos hemos asociado con compañías de seguro con el propósito entregar las mejores coberturas que se ajusten a las necesidades de nuestra comunidad.',
  // },
];

function CommunitySupport() {
  return (
    <Box
      component={'section'}
      sx={{
        backgroundColor: 'background.grey',
        p: '2rem',
        borderRadius: '1rem',
        px: '10%',
      }}
    >
      <Typography variant="h4" fontWeight="bold" mb="2rem" color="primary.dark">
        Una comunidad de apoyo en la que puedes confiar
      </Typography>
      {communitySupportContent.map((item, index) => (
        <Box key={index} sx={{ mb: '2rem' }}>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              mb: 2,
            }}
          >
            <img
              src="/images/b.png"
              style={{
                width: '25px',
                height: '25px',
                marginRight: '1rem',
              }}
            />

            <Typography variant="h5" fontWeight="bold" color="primary.dark">
              {item.title}
            </Typography>
          </Box>
          <Typography variant="body1">{item.text}</Typography>
        </Box>
      ))}
      <Box>
        <img
          src="/images/una-comunidad-de-apoyo.png"
          style={{
            width: '100%',
            height: 'auto',
          }}
        />
      </Box>
    </Box>
  );
}

export default CommunitySupport;
