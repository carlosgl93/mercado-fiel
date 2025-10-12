import { Group as GroupIcon, Info as InfoIcon } from '@mui/icons-material';
import { Alert, Box, Button, Typography } from '@mui/material';
import React from 'react';
import { useUserCampaignParticipation } from '../hooks/useUserCampaignParticipation';
import { CampaignCard } from './CampaignCard';

interface CollectiveCampaignsSectionProps {
  product: any;
  campaigns: any[];
  isUserProductSupplier: boolean;
  user: any;
  onCreateCampaign: () => void;
  formatCurrency: (amount: number) => string;
}

export const CollectiveCampaignsSection: React.FC<CollectiveCampaignsSectionProps> = ({
  product,
  campaigns,
  isUserProductSupplier,
  user,
  onCreateCampaign,
  formatCurrency,
}) => {
  const {
    isParticipatingInCampaign,
    getUserParticipationInCampaign,
    hasParticipations,
  } = useUserCampaignParticipation(campaigns);
  if (!product.elegibleCompraColectiva) return null;

  return (
    <Box sx={{ mb: 4 }}>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        sx={{ mb: 3 }}
      >
        <Typography variant="h6" fontWeight="600">
          <GroupIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
          Compras Colectivas
        </Typography>

        {user && !isUserProductSupplier && (
          <Button
            variant="outlined"
            size="small"
            startIcon={<GroupIcon />}
            onClick={onCreateCampaign}
          >
            Crear Campaña
          </Button>
        )}
      </Box>

      {/* User Participation Summary */}
      {user && hasParticipations && (
        <Alert severity="info" sx={{ mb: 2 }}>
          <Box display="flex" alignItems="center">
            <InfoIcon sx={{ mr: 1 }} />
            <Typography variant="body2">
              Estás participando en {campaigns.filter(c => isParticipatingInCampaign(c.id_campana)).length} campaña(s) de este producto.
            </Typography>
          </Box>
        </Alert>
      )}

      {campaigns.length > 0 ? (
        campaigns.map((campaign) => (
          <CampaignCard 
            key={campaign.id_campana} 
            campaign={campaign} 
            product={product}
            formatCurrency={formatCurrency}
            isUserParticipating={isParticipatingInCampaign(campaign.id_campana)}
            userParticipation={getUserParticipationInCampaign(campaign.id_campana)}
          />
        ))
      ) : (
        <Alert severity="info" sx={{ mb: 2 }}>
          <Typography variant="body2">
            No hay campañas colectivas activas para este producto.
            {user && ' ¡Sé el primero en crear una!'}
          </Typography>
        </Alert>
      )}
    </Box>
  );
};