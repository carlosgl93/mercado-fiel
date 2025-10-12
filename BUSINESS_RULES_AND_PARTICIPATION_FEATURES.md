# Business Rules and Participation Detection Features

## Overview

This document describes the implementation of two key features for the collective purchase (compras colectivas) system:

1. **20% Minimum Purchase Business Rule**: Users must buy at least 20% of the remaining quantity in a collective campaign
2. **User Participation Detection**: Visual indicators showing when users are already participating in collective campaigns

## Features Implemented

### 1. 20% Minimum Purchase Business Rule

#### Description
When joining a collective campaign, users must commit to purchasing at least 20% of the remaining quantity to participate. This rule ensures meaningful participation and helps campaigns reach their goals more efficiently.

#### Implementation Details

**File**: `src/components/JoinCampaignModal/JoinCampaignModal.tsx`

**Key Changes**:
- Calculate 20% minimum based on remaining quantity: `Math.ceil(remaining * 0.2)`
- Use the higher value between campaign minimum and 20% requirement: `Math.max(campaign.minimum_purchase || 1, minimumRequired20Percent)`
- Default quantity input is set to the effective minimum
- Validation in `handleSubmit()` prevents joining with less than 20%
- Clear error messages inform users about the requirement
- Warning alert explains the 20% rule to users

**Business Logic**:
```typescript
const remaining = campaign.cantidad_objetivo - currentTotal;
const minimumRequired20Percent = Math.ceil(remaining * 0.2);
const effectiveMinimum = Math.max(campaign.minimum_purchase || 1, minimumRequired20Percent);
```

**User Experience**:
- Input field shows the effective minimum requirement
- Helper text displays: "Mínimo requerido: X unidades (20% del restante)"
- Warning alert explains the rule before user commits
- Clear error messages if user tries to enter less than required

### 2. User Participation Detection

#### Description
Visual indicators throughout the UI show when the current user is already participating in collective campaigns, providing clear feedback about their involvement status.

#### Implementation Details

**A. Core Hook**: `src/pages/ProductDetail/hooks/useUserCampaignParticipation.ts`
- Detects user participation across multiple campaigns
- Returns participation details including amounts and quantities
- Efficient filtering using existing campaign data

**B. Product Detail Page Enhancements**: `src/pages/ProductDetail/ProductDetail.tsx`
- Top-level participation banner with total commitment calculation
- Success alert shows participation summary when user has active participations

**C. Campaign Card Enhancements**: `src/pages/ProductDetail/components/CampaignCard.tsx`
- Green border and enhanced styling for participating campaigns
- Animated "Participando" badge with pulse effect
- User's contribution details (quantity and amount)
- Success-themed color scheme for participating campaigns

**D. Collective Campaigns Section**: `src/pages/ProductDetail/components/CollectiveCampaignsSection.tsx`
- Info alert showing participation count
- Passes participation status to individual campaign cards

**E. ComprasColectivas Page**: `src/pages/ComprasColectivas/ComprasColectivas.tsx`
- Proper user ID passing to participation detection
- Enhanced CollectivePurchaseCard with participation indicators

**F. CollectivePurchaseCard Enhancements**: `src/components/CollectivePurchaseCard/CollectivePurchaseCard.tsx`
- Participation badge at top of card
- User participation details box with contribution information
- Enhanced button states showing participation status and amount
- Green-themed styling for participating campaigns

## Visual Design Elements

### Participation Indicators
- **Colors**: Success green (`theme.palette.success.main`)
- **Icons**: CheckCircle for participation status
- **Animations**: Pulse effect on participation badges
- **Styling**: Enhanced shadows and borders for participating campaigns

### 20% Rule Interface
- **Alert Type**: Warning severity for rule explanation
- **Input Validation**: Real-time error messages
- **Helper Text**: Clear minimum requirements display
- **Default Values**: Automatically set to effective minimum

## User Experience Flow

### Joining a Campaign
1. User opens Join Campaign Modal
2. Warning alert explains 20% minimum rule
3. Input field defaults to 20% of remaining quantity (or campaign minimum if higher)
4. Helper text shows clear minimum requirements
5. Validation prevents submission below minimum
6. Clear error messages guide user to correct input

### Viewing Campaigns as Participant
1. **Product Detail Page**: Success banner shows total participation summary
2. **Campaign Cards**: Green styling, participation badges, and contribution details
3. **Campaign List**: "Participando" button shows commitment amount
4. **ComprasColectivas Page**: Clear participation indicators on all campaign cards

## Technical Implementation Notes

### Data Sources
- Uses existing campaign `participantes` arrays (no additional API calls)
- Leverages `useAuth` hook for current user identification
- Efficient client-side filtering and calculations

### Performance Considerations
- Calculations performed only when needed
- Memoization through React hooks
- Minimal re-renders with efficient dependency arrays

### Type Safety
- Proper TypeScript interfaces for participation data
- Correct property names: `cantidad`, `monto_aportado`
- Strong typing for all calculation functions

## Business Impact

### 20% Rule Benefits
- Ensures meaningful participation commitments
- Accelerates campaign completion
- Reduces partial participation that doesn't move campaigns forward
- Creates more engaging collective buying experience

### Participation Detection Benefits  
- Reduces user confusion about their involvement
- Prevents duplicate participation attempts
- Provides clear status feedback across all interfaces
- Enhances user engagement with visual recognition

## Testing Recommendations

1. **20% Rule Testing**:
   - Verify minimum calculation with various remaining quantities
   - Test edge cases (campaigns near completion)
   - Validate error messages and user guidance
   - Ensure proper handling when campaign minimum > 20%

2. **Participation Detection Testing**:
   - Test with users having multiple participations
   - Verify visual indicators across all interfaces
   - Confirm correct participation amounts and quantities
   - Test with users having no participations

3. **Integration Testing**:
   - End-to-end campaign joining flow
   - Visual consistency across all components
   - Performance with multiple campaigns and participants

## Future Enhancements

- **Dynamic Percentage**: Make the 20% rule configurable per campaign
- **Progress Notifications**: Alert users when their campaigns near completion
- **Participation History**: Show historical participation across all campaigns
- **Enhanced Analytics**: Track rule effectiveness and user engagement