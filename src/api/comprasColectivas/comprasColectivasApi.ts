import {
  CompraColectivaActionResponse,
  CompraColectivaFilters,
  CompraColectivaResponse,
  ComprasColectivasListResponse,
  CreateCompraColectivaRequest,
  JoinCompraColectivaRequest,
  ProductDiscountsResponse,
  UpdateCompraColectivaRequest,
} from '@/types/api/comprasColectivas';
import api from '../api';

const COMPRAS_COLECTIVAS_ENDPOINT = '/compras-colectivas';

export const comprasColectivasApi = {
  // Get all campaigns
  getComprasColectivas: async (
    filters?: CompraColectivaFilters,
  ): Promise<ComprasColectivasListResponse> => {
    const params = new URLSearchParams();

    if (filters?.page) params.append('page', filters.page.toString());
    if (filters?.limit) params.append('limit', filters.limit.toString());
    if (filters?.estado) params.append('estado', filters.estado);
    if (filters?.id_producto) params.append('id_producto', filters.id_producto.toString());
    if (filters?.id_proveedor) params.append('id_proveedor', filters.id_proveedor.toString());

    const response = await api.get(`${COMPRAS_COLECTIVAS_ENDPOINT}?${params.toString()}`);
    return response.data;
  },

  // Get campaign by ID
  getCompraColectiva: async (id: number): Promise<CompraColectivaResponse> => {
    const response = await api.get(`${COMPRAS_COLECTIVAS_ENDPOINT}/${id}`);
    return response.data;
  },

  // Create new campaign
  createCompraColectiva: async (
    data: CreateCompraColectivaRequest,
  ): Promise<CompraColectivaResponse> => {
    const response = await api.post(COMPRAS_COLECTIVAS_ENDPOINT, data);
    return response.data;
  },

  // Update campaign
  updateCompraColectiva: async (
    id: number,
    data: UpdateCompraColectivaRequest,
  ): Promise<CompraColectivaResponse> => {
    const response = await api.put(`${COMPRAS_COLECTIVAS_ENDPOINT}/${id}`, data);
    return response.data;
  },

  // Cancel/Delete campaign
  deleteCompraColectiva: async (id: number): Promise<CompraColectivaActionResponse> => {
    const response = await api.delete(`${COMPRAS_COLECTIVAS_ENDPOINT}/${id}`);
    return response.data;
  },

  // Join campaign
  joinCompraColectiva: async (
    id: number,
    data: JoinCompraColectivaRequest,
  ): Promise<CompraColectivaActionResponse> => {
    const response = await api.post(`${COMPRAS_COLECTIVAS_ENDPOINT}/${id}/join`, data);
    return response.data;
  },

  // Leave campaign
  leaveCompraColectiva: async (id: number): Promise<CompraColectivaActionResponse> => {
    const response = await api.delete(`${COMPRAS_COLECTIVAS_ENDPOINT}/${id}/leave`);
    return response.data;
  },

  // Get campaigns where user is creator
  getMyCreatedCampaigns: async (filters?: {
    page?: number;
    limit?: number;
  }): Promise<ComprasColectivasListResponse> => {
    const params = new URLSearchParams();

    if (filters?.page) params.append('page', filters.page.toString());
    if (filters?.limit) params.append('limit', filters.limit.toString());

    const response = await api.get(
      `${COMPRAS_COLECTIVAS_ENDPOINT}/my-created?${params.toString()}`,
    );
    return response.data;
  },

  // Get campaigns where user is participant (but not creator)
  getMyParticipatedCampaigns: async (filters?: {
    page?: number;
    limit?: number;
  }): Promise<ComprasColectivasListResponse> => {
    const params = new URLSearchParams();

    if (filters?.page) params.append('page', filters.page.toString());
    if (filters?.limit) params.append('limit', filters.limit.toString());

    const response = await api.get(
      `${COMPRAS_COLECTIVAS_ENDPOINT}/my-participated?${params.toString()}`,
    );
    return response.data;
  },

  // 🆕 Get available quantity discounts for a product
  getProductDiscounts: async (productId: number): Promise<ProductDiscountsResponse> => {
    const response = await api.get(`${COMPRAS_COLECTIVAS_ENDPOINT}/product/${productId}/discounts`);
    return response.data;
  },
};