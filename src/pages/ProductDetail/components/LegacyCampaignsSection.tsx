import { Add as AddIcon, Group as GroupIcon, Remove as RemoveIcon, Schedule as ScheduleIcon, TrendingUp as TrendingUpIcon } from '@mui/icons-material';
import { Box, Button, Card, CardContent, Chip, IconButton, LinearProgress, TextField, Typography, useTheme } from '@mui/material';
import React from 'react';

interface LegacyCampaignsSectionProps {
  campaigns: any[];
  product: any;
  user: any;
  campaignQuantity: number;
  onCampaignQuantityChange: (delta: number) => void;
  onJoinCampaign: (campaign: any) => void;
  setCampaignQuantity: (quantity: number) => void;
  formatCurrency: (amount: number) => string;
  joinCampaignMutationLoading: boolean;
}

export const LegacyCampaignsSection: React.FC<LegacyCampaignsSectionProps> = ({
  campaigns,
  product,
  user,
  campaignQuantity,
  onCampaignQuantityChange,
  onJoinCampaign,
  setCampaignQuantity,
  formatCurrency,
  joinCampaignMutationLoading,
}) => {
  const theme = useTheme();

  if (campaigns.length === 0) return null;

  return (
    <Box sx={{ mb: 4 }}>
      <Typography variant="h6" fontWeight="600" sx={{ mb: 3 }}>
        <TrendingUpIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
        Otras Campañas Activas
      </Typography>

      {campaigns.map((campaign: any) => (
        <Card
          key={campaign.id}
          sx={{ mb: 2, border: `2px solid ${theme.palette.secondary.main}` }}
        >
          <CardContent>
            <Box
              display="flex"
              justifyContent="space-between"
              alignItems="flex-start"
              sx={{ mb: 2 }}
            >
              <Box>
                <Typography variant="h6" fontWeight="600">
                  {campaign.name}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Precio objetivo:{' '}
                  <strong>{formatCurrency(campaign.targetPrice)}</strong> (ahorra{' '}
                  {formatCurrency(product.precioUnitario - campaign.targetPrice)})
                </Typography>
              </Box>
              <Chip
                label={campaign.status === 'active' ? 'Activa' : 'Finalizada'}
                color={campaign.status === 'active' ? 'success' : 'default'}
                size="small"
              />
            </Box>

            {/* Progress */}
            <Box sx={{ mb: 2 }}>
              <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                sx={{ mb: 1 }}
              >
                <Typography variant="body2">
                  Progreso: {campaign.currentQuantity} / {campaign.targetQuantity}
                </Typography>
                <Typography variant="body2" color="primary">
                  {Math.round(
                    (campaign.currentQuantity / campaign.targetQuantity) * 100,
                  )}
                  %
                </Typography>
              </Box>
              <LinearProgress
                variant="determinate"
                value={(campaign.currentQuantity / campaign.targetQuantity) * 100}
                sx={{ height: 8, borderRadius: 4 }}
              />
            </Box>

            <Box display="flex" justifyContent="space-between" alignItems="center">
              <Box display="flex" alignItems="center" gap={2}>
                <Typography variant="body2">
                  <GroupIcon sx={{ fontSize: 16, mr: 0.5 }} />
                  {campaign.participants} participantes
                </Typography>
                <Typography variant="body2">
                  <ScheduleIcon sx={{ fontSize: 16, mr: 0.5 }} />
                  Termina: {new Date(campaign.endDate).toLocaleDateString()}
                </Typography>
              </Box>

              {campaign.status === 'active' && user && (
                <Box display="flex" alignItems="center" gap={1}>
                  <IconButton
                    size="small"
                    onClick={() => onCampaignQuantityChange(-1)}
                  >
                    <RemoveIcon />
                  </IconButton>
                  <TextField
                    size="small"
                    value={campaignQuantity}
                    onChange={(e) =>
                      setCampaignQuantity(Math.max(1, parseInt(e.target.value) || 1))
                    }
                    sx={{ width: 60 }}
                    inputProps={{ min: 1, style: { textAlign: 'center' } }}
                  />
                  <IconButton
                    size="small"
                    onClick={() => onCampaignQuantityChange(1)}
                  >
                    <AddIcon />
                  </IconButton>
                  <Button
                    variant="contained"
                    size="small"
                    onClick={() => onJoinCampaign(campaign)}
                    disabled={joinCampaignMutationLoading}
                  >
                    Unirse ({formatCurrency(campaign.targetPrice * campaignQuantity)})
                  </Button>
                </Box>
              )}
            </Box>
          </CardContent>
        </Card>
      ))}
    </Box>
  );
};