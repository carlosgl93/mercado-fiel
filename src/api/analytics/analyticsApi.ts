import api from '../api';

export interface TrackEventPayload {
  tipo_evento:
    | 'product_view'
    | 'add_to_cart'
    | 'remove_from_cart'
    | 'supplier_profile_view'
    | 'campaign_view'
    | 'campaign_join'
    | 'begin_checkout'
    | 'purchase'
    | 'search';
  id_usuario?: number;
  id_proveedor?: number;
  id_producto?: number;
  id_campana?: number;
  metadata?: Record<string, any>;
  session_id?: string;
  user_agent?: string;
  ip_address?: string;
  referrer?: string;
  page_url?: string;
}

export interface TrackEventResponse {
  success: boolean;
  id_evento: string;
}

export interface SupplierMetrics {
  profileViews: number;
  uniqueVisitors: number;
  productViews: number;
  cartAdditions: number;
  purchases: number;
  campaignJoins: number;
  addToCartRate: number;
  purchaseRate: number;
  overallConversionRate: number;
}

export interface SupplierOverviewResponse {
  supplierId: number;
  period: {
    startDate?: string;
    endDate?: string;
  };
  metrics: SupplierMetrics;
}

export interface ProductPerformance {
  id_producto: number;
  nombre_producto: string;
  precio_unitario: string;
  imagen_url: string | null;
  views: number;
  cartAdds: number;
  purchases: number;
  addToCartRate: number;
  conversionRate: number;
}

export interface ProductPerformanceResponse {
  supplierId: number;
  period: {
    startDate?: string;
    endDate?: string;
  };
  products: ProductPerformance[];
  totalProducts: number;
}

export interface TrendData {
  date: string;
  profileViews: number;
  productViews: number;
  cartAdditions: number;
  purchases: number;
  campaignJoins: number;
}

export interface SupplierTrendsResponse {
  supplierId: number;
  period: {
    startDate?: string;
    endDate?: string;
  };
  interval: 'hour' | 'day' | 'week' | 'month';
  trends: TrendData[];
}

/**
 * Track an analytics event in the database
 */
export const trackEvent = async (payload: TrackEventPayload): Promise<TrackEventResponse> => {
  const response = await api.post<TrackEventResponse>('/analytics/track', payload);
  return response.data;
};

/**
 * Get supplier KPI overview for a given date range
 */
export const getSupplierOverview = async (
  supplierId: number,
  startDate?: string,
  endDate?: string,
): Promise<SupplierOverviewResponse> => {
  const params = new URLSearchParams();
  if (startDate) params.append('startDate', startDate);
  if (endDate) params.append('endDate', endDate);

  const response = await api.get<SupplierOverviewResponse>(
    `/analytics/suppliers/${supplierId}/overview?${params.toString()}`,
  );
  return response.data;
};

/**
 * Get product performance metrics for a supplier
 */
export const getSupplierProducts = async (
  supplierId: number,
  startDate?: string,
  endDate?: string,
  limit?: number,
): Promise<ProductPerformanceResponse> => {
  const params = new URLSearchParams();
  if (startDate) params.append('startDate', startDate);
  if (endDate) params.append('endDate', endDate);
  if (limit) params.append('limit', limit.toString());

  const response = await api.get<ProductPerformanceResponse>(
    `/analytics/suppliers/${supplierId}/products?${params.toString()}`,
  );
  return response.data;
};

/**
 * Get time-series trends for a supplier
 */
export const getSupplierTrends = async (
  supplierId: number,
  startDate?: string,
  endDate?: string,
  interval: 'hour' | 'day' | 'week' | 'month' = 'day',
): Promise<SupplierTrendsResponse> => {
  const params = new URLSearchParams();
  if (startDate) params.append('startDate', startDate);
  if (endDate) params.append('endDate', endDate);
  params.append('interval', interval);

  const response = await api.get<SupplierTrendsResponse>(
    `/analytics/suppliers/${supplierId}/trends?${params.toString()}`,
  );
  return response.data;
};
