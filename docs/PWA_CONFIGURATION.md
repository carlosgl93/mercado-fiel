# PWA Configuration - Mercado Fiel

## Overview

Mercado Fiel is configured as a Progressive Web App (PWA) using `vite-plugin-pwa` with Workbox for service worker management and caching strategies.

## Configuration Files

### 1. Vite Configuration (`vite.config.mjs`)

```javascript
VitePWA({
  registerType: 'autoUpdate',
  manifest,
  includeAssets: ['favicon.svg', 'favicon.ico', 'robots.txt', 'apple-touch-icon.png'],
  devOptions: {
    enabled: false, // Disabled in development to avoid conflicts
  },
  workbox: {
    globPatterns: ['**/*.{js,css,html}', '**/*.{svg,png,jpg,gif}'],
    runtimeCaching: [
      {
        // Supabase REST API
        urlPattern: ({ url }) => url.origin === 'https://xnehuzmpesnelhdboijy.supabase.co',
        handler: 'NetworkOnly',
        options: {
          cacheName: 'supabase-api-cache',
        },
      },
      {
        // Other Supabase domains (Auth, Storage, etc.)
        urlPattern: ({ url }) => url.href.includes('.supabase.co'),
        handler: 'NetworkOnly',
        options: {
          cacheName: 'supabase-external-cache',
        },
      },
    ],
  },
})
```

### 2. Web App Manifest (`manifest.json`)

The manifest defines how the app appears when installed:

```json
{
  "name": "Mercado Fiel",
  "short_name": "MercadoFiel",
  "description": "Plataforma de servicios para el hogar",
  "theme_color": "#4CAF4F",
  "background_color": "#F6F6F4",
  "display": "standalone",
  "start_url": "/",
  "scope": "/"
}
```

## Service Worker Strategy

### Caching Policies

1. **Static Assets**: Precached (JS, CSS, HTML, images)
2. **External APIs**: NetworkOnly (no caching for real-time data)
3. **App Shell**: Cached for offline functionality

### Runtime Caching Configuration

#### Supabase APIs - NetworkOnly Strategy

All Supabase API calls use `NetworkOnly` strategy because:

- **Authentication**: Tokens and sessions need real-time validation
- **Database**: Data consistency requires fresh responses
- **Storage**: File operations need immediate feedback
- **Real-time**: Subscriptions require live connections

This prevents the Workbox console warnings about uncached routes while ensuring data freshness.

## Service Worker Management

### Auto-Update Component (`src/sections/SW/SW.tsx`)

```typescript
const {
  offlineReady: [offlineReady, setOfflineReady],
  needRefresh: [needRefresh, setNeedRefresh],
  updateServiceWorker,
} = useRegisterSW();
```

#### Update Process

1. **Detection**: New SW version detected automatically
2. **Notification**: User informed via snackbar notification
3. **Update**: Manual trigger by user action
4. **Cache Clear**: All caches cleared during update
5. **Reload**: Page refreshed with new version

### Cache Management

```javascript
// Cache clearing during updates
caches.keys().then((cacheNames) => {
  cacheNames.forEach((cacheName) => {
    caches.delete(cacheName);
  });
}).then(() => {
  window.location.reload();
});
```

## Installation Experience

### Desktop Installation

- **Chrome**: Install button in address bar
- **Edge**: Install app option in menu
- **Safari**: Add to Dock option

### Mobile Installation

- **iOS Safari**: "Add to Home Screen" in share menu
- **Android Chrome**: Install prompt or "Add to Home Screen"

## Development vs Production

### Development

- Service Worker disabled (`devOptions.enabled: false`)
- No caching to allow live reload
- Console warnings about PWA features expected

### Production

- Service Worker fully active
- Caching strategies applied
- Update notifications enabled
- Offline functionality available

## Troubleshooting

### Common Issues

1. **Workbox Route Warnings**
   - **Issue**: "No route found for: https://...supabase.co/..."
   - **Solution**: External APIs configured with `NetworkOnly` strategy
   - **Prevention**: Add new external domains to `runtimeCaching`

2. **Update Not Working**
   - **Issue**: New version not detected
   - **Solution**: Clear browser cache and hard refresh
   - **Prevention**: Ensure `registerType: 'autoUpdate'` is set

3. **Offline Functionality**
   - **Issue**: App not working offline
   - **Solution**: Check if critical assets are precached
   - **Prevention**: Update `globPatterns` for new asset types

### Console Debugging

```javascript
// Check service worker status
navigator.serviceWorker.ready.then(registration => {
  console.log('SW Ready:', registration);
});

// Check cache contents
caches.keys().then(names => {
  console.log('Cache names:', names);
});
```

## Best Practices

### Performance

1. **Minimize Precache**: Only include critical assets
2. **Network First**: Use for API calls requiring fresh data
3. **Cache First**: Use for static assets that rarely change
4. **Stale While Revalidate**: Use for non-critical data

### User Experience

1. **Update Notifications**: Inform users about new versions
2. **Offline Indicators**: Show when app is offline
3. **Cache Clearing**: Provide manual cache clear option
4. **Installation Prompts**: Guide users through installation

### Security

1. **HTTPS Required**: PWA features require secure origin
2. **Scope Limitations**: Keep service worker scope minimal
3. **Cache Validation**: Don't cache sensitive data
4. **Update Frequency**: Regular service worker updates

## Monitoring

### Metrics to Track

- **Installation Rate**: Users installing the PWA
- **Update Success**: Service worker update completion
- **Offline Usage**: App usage without network
- **Cache Hit Rate**: Effectiveness of caching strategy

### Tools

- **Chrome DevTools**: Application tab for PWA inspection
- **Lighthouse**: PWA audit and recommendations
- **Workbox Wizard**: Visual debugging for service workers
- **Firebase Analytics**: Custom events for PWA metrics

## Future Enhancements

### Planned Features

1. **Background Sync**: Offline data synchronization
2. **Push Notifications**: Real-time user engagement
3. **Advanced Caching**: Intelligent cache strategies
4. **Offline Queue**: Queue API calls when offline

### Configuration Updates

When adding new external services, update the `runtimeCaching` array in `vite.config.mjs`:

```javascript
{
  urlPattern: ({ url }) => url.origin === 'https://new-api-domain.com',
  handler: 'NetworkFirst', // or appropriate strategy
  options: {
    cacheName: 'new-api-cache',
  },
}
```
