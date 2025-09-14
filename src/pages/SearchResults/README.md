# SearchResults Page - Modular Architecture

This page has been refactored to be more modular, maintainable, and readable.

## Directory Structure

```
src/pages/SearchResults/
├── SearchResults.tsx           # Main component
├── index.ts                   # Export file
├── components/                # Reusable components
│   ├── index.ts              # Components export file
│   ├── SupplierCard.tsx      # Individual supplier card
│   ├── ClientCard.tsx        # Individual client card
│   ├── SearchFiltersModal.tsx # Filters modal/dialog
│   └── EmptyState.tsx        # Empty state when no results
└── hooks/                    # Custom hooks
    └── useSearchLogic.ts     # Search logic hook
```

## Key Features

### 🔍 **Debounced Search**
- Search input uses a 300ms debounce to prevent excessive API calls
- Implemented via custom `useDebounce` hook in `/src/hooks/useDebounce.ts`

### 🎯 **Advanced Filters**
- Modal-based filters interface
- Support for category, region, and comuna filtering
- Visual active filters count badge
- Filter chips with individual remove functionality
- Filters persist in URL parameters

### 🧩 **Modular Components**
- **SupplierCard**: Reusable component for displaying supplier information
- **ClientCard**: Reusable component for displaying client information  
- **SearchFiltersModal**: Full-featured filters dialog with form validation
- **EmptyState**: User-friendly empty state with contextual messages

### 🎣 **Custom Hooks**
- **useSearchLogic**: Centralizes all search-related state and API calls
- **useDebounce**: Provides debouncing functionality for better UX

## Component Props & Interfaces

### SearchFilters Interface
```typescript
interface SearchFilters {
  searchTerm: string;
  category: string;
  region: string;
  comuna: string;
}
```

### SupplierCard Props
```typescript
interface SupplierCardProps {
  supplier: Supplier;
  onSupplierClick: (supplierId: number) => void;
}
```

### ClientCard Props
```typescript
interface ClientCardProps {
  client: User;
  onClientClick: (clientId: number) => void;
}
```

### SearchFiltersModal Props
```typescript
interface SearchFiltersModalProps {
  open: boolean;
  onClose: () => void;
  filters: SearchFilters;
  onFiltersChange: (filters: SearchFilters) => void;
  searchType: number; // 0 = providers, 1 = clients
}
```

## Benefits of This Architecture

1. **Maintainability**: Each component has a single responsibility
2. **Reusability**: Components can be reused in other parts of the app
3. **Testability**: Each component can be tested independently
4. **Performance**: Debounced search reduces API calls
5. **User Experience**: Professional filters interface with visual feedback
6. **Type Safety**: Full TypeScript support with proper interfaces
7. **Scalability**: Easy to extend with new filter types or card variants

## Usage

The main SearchResults component can be imported and used as before:

```typescript
import SearchResults from '@/pages/SearchResults';

// In your router
<Route path="/buscar" element={<SearchResults />} />
```

Individual components can also be imported separately:

```typescript
import { SupplierCard, ClientCard, SearchFiltersModal } from '@/pages/SearchResults/components';
```

## Customization

### Adding New Filter Types
1. Update the `SearchFilters` interface
2. Add the new filter to `SearchFiltersModal.tsx`
3. Update the API calls in `useSearchLogic.ts`

### Adding New Card Types
1. Create a new component in the `components/` directory
2. Export it from `components/index.ts`
3. Use it in the main SearchResults component

### Modifying Debounce Timing
Update the delay value in `useSearchLogic.ts`:

```typescript
const debouncedSearchTerm = useDebounce(filters.searchTerm, 500); // Change from 300ms to 500ms
```
