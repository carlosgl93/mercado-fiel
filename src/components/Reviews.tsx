import StarBorderOutlinedIcon from '@mui/icons-material/StarBorderOutlined';
import StarOutlinedIcon from '@mui/icons-material/StarOutlined';
import { Box, useTheme } from '@mui/material';
import { Text } from './StyledComponents';

type ReviewsProps = {
  average: number | undefined;
  total_reviews: number | undefined;
};

const Reviews = ({ average, total_reviews }: ReviewsProps) => {
  const theme = useTheme();

  return (
    <Box
      sx={{
        display: 'flex',
        alignContent: 'center',
        alignItems: 'center',
      }}
    >
      {average ? (
        <>
          {Array.from(Array(average).keys()).map((i) => (
            <StarOutlinedIcon key={i} sx={{ color: theme.palette.primary.main }} />
          ))}
          {Array.from(Array(5 - average).keys()).map((i) => (
            <StarBorderOutlinedIcon key={i} sx={{ color: theme.palette.primary.main }} />
          ))}
          <Text
            sx={{
              ml: '0.5rem',
              color: theme.palette.background.paper,
            }}
          >
            {average}{' '}
            {`(${
              total_reviews
                ? total_reviews > 1 && total_reviews !== 0
                  ? `de ${total_reviews} reseñas`
                  : `de ${total_reviews} reseña`
                : ''
            })`}
          </Text>
        </>
      ) : (
        <Box>
          {Array.from(Array(5).keys()).map((i) => (
            <StarBorderOutlinedIcon key={i} sx={{ color: theme.palette.primary.main }} />
          ))}
        </Box>
      )}
    </Box>
  );
};

export default Reviews;
