import { User } from '@/api/users';
import {
    Avatar,
    Box,
    Card,
    CardContent,
    Chip,
    Typography,
    useTheme,
} from '@mui/material';
import React from 'react';

interface ClientCardProps {
  client: User;
  onClientClick: (clientId: number) => void;
}

export const ClientCard: React.FC<ClientCardProps> = ({
  client,
  onClientClick,
}) => {
  const theme = useTheme();

  return (
    <Card
      sx={{
        cursor: 'pointer',
        transition: 'all 0.3s ease',
        '&:hover': {
          transform: 'translateY(-2px)',
          boxShadow: theme.shadows[8],
        },
        border: `1px solid ${theme.palette.divider}`,
      }}
      onClick={() => onClientClick(client.idUsuario)}
    >
      <CardContent sx={{ p: 3 }}>
        <Box
          display="flex"
          flexDirection={{ xs: 'column', sm: 'row' }}
          alignItems={{ xs: 'center', sm: 'flex-start' }}
          gap={3}
        >
          {/* Client Avatar */}
          <Avatar
            src={client.profilePictureUrl || ''}
            sx={{
              width: 80,
              height: 80,
              border: `3px solid ${theme.palette.secondary.main}`,
            }}
          >
            <Typography variant="h4" color="secondary">
              {client.nombre?.charAt(0) || 'C'}
            </Typography>
          </Avatar>

          {/* Client Info */}
          <Box
            flex={1}
            textAlign={{ xs: 'center', sm: 'left' }}
          >
            <Typography
              variant="h6"
              fontWeight="600"
              sx={{ color: '#3A3A3A', mb: 1 }}
            >
              {client.nombre}
            </Typography>
            
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ mb: 2 }}
            >
              Cliente desde {new Date(client.createdAt).getFullYear()}
            </Typography>

            {/* Client Tags */}
            <Box
              display="flex"
              flexWrap="wrap"
              gap={1}
              justifyContent={{ xs: 'center', sm: 'flex-start' }}
            >
              <Chip
                label="Cliente Verificado"
                size="small"
                color="secondary"
              />
              {client.comuna && (
                <Chip
                  label={client.comuna}
                  size="small"
                  variant="outlined"
                />
              )}
            </Box>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};
