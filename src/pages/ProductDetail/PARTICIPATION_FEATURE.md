# User Campaign Participation Feature

## Overview

Successfully implemented a comprehensive feature that allows users to visually identify when they are already participating in collective campaigns for a product. The feature provides clear visual indicators and participation details across the ProductDetail page.

## ✨ Features Implemented

### 🎯 **Participation Detection**
- **Real-time Check**: Automatically detects if the current user is participating in any collective campaigns for the viewed product
- **User-Specific**: Only shows participation information for the authenticated user
- **Performance Optimized**: Uses existing campaign data to avoid additional API calls

### 🎨 **Visual Indicators**

#### **1. Participation Banner (Top of Page)**
When a user participates in campaigns for the current product:
- **Success Alert**: Green banner at the top of the page
- **Summary Information**: Shows number of campaigns participated in
- **Total Commitment**: Calculates and displays total monetary commitment across all campaigns
- **Navigation Hint**: Guides user to scroll down to see detailed campaign information

#### **2. Enhanced Campaign Cards**
Each campaign card now displays participation status:
- **Visual Distinction**: 
  - Participating campaigns have green borders instead of blue
  - Light green background tint for better visibility
  - Enhanced shadow effects with success colors
- **Participation Badge**: 
  - Animated "Participando" badge in top-left corner
  - Subtle pulse animation to draw attention
  - Green background with success icon
- **Participation Details**:
  - Shows user's committed quantity and amount
  - Success-colored text with check icon
  - Additional "Participando" chip in the status area

#### **3. Section Summary**
In the Compras Colectivas section:
- **Info Alert**: Shows count of campaigns the user is participating in
- **Clear Messaging**: Confirms user's participation status

### 🔧 **Technical Implementation**

#### **New Hook: `useUserCampaignParticipation`**
```typescript
const {
  isParticipatingInCampaign,
  getUserParticipationInCampaign,
  getParticipatedCampaigns,
  hasParticipations,
} = useUserCampaignParticipation(campaigns);
```

**Functions Provided:**
- `isParticipatingInCampaign(campaignId)`: Boolean check for specific campaign
- `getUserParticipationInCampaign(campaignId)`: Returns user's participation details
- `getParticipatedCampaigns()`: Array of all campaigns user participates in
- `hasParticipations`: Boolean indicating if user has any participations

#### **Enhanced Components**
- **CampaignCard**: Added participation props and visual enhancements
- **CollectiveCampaignsSection**: Integrated participation detection and summary
- **ProductDetail**: Added top-level participation banner with total commitment calculation

### 🎨 **Design Features**

#### **Color Scheme**
- **Participating Campaigns**: Success green (`theme.palette.success.main`)
- **Non-Participating Campaigns**: Primary blue (`theme.palette.primary.main`)
- **Backgrounds**: Subtle green tint for participating campaigns
- **Animations**: Pulse effect on participation badges

#### **Typography & Iconography**
- **Icons**: CheckCircle icon for participation indicators
- **Text Hierarchy**: Clear distinction between campaign info and participation details
- **Status Chips**: Multiple visual indicators (Active/Closed + Participando)

#### **Visual Hierarchy**
1. **Top Banner**: Immediate visibility of participation status
2. **Campaign Cards**: Individual campaign participation details
3. **Section Summary**: Quick overview within campaigns section

### 🚀 **User Experience Benefits**

#### **Immediate Recognition**
- Users instantly know if they're already committed to campaigns
- Clear visual distinction prevents confusion
- Reduces risk of duplicate participations

#### **Detailed Information**
- Shows exact commitment amount and quantity
- Displays total financial commitment across all campaigns
- Provides progress tracking for participated campaigns

#### **Navigation Assistance**
- Top banner guides users to relevant sections
- Clear messaging about where to find more details
- Intuitive visual flow from summary to details

#### **Responsive Design**
- Works on both desktop and mobile layouts
- Maintains visual hierarchy across screen sizes
- Preserves all functionality in refactored component structure

### 📊 **Data Integration**

#### **Leveraged Existing Data**
- Uses participant information already included in campaign responses
- No additional API calls required for basic participation detection
- Efficient use of existing `participantes` array in campaign objects

#### **User Identification**
- Matches participants by `id_usuario` with authenticated user's `idUsuario`
- Handles authentication state properly
- Graceful fallbacks when user is not authenticated

### 🔒 **Security & Privacy**

#### **User-Specific Display**
- Only shows participation information for the current user
- Respects privacy by not revealing other users' participation details
- Authentication-aware functionality

#### **Data Validation**
- Proper null/undefined checks for user and campaign data
- Safe array operations to prevent runtime errors
- Graceful handling of missing participation data

## 📱 **Implementation Files**

### **New Files**
- `hooks/useUserCampaignParticipation.ts` - Core participation logic

### **Enhanced Files**
- `components/CampaignCard.tsx` - Visual participation indicators
- `components/CollectiveCampaignsSection.tsx` - Section-level participation summary
- `ProductDetail.tsx` - Top-level participation banner
- `hooks/index.ts` - Export new hook

### **Key Props Added**
```typescript
interface CampaignCardProps {
  // ... existing props
  isUserParticipating?: boolean;
  userParticipation?: any;
}
```

## 🎯 **Success Metrics**

✅ **Visual Clarity**: Clear distinction between participating and non-participating campaigns  
✅ **User Awareness**: Immediate recognition of participation status  
✅ **Data Accuracy**: Precise calculation of commitments and quantities  
✅ **Performance**: No additional API calls, efficient data usage  
✅ **Responsive**: Works across all device sizes  
✅ **Accessibility**: Clear visual hierarchy and meaningful color usage  

## 🔄 **Future Enhancements**

### **Potential Additions**
- **Participation History**: Timeline of user's participation activities
- **Notification System**: Alerts for campaign progress updates
- **Quick Actions**: Direct buttons to modify participation from product page
- **Social Features**: Show friends' participation (with privacy controls)

### **Analytics Opportunities**
- Track user engagement with participation indicators
- Monitor conversion rates from participation visibility
- Measure user retention in campaigns with better visibility

The feature successfully transforms the product detail page from a simple information display into an intelligent, user-aware interface that enhances the collective purchasing experience through clear participation visibility and engagement indicators.