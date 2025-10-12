import { useAuth } from '@/hooks/useAuthSupabase';

export const useUserCampaignParticipation = (campaigns: any[]) => {
  const { user } = useAuth();

  const isParticipatingInCampaign = (campaignId: number): boolean => {
    if (!user || !campaigns) return false;
    
    const campaign = campaigns.find(c => c.id_campana === campaignId);
    if (!campaign?.participantes) return false;

    return campaign.participantes.some(
      (p: any) => p.id_usuario === user.data?.idUsuario
    );
  };

  const getUserParticipationInCampaign = (campaignId: number) => {
    if (!user || !campaigns) return null;
    
    const campaign = campaigns.find(c => c.id_campana === campaignId);
    if (!campaign?.participantes) return null;

    // Find user's participation details
    const userParticipation = campaign.participantes.find(
      (p: any) => p.id_usuario === user.data?.idUsuario
    );

    return userParticipation || null;
  };

  const getParticipatedCampaigns = () => {
    if (!user || !campaigns) return [];
    
    return campaigns.filter(campaign => 
      campaign.participantes?.some((p: any) => p.id_usuario === user.data?.idUsuario)
    );
  };

  return {
    isParticipatingInCampaign,
    getUserParticipationInCampaign,
    getParticipatedCampaigns,
    hasParticipations: getParticipatedCampaigns().length > 0,
  };
};