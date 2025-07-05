import StarBorderOutlinedIcon from '@mui/icons-material/StarBorderOutlined';
import { Box, Button, TextareaAutosize, useTheme } from '@mui/material';
import StarIcon from '@mui/icons-material/Star';
import { useEffect, useState } from 'react';

type RateProps = {
  rate: number;
  providerName: string;
  handleRateAppointment: (rating: number, comment?: string) => void;
};

export const Rate = ({ rate, providerName, handleRateAppointment }: RateProps) => {
  const [rating, setRating] = useState(rate);
  const [comment, setComment] = useState('');
  const [hover, setHover] = useState(0);
  const theme = useTheme();

  const handleRating = (value: number) => {
    if (rate !== 0) return;
    setRating(value);
  };

  const handleMouseOver = (value: number) => {
    if (rate !== 0) return;
    setHover(value);
  };

  const handleMouseLeave = () => {
    if (rate !== 0) return;
    setHover(0);
  };

  const handleTouchStart = (value: number) => {
    if (rate !== 0) return;
    setHover(value);
  };

  const handleTouchEnd = () => {
    if (rate !== 0) return;
    setHover(0);
  };

  const submitRating = () => {
    if (rate !== 0) return;
    handleRateAppointment(rating, comment);
    setRating(rating);
  };
  const handleComment = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setComment(e.target.value);
  };

  useEffect(() => {
    setRating(rate);
  }, [rate]);

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <Box
        sx={{
          display: 'flex',
          alignContent: 'center',
          alignItems: 'center',
        }}
      >
        {[...Array(5)].map((_star, index) => {
          const ratingValue = index + 1;

          return (
            <Box
              key={ratingValue}
              onMouseOver={() => handleMouseOver(ratingValue)}
              onMouseLeave={handleMouseLeave}
              onTouchStart={() => handleTouchStart(ratingValue)}
              onTouchEnd={handleTouchEnd}
              onClick={() => handleRating(ratingValue)}
              sx={{
                cursor: rate !== 0 ? 'pointer' : 'default',
                display: 'flex',
                alignItems: 'center',
              }}
            >
              {ratingValue <= (hover || rating) ? (
                <StarIcon sx={{ color: theme.palette.primary.main }} />
              ) : (
                <StarBorderOutlinedIcon sx={{ color: theme.palette.primary.main }} />
              )}
            </Box>
          );
        })}
      </Box>

      <Box>
        <TextareaAutosize
          value={comment}
          onChange={handleComment}
          placeholder={`Algun comentario? Menciona algo sobre el servicio de ${providerName}.`}
          name="review-comment"
          id="rComment"
        />
      </Box>
      {rate === 0 && (
        <Button variant="contained" onClick={submitRating} disabled={!rating} sx={{ ml: 1 }}>
          Calificar
        </Button>
      )}
    </Box>
  );
};
