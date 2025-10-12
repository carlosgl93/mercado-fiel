import { comprasColectivasApi, productsApi } from '@/api';
import { campaignsApi } from '@/api/campaigns';
import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { useNavigate, useParams } from 'react-router-dom';

export const useProductDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  
  const [campaignQuantity, setCampaignQuantity] = useState(1);
  const [createCampaignModalOpen, setCreateCampaignModalOpen] = useState(false);

  // Query for product details
  const {
    data: productResponse,
    isLoading: isLoadingProduct,
    error: productError,
  } = useQuery({
    queryKey: ['product', id],
    queryFn: () => productsApi.getProduct(parseInt(id || '0')),
    enabled: !!id,
  });

  // Query for collective campaigns for this product
  const { data: campaignsResponse, isLoading: isLoadingCampaigns } = useQuery({
    queryKey: ['campaigns', 'product', id],
    queryFn: () => campaignsApi.getCampaignsByProduct(parseInt(id || '0')),
    enabled: !!id,
  });

  // Query for collective purchase campaigns for this product
  const { data: collectiveCampaignsResponse, isLoading: isLoadingCollectiveCampaigns } = useQuery({
    queryKey: ['collective-campaigns', 'product', id],
    queryFn: () =>
      comprasColectivasApi.getComprasColectivas({
        id_producto: parseInt(id || '0'),
        estado: 'abierta',
      }),
    enabled: !!id,
  });

  // Mutation for joining a campaign
  const joinCampaignMutation = useMutation({
    mutationFn: (data: { campaignId: number; quantity: number; amount: number }) =>
      campaignsApi.joinCampaign(data.campaignId, data.quantity, data.amount),
    onSuccess: () => {
      queryClient.invalidateQueries(['campaigns', 'product', id]);
    },
    onError: (error: any) => {
      // Show error message
    },
  });

  const handleCampaignQuantityChange = (delta: number) => {
    setCampaignQuantity(Math.max(1, campaignQuantity + delta));
  };

  const handleJoinCampaign = (campaign: any, user: any) => {
    if (!user) {
      navigate('/login');
      return;
    }

    const amount = campaign.targetPrice * campaignQuantity;
    joinCampaignMutation.mutate({
      campaignId: campaign.id,
      quantity: campaignQuantity,
      amount,
    });
  };

  return {
    id,
    navigate,
    queryClient,
    campaignQuantity,
    setCampaignQuantity,
    createCampaignModalOpen,
    setCreateCampaignModalOpen,
    product: productResponse?.data,
    campaigns: campaignsResponse?.data || [],
    collectiveCampaigns: collectiveCampaignsResponse?.data?.campaigns || [],
    isLoadingProduct,
    isLoadingCampaigns,
    isLoadingCollectiveCampaigns,
    productError,
    joinCampaignMutation,
    handleCampaignQuantityChange,
    handleJoinCampaign,
  };
};