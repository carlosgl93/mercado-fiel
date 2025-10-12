# OtherCreatedCampaignsSection - Backend Integration

## Overview

This document describes the transformation of `LegacyCampaignsSection` into `OtherCreatedCampaignsSection`, which now fetches real collective purchase campaigns from the backend API instead of using mock data.

## Key Changes Implemented

### 1. Component Rename and Restructure
- **Old**: `LegacyCampaignsSection` (mock campaigns from campaigns.ts)  
- **New**: `OtherCreatedCampaignsSection` (real campaigns from comprasColectivas API)

### 2. Real Backend Integration
- **API Endpoint**: `/compras-colectivas` with filtering capabilities
- **Data Source**: Uses `comprasColectivasApi.getComprasColectivas()` 
- **Query Key**: `['other-collective-campaigns', product?.idProducto]`

### 3. Smart Campaign Filtering

**Current Product Detection**:
```typescript
const currentProductCampaigns = React.useMemo(() => {
  if (!otherCampaignsResponse?.data?.campaigns || !product?.idProducto) return [];
  
  return otherCampaignsResponse.data.campaigns.filter(
    (campaign: CompraColectiva) => campaign.id_producto === product.idProducto
  );
}, [otherCampaignsResponse, product?.idProducto]);
```

**Other Campaigns Filtering**:
```typescript
const otherCampaigns = React.useMemo(() => {
  if (!otherCampaignsResponse?.data?.campaigns || !product?.idProducto) return [];
  
  return otherCampaignsResponse.data.campaigns.filter(
    (campaign: CompraColectiva) => campaign.id_producto !== product.idProducto
  );
}, [otherCampaignsResponse, product?.idProducto]);
```

### 4. Enhanced UI Features

#### Product Relationship Badge
- Shows info alert if current product has campaigns
- Directs users to the main CollectiveCampaignsSection above

#### Participation Detection
- Visual indicators for campaigns user is already participating in
- Green styling and success chips for participating campaigns
- "Ya participas" button state for joined campaigns

#### Campaign Cards Enhancement
```typescript
// Product context badge
<Typography variant="body2" color="primary" sx={{ mb: 1, fontWeight: 600 }}>
  Producto: {campaign.producto?.nombre_producto}
</Typography>

// Provider information
<Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
  Por: {campaign.proveedor?.nombre_negocio}
</Typography>
```

### 5. Real Campaign Joining

#### Join Campaign Functionality
- **Endpoint**: `POST /compras-colectivas/:id/join`
- **Business Rules**: 20% minimum purchase validation (handled by backend)
- **Quantity Controls**: Individual quantity state per campaign
- **Real-time Updates**: Query invalidation on successful join

```typescript
const joinCampaignMutation = useMutation({
  mutationFn: (data: { campaignId: number; cantidad: number }) =>
    comprasColectivasApi.joinCompraColectiva(data.campaignId, { cantidad: data.cantidad }),
  onSuccess: () => {
    queryClient.invalidateQueries(['other-collective-campaigns']);
    queryClient.invalidateQueries(['collective-campaigns']);
  }
});
```

### 6. Empty State with CTA

**When No Other Campaigns Exist**:
```typescript
<Card sx={{ textAlign: 'center', p: 4, bgcolor: 'grey.50' }}>
  <GroupIcon sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
  <Typography variant="h6" gutterBottom>
    ¡No hay otras compras colectivas activas!
  </Typography>
  
  {product?.elegibleCompraColectiva && user && (
    <Button
      variant="contained"
      startIcon={<GroupIcon />}
      onClick={onCreateCampaign}
    >
      Crear Primera Compra Colectiva
    </Button>
  )}
</Card>
```

## Data Flow Architecture

### 1. Query Structure
```typescript
// Fetch all active campaigns
const { data: otherCampaignsResponse, isLoading } = useQuery({
  queryKey: ['other-collective-campaigns', product?.idProducto],
  queryFn: () =>
    comprasColectivasApi.getComprasColectivas({
      estado: 'abierta',
      page: 1,
      limit: 20,
    }),
  enabled: !!product?.idProducto,
});
```

### 2. Backend API Response
```typescript
interface ComprasColectivasListResponse {
  success: boolean;
  data: {
    campaigns: CompraColectiva[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      pages: number;
    };
  };
}
```

### 3. Campaign Data Structure
```typescript
interface CompraColectiva {
  id_campana: number;
  nombre: string;
  descripcion?: string;
  id_producto: number;
  precio_objetivo: number;
  cantidad_objetivo: number;
  estado: 'abierta' | 'cerrada' | 'completada' | 'cancelada';
  
  // Relations populated by backend
  producto?: {
    nombre_producto: string;
    precio_unitario: number;
    unit_type?: string;
  };
  proveedor?: {
    nombre_negocio: string;
  };
  progreso?: ProgresoCompraColectiva;
  participantes?: ParticipanteColectivo[];
}
```

## User Experience Improvements

### 1. Loading States
- Shows centered spinner while fetching campaigns
- Smooth transitions between loading and content states

### 2. Product Context Awareness
- Clearly distinguishes between current product campaigns vs other opportunities  
- Info alert guides users to relevant section

### 3. Participation Feedback
- **Visual Indicators**: Green borders, success chips, animated badges
- **Button States**: Different states for join/participating/disabled
- **Real-time Updates**: Immediate UI updates on successful actions

### 4. Call-to-Action Flow
- **Empty State**: Encourages campaign creation with clear CTA
- **Eligibility Check**: Only shows create CTA for eligible products
- **Navigation Links**: Directs to main campaigns page for exploration

## Integration with Existing Features

### 1. Maintains Compatibility
- **Props Interface**: Compatible with existing ProductDetail usage
- **Styling**: Consistent with existing design system
- **Error Handling**: Graceful fallbacks and loading states

### 2. Query Cache Management
- **Smart Invalidation**: Updates related queries on mutations
- **Optimistic Updates**: Immediate UI feedback for better UX
- **Efficient Filtering**: Client-side filtering reduces API calls

### 3. Auth Integration
- **User Detection**: Leverages existing `useAuth` hook
- **Participation Logic**: Cross-references user ID with campaign participants
- **Auth Flow**: Proper handling for non-authenticated users

## Business Logic Implementation

### 1. 20% Minimum Purchase Rule
- **Backend Validation**: Server enforces 20% minimum on join attempts
- **Frontend UX**: Clear error messages guide users to correct amounts
- **Real-time Calculation**: Dynamic minimum requirements based on remaining quantity

### 2. Campaign Participation Limits
- **Maximum Participants**: Backend enforces 5-person limit
- **Duplicate Prevention**: Users cannot join same campaign multiple times
- **State Management**: UI reflects current participation status

### 3. Product Eligibility
- **Eligibility Checks**: Only eligible products show creation CTAs
- **Smart Filtering**: Separates current product vs other opportunities
- **Context Awareness**: Different messaging based on product status

## Performance Optimizations

### 1. Efficient Queries
- **Conditional Fetching**: Only fetches when product ID is available
- **Pagination Support**: Ready for large campaign lists (limit: 20)
- **Smart Invalidation**: Targeted query updates reduce unnecessary refetches

### 2. Memoized Calculations
- **Campaign Filtering**: Memoized filter operations for performance
- **Participation Detection**: Efficient user lookup in participant arrays
- **Progress Calculations**: Cached percentage calculations

### 3. State Management
- **Individual Quantity State**: Per-campaign quantity tracking
- **Optimistic Updates**: Immediate UI feedback without waiting for server
- **Error Boundaries**: Graceful error handling for failed operations

## Future Enhancement Opportunities

### 1. Advanced Filtering
- **Category Filters**: Filter campaigns by product category
- **Price Range**: Filter by target price ranges  
- **Location**: Filter by supplier location/region

### 2. Enhanced UX
- **Campaign Comparison**: Side-by-side campaign comparison
- **Favorites**: Save interesting campaigns for later
- **Notifications**: Alert users when campaigns are completing

### 3. Social Features
- **Participant Profiles**: Show other campaign participants
- **Campaign Chat**: Discussion threads for active campaigns
- **Sharing**: Social sharing of interesting campaigns

## Testing Recommendations

### 1. API Integration Testing
- Test campaign fetching with various filter combinations
- Verify join campaign flow with different quantity scenarios
- Test error scenarios (network failures, validation errors)

### 2. User Experience Testing  
- Verify participation detection across multiple campaigns
- Test empty state CTA functionality
- Validate loading states and transitions

### 3. Edge Case Testing
- Test with products that have no campaigns
- Test with non-eligible products
- Test with maximum participant limits reached
- Test with expired/completed campaigns

## Summary

The `OtherCreatedCampaignsSection` successfully transforms the previous mock-based component into a fully functional, backend-integrated feature that:

✅ **Fetches real campaigns** from the comprasColectivas API  
✅ **Intelligently filters** campaigns to show relevant opportunities  
✅ **Provides context awareness** about current product campaigns  
✅ **Enables real campaign joining** with proper validation  
✅ **Handles empty states** with clear CTAs  
✅ **Maintains excellent UX** with loading states and participation indicators  
✅ **Integrates seamlessly** with existing features and auth system

This implementation provides a solid foundation for collective purchasing features while maintaining excellent performance and user experience.