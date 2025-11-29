import { TrackEventPayload, trackEvent as trackToDatabase } from '@/api/analytics';
import { analytics } from '@/firebase/firebase';
import { Product } from '@/types/products';
import { logEvent } from 'firebase/analytics';

/**
 * Firebase Analytics Service with Database Tracking
 *
 * Implements dual tracking:
 * - Firebase Analytics: For behavioral analytics and Google Analytics 4 integration
 * - Database: For real-time queryable data and supplier KPI dashboards
 *
 * @see https://firebase.google.com/docs/analytics/events
 * @see https://developers.google.com/analytics/devguides/collection/ga4/ecommerce
 */

// Only track events in production to avoid polluting analytics data
const isProduction = import.meta.env.PROD;

/**
 * Get or create a session ID for tracking user sessions
 * Session ID is stored in sessionStorage (persists for browser session)
 */
const getSessionId = (): string => {
  if (typeof window === 'undefined') return '';

  let sessionId = sessionStorage.getItem('analytics_session_id');

  if (!sessionId) {
    // Generate a unique session ID
    sessionId = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    sessionStorage.setItem('analytics_session_id', sessionId);
  }

  return sessionId;
};

/**
 * Track event to database
 * Sends event data to backend for storage and KPI calculations
 * Fire-and-forget: doesn't wait for response to avoid blocking user experience
 */
const trackToDb = (
  payload: Omit<TrackEventPayload, 'session_id' | 'user_agent' | 'page_url' | 'referrer'>,
) => {
  // Fire and forget - don't await
  trackToDatabase({
    ...payload,
    session_id: getSessionId(),
    user_agent: navigator.userAgent,
    page_url: window.location.href,
    referrer: document.referrer || undefined,
  }).catch((error) => {
    // Silently log errors to avoid disrupting user experience
    console.error('❌ Database tracking error:', error);
  });
};

// Check if debug mode is enabled (via URL param or localStorage)
const isDebugMode = () => {
  // Check URL parameter
  const urlParams = new URLSearchParams(window.location.search);
  const debugFromUrl = urlParams.get('debug_mode') === 'true';

  // Check localStorage (persisted from previous session)
  const debugFromStorage = localStorage.getItem('firebase_debug_mode') === 'true';

  return debugFromUrl || debugFromStorage;
};

// Enable debug mode if present in URL
if (typeof window !== 'undefined') {
  const urlParams = new URLSearchParams(window.location.search);
  if (urlParams.get('debug_mode') === 'true') {
    localStorage.setItem('firebase_debug_mode', 'true');
    console.log('🔍 Firebase Analytics Debug Mode ENABLED - Events will appear in DebugView');
    console.log('💡 To disable: localStorage.removeItem("firebase_debug_mode") and reload');
  }
}

/**
 * Generic event tracking wrapper
 */
const trackEvent = (eventName: string, params?: Record<string, any>) => {
  const debugMode = isDebugMode();

  if (!analytics) {
    console.warn('⚠️ Firebase Analytics not initialized');
    return;
  }

  // In development, only log to console unless debug mode is explicitly enabled
  if (!isProduction && !debugMode) {
    console.log('📊 [Analytics - Dev]:', eventName, params);
    return;
  }

  try {
    logEvent(analytics, eventName, params);
    if (debugMode) {
      console.log('🔍 [Analytics - Debug]:', eventName, params);
    } else {
      console.log('📊 [Analytics]:', eventName, params);
    }
  } catch (error) {
    console.error('❌ Analytics error:', error);
  }
};

/**
 * Track page views
 * Automatically called on route changes
 */
export const trackPageView = (pagePath: string, pageTitle?: string) => {
  trackEvent('page_view', {
    page_path: pagePath,
    page_title: pageTitle,
  });
};

/**
 * Track product detail page views
 * Standard GA4 e-commerce event: view_item
 */
export const trackProductView = (product: Product, userId?: number) => {
  // Firebase Analytics
  trackEvent('view_item', {
    currency: 'CLP',
    value: Number(product.precioUnitario),
    items: [
      {
        item_id: String(product.idProducto),
        item_name: product.nombreProducto,
        item_category: product.categoria?.nombre || 'Sin categoría',
        price: Number(product.precioUnitario),
        quantity: 1,
      },
    ],
  });

  // Database tracking
  trackToDb({
    tipo_evento: 'product_view',
    id_usuario: userId,
    id_proveedor: product.idProveedor,
    id_producto: product.idProducto,
    metadata: {
      product_name: product.nombreProducto,
      product_price: Number(product.precioUnitario),
      category: product.categoria?.nombre,
    },
  });
};

/**
 * Track adding products to cart
 * Standard GA4 e-commerce event: add_to_cart
 */
export const trackAddToCart = (product: Product, quantity: number, userId?: number) => {
  // Firebase Analytics
  trackEvent('add_to_cart', {
    currency: 'CLP',
    value: Number(product.precioUnitario) * quantity,
    items: [
      {
        item_id: String(product.idProducto),
        item_name: product.nombreProducto,
        item_category: product.categoria?.nombre || 'Sin categoría',
        price: Number(product.precioUnitario),
        quantity,
      },
    ],
  });

  // Database tracking
  trackToDb({
    tipo_evento: 'add_to_cart',
    id_usuario: userId,
    id_proveedor: product.idProveedor,
    id_producto: product.idProducto,
    metadata: {
      product_name: product.nombreProducto,
      product_price: Number(product.precioUnitario),
      quantity,
      value: Number(product.precioUnitario) * quantity,
    },
  });
};

/**
 * Track removing products from cart
 * Standard GA4 e-commerce event: remove_from_cart
 */
export const trackRemoveFromCart = (product: Product, quantity: number, userId?: number) => {
  // Firebase Analytics
  trackEvent('remove_from_cart', {
    currency: 'CLP',
    value: Number(product.precioUnitario) * quantity,
    items: [
      {
        item_id: String(product.idProducto),
        item_name: product.nombreProducto,
        item_category: product.categoria?.nombre || 'Sin categoría',
        price: Number(product.precioUnitario),
        quantity,
      },
    ],
  });

  // Database tracking
  trackToDb({
    tipo_evento: 'remove_from_cart',
    id_usuario: userId,
    id_proveedor: product.idProveedor,
    id_producto: product.idProducto,
    metadata: {
      product_name: product.nombreProducto,
      product_price: Number(product.precioUnitario),
      quantity,
      value: Number(product.precioUnitario) * quantity,
    },
  });
};

/**
 * Track supplier/provider profile views
 * Custom event for understanding supplier popularity
 */
export const trackSupplierProfileView = (
  supplierId: number,
  supplierName: string,
  productCount?: number,
  userId?: number,
) => {
  // Firebase Analytics
  trackEvent('view_supplier_profile', {
    supplier_id: String(supplierId),
    supplier_name: supplierName,
    product_count: productCount || 0,
  });

  // Database tracking
  trackToDb({
    tipo_evento: 'supplier_profile_view',
    id_usuario: userId,
    id_proveedor: supplierId,
    metadata: {
      supplier_name: supplierName,
      product_count: productCount,
    },
  });
};

/**
 * Track collective campaign views
 * Custom event for collective purchase engagement
 */
export const trackCampaignView = (
  campaignId: number,
  productId: number,
  productName: string,
  userId?: number,
  supplierId?: number,
) => {
  // Firebase Analytics
  trackEvent('view_campaign', {
    campaign_id: String(campaignId),
    product_id: String(productId),
    product_name: productName,
  });

  // Database tracking
  trackToDb({
    tipo_evento: 'campaign_view',
    id_usuario: userId,
    id_proveedor: supplierId,
    id_producto: productId,
    id_campana: campaignId,
    metadata: {
      product_name: productName,
    },
  });
};

/**
 * Track joining a collective campaign
 * Custom event for collective purchase participation
 */
export const trackCampaignJoin = (
  campaignId: number,
  productId: number,
  productName: string,
  quantity: number,
  targetPrice: number,
  userId?: number,
  supplierId?: number,
) => {
  // Firebase Analytics
  trackEvent('join_campaign', {
    campaign_id: String(campaignId),
    product_id: String(productId),
    product_name: productName,
    quantity,
    target_price: Number(targetPrice),
    currency: 'CLP',
  });

  // Database tracking
  trackToDb({
    tipo_evento: 'campaign_join',
    id_usuario: userId,
    id_proveedor: supplierId,
    id_producto: productId,
    id_campana: campaignId,
    metadata: {
      product_name: productName,
      quantity,
      target_price: Number(targetPrice),
    },
  });
};

/**
 * Track beginning checkout process
 * Standard GA4 e-commerce event: begin_checkout
 */
export const trackBeginCheckout = (cartValue: number, itemCount: number) => {
  trackEvent('begin_checkout', {
    currency: 'CLP',
    value: cartValue,
    item_count: itemCount,
  });
};

/**
 * Track completed purchases
 * Standard GA4 e-commerce event: purchase
 */
export const trackPurchase = (
  orderId: number,
  total: number,
  items: Array<{
    productId: number;
    productName: string;
    quantity: number;
    price: number;
  }>,
) => {
  trackEvent('purchase', {
    transaction_id: String(orderId),
    currency: 'CLP',
    value: total,
    items: items.map((item) => ({
      item_id: String(item.productId),
      item_name: item.productName,
      price: item.price,
      quantity: item.quantity,
    })),
  });
};

/**
 * Track search queries
 * Standard GA4 event: search
 */
export const trackSearch = (searchTerm: string, resultCount?: number) => {
  trackEvent('search', {
    search_term: searchTerm,
    result_count: resultCount,
  });
};

/**
 * Track user registration
 * Standard GA4 event: sign_up
 */
export const trackSignUp = (method = 'email') => {
  trackEvent('sign_up', {
    method,
  });
};

/**
 * Track user login
 * Standard GA4 event: login
 */
export const trackLogin = (method = 'email') => {
  trackEvent('login', {
    method,
  });
};

/**
 * Set user ID for cross-session tracking
 * Call this after successful authentication
 */
export const setAnalyticsUserId = (userId: number) => {
  if (!analytics || !isProduction) {
    console.log('📊 [Analytics - Dev]: Set user ID:', userId);
    return;
  }

  try {
    // Firebase Analytics will automatically associate future events with this user
    logEvent(analytics, 'login', {
      user_id: String(userId),
    });
    console.log('📊 [Analytics]: User ID set:', userId);
  } catch (error) {
    console.error('Analytics error setting user ID:', error);
  }
};

/**
 * Set user properties for segmentation
 * Call this to track user type (customer vs supplier)
 */
export const setUserProperties = (properties: {
  userType?: 'cliente' | 'proveedor' | 'both';
  supplierId?: number;
}) => {
  if (!analytics || !isProduction) {
    console.log('📊 [Analytics - Dev]: Set user properties:', properties);
    return;
  }

  try {
    logEvent(analytics, 'user_properties', {
      user_type: properties.userType,
      supplier_id: properties.supplierId ? String(properties.supplierId) : undefined,
    });
    console.log('📊 [Analytics]: User properties set:', properties);
  } catch (error) {
    console.error('Analytics error setting user properties:', error);
  }
};
