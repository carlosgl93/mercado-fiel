import { objectToCamelCase, objectToSnakeCase } from '@/utils/caseMapping';
import api from './api';

const CAMPAIGNS_ENDPOINT = '/campaigns';

export interface Campaign {
  id: number;
  name: string;
  description?: string;
  productId: number;
  targetQuantity: number;
  currentQuantity: number;
  targetPrice: number;
  currentPrice: number;
  startDate: string;
  endDate: string;
  participants: number;
  status: 'active' | 'completed' | 'expired';
  createdAt: string;
  updatedAt: string;
}

export interface CampaignResponse {
  success: boolean;
  data: Campaign | null;
  message?: string;
}

export interface CampaignsListResponse {
  success: boolean;
  data: Campaign[];
  message?: string;
}

export interface JoinCampaignRequest {
  quantity: number;
  amount: number;
}

export const campaignsApi = {
  // Get all campaigns
  getCampaigns: async (filters?: {
    status?: string;
    productId?: number;
    page?: number;
    limit?: number;
  }): Promise<CampaignsListResponse> => {
    const params = new URLSearchParams();
    
    if (filters?.status) params.append('status', filters.status);
    if (filters?.productId) params.append('productId', filters.productId.toString());
    if (filters?.page) params.append('page', filters.page.toString());
    if (filters?.limit) params.append('limit', filters.limit.toString());

    const response = await api.get(`${CAMPAIGNS_ENDPOINT}?${params}`);

    return {
      success: response.data.success,
      data: response.data.data ? objectToCamelCase(response.data.data) : [],
      message: response.data.message,
    };
  },

  // Get campaign by ID
  getCampaign: async (id: number): Promise<CampaignResponse> => {
    const response = await api.get(`${CAMPAIGNS_ENDPOINT}/${id}`);

    return {
      success: response.data.success,
      data: objectToCamelCase(response.data.data),
      message: response.data.message,
    };
  },

  // Get campaigns for a specific product
  getCampaignsByProduct: async (productId: number): Promise<CampaignsListResponse> => {
    const response = await api.get(`${CAMPAIGNS_ENDPOINT}/product/${productId}`);

    return {
      success: response.data.success,
      data: response.data.data ? objectToCamelCase(response.data.data) : [],
      message: response.data.message,
    };
  },

  // Join a campaign
  joinCampaign: async (
    campaignId: number,
    quantity: number,
    amount: number,
  ): Promise<CampaignResponse> => {
    const requestData = objectToSnakeCase({ quantity, amount });
    const response = await api.post(`${CAMPAIGNS_ENDPOINT}/${campaignId}/join`, requestData);

    return {
      success: response.data.success,
      data: objectToCamelCase(response.data.data),
      message: response.data.message,
    };
  },

  // Leave a campaign
  leaveCampaign: async (campaignId: number): Promise<CampaignResponse> => {
    const response = await api.delete(`${CAMPAIGNS_ENDPOINT}/${campaignId}/leave`);

    return {
      success: response.data.success,
      data: null,
      message: response.data.message,
    };
  },

  // Create a new campaign (for suppliers)
  createCampaign: async (campaignData: {
    name: string;
    description?: string;
    productId: number;
    targetQuantity: number;
    targetPrice: number;
    endDate: string;
  }): Promise<CampaignResponse> => {
    const mappedData = objectToSnakeCase(campaignData);
    const response = await api.post(CAMPAIGNS_ENDPOINT, mappedData);

    return {
      success: response.data.success,
      data: objectToCamelCase(response.data.data),
      message: response.data.message,
    };
  },

  // Update campaign (for suppliers)
  updateCampaign: async (
    campaignId: number,
    campaignData: Partial<{
      name: string;
      description: string;
      targetQuantity: number;
      targetPrice: number;
      endDate: string;
      status: string;
    }>,
  ): Promise<CampaignResponse> => {
    const mappedData = objectToSnakeCase(campaignData);
    const response = await api.patch(`${CAMPAIGNS_ENDPOINT}/${campaignId}`, mappedData);

    return {
      success: response.data.success,
      data: objectToCamelCase(response.data.data),
      message: response.data.message,
    };
  },

  // Delete campaign (for suppliers)
  deleteCampaign: async (campaignId: number): Promise<CampaignResponse> => {
    const response = await api.delete(`${CAMPAIGNS_ENDPOINT}/${campaignId}`);

    return {
      success: response.data.success,
      data: null,
      message: response.data.message,
    };
  },

  // Get user's campaign participations
  getUserCampaigns: async (): Promise<CampaignResponse> => {
    const response = await api.get(`${CAMPAIGNS_ENDPOINT}/me`);

    return {
      success: response.data.success,
      data: response.data.data ? objectToCamelCase(response.data.data) : [],
      message: response.data.message,
    };
  },
};
