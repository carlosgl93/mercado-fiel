# Stock Management API Documentation

Base URL: `https://your-firebase-url/stock`

## Table of Contents

- [Stock Movements](#stock-movements)
- [Stock Alerts](#stock-alerts)
- [Stock Reservations](#stock-reservations)
- [WhatsApp Integration](#whatsapp-integration)
- [Analytics](#analytics)

---

## Stock Movements

### GET /movements

Get stock movements with filtering and pagination.

**Query Parameters:**
- `product_id` (optional): Filter by product ID
- `tipo_movimiento` (optional): Filter by movement type
  - `ENTRADA_COMPRA`
  - `ENTRADA_DEVOLUCION`
  - `ENTRADA_AJUSTE`
  - `ENTRADA_REABASTECIMIENTO`
  - `SALIDA_VENTA`
  - `SALIDA_DEVOLUCION`
  - `SALIDA_AJUSTE`
  - `SALIDA_MERMA`
- `fecha_desde` (optional): Start date (ISO 8601)
- `fecha_hasta` (optional): End date (ISO 8601)
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 20)

**Response:**
```json
{
  "movements": [
    {
      "id_movimiento": 1,
      "id_producto": 15,
      "tipo_movimiento": "ENTRADA_REABASTECIMIENTO",
      "cantidad": 50,
      "stock_previo": 10,
      "stock_resultante": 60,
      "metodo_registro": "MANUAL",
      "observaciones": "Reabastecimiento mensual",
      "fecha_movimiento": "2024-01-15T10:30:00Z",
      "producto": {
        "nombre_producto": "Camomila Premium",
        "imagen_url": "https://..."
      }
    }
  ],
  "total": 150,
  "page": 1,
  "totalPages": 8
}
```

### POST /movements

Create a new stock movement.

**Request Body:**
```json
{
  "id_producto": 15,
  "tipo_movimiento": "ENTRADA_REABASTECIMIENTO",
  "cantidad": 50,
  "metodo_registro": "MANUAL",
  "observaciones": "Reabastecimiento mensual",
  "id_usuario": 1
}
```

**Response:**
```json
{
  "movement": {
    "id_movimiento": 123,
    "id_producto": 15,
    "tipo_movimiento": "ENTRADA_REABASTECIMIENTO",
    "cantidad": 50,
    "stock_previo": 10,
    "stock_resultante": 60,
    "metodo_registro": "MANUAL",
    "observaciones": "Reabastecimiento mensual",
    "fecha_movimiento": "2024-01-15T10:30:00Z"
  }
}
```

---

## Stock Alerts

### GET /alerts

Get stock alerts with filtering and pagination.

**Query Parameters:**
- `product_id` (optional): Filter by product ID
- `tipo_alerta` (optional): Filter by alert type
  - `STOCK_BAJO`
  - `STOCK_AGOTADO`
  - `STOCK_EXCEDIDO`
  - `VENCIMIENTO_PROXIMO`
- `resuelta` (optional): Filter by resolution status (boolean)
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 20)

**Response:**
```json
{
  "alerts": [
    {
      "id_alerta": 5,
      "id_producto": 15,
      "tipo_alerta": "STOCK_BAJO",
      "stock_actual": 8,
      "stock_minimo": 10,
      "mensaje": "Stock por debajo del mínimo",
      "resuelta": false,
      "fecha_alerta": "2024-01-15T10:30:00Z",
      "producto": {
        "nombre_producto": "Camomila Premium",
        "imagen_url": "https://..."
      }
    }
  ],
  "total": 25,
  "page": 1,
  "totalPages": 2
}
```

### PATCH /alerts/:id/resolve

Mark an alert as resolved.

**URL Parameters:**
- `id`: Alert ID

**Request Body:**
```json
{
  "observaciones_resolucion": "Stock reabastecido"
}
```

**Response:**
```json
{
  "id_alerta": 5,
  "resuelta": true,
  "fecha_resolucion": "2024-01-15T11:00:00Z",
  "observaciones_resolucion": "Stock reabastecido"
}
```

---

## Stock Reservations

### GET /reservations

Get stock reservations with filtering.

**Query Parameters:**
- `product_id` (optional): Filter by product ID
- `estado_reserva` (optional): Filter by state
  - `ACTIVA`
  - `COMPLETADA`
  - `CANCELADA`
  - `EXPIRADA`
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 20)

**Response:**
```json
{
  "reservations": [
    {
      "id_reserva": 10,
      "id_producto": 15,
      "id_pedido": 50,
      "cantidad_reservada": 5,
      "estado_reserva": "ACTIVA",
      "fecha_expiracion": "2024-01-20T10:30:00Z",
      "fecha_reserva": "2024-01-15T10:30:00Z",
      "producto": {
        "nombre_producto": "Camomila Premium"
      }
    }
  ],
  "total": 30,
  "page": 1,
  "totalPages": 2
}
```

### POST /reservations

Create a stock reservation.

**Request Body:**
```json
{
  "id_producto": 15,
  "cantidad_reservada": 5,
  "id_pedido": 50,
  "duracion_horas": 24
}
```

**Response:**
```json
{
  "reservation": {
    "id_reserva": 11,
    "id_producto": 15,
    "id_pedido": 50,
    "cantidad_reservada": 5,
    "estado_reserva": "ACTIVA",
    "fecha_expiracion": "2024-01-16T10:30:00Z",
    "fecha_reserva": "2024-01-15T10:30:00Z"
  },
  "available_stock": 55
}
```

### PATCH /reservations/:id/release

Release or cancel a reservation.

**URL Parameters:**
- `id`: Reservation ID

**Request Body:**
```json
{
  "nuevo_estado": "COMPLETADA"
}
```

**Response:**
```json
{
  "id_reserva": 11,
  "estado_reserva": "COMPLETADA",
  "fecha_liberacion": "2024-01-15T12:00:00Z"
}
```

---

## WhatsApp Integration

### GET /whatsapp/webhook

Webhook verification endpoint for WhatsApp.

**Query Parameters:**
- `hub.mode`: Must be "subscribe"
- `hub.verify_token`: Must match WHATSAPP_VERIFY_TOKEN
- `hub.challenge`: Challenge string to echo back

**Response:**
Returns the `hub.challenge` value if verification succeeds.

### POST /whatsapp/webhook

Receive WhatsApp messages.

**Request Body:**
Webhook payload from Meta WhatsApp API.

**Response:**
```json
200 OK
```

### GET /whatsapp/config

Get WhatsApp configurations.

**Query Parameters:**
- `provider_id` (optional): Filter by provider ID

**Response:**
```json
{
  "configs": [
    {
      "id_config": 1,
      "id_proveedor": 5,
      "numero_whatsapp": "+56912345678",
      "nombre_contacto": "Provider Name",
      "notificar_stock_bajo": true,
      "notificar_ventas": true,
      "horario_notificaciones_inicio": "09:00:00",
      "horario_notificaciones_fin": "18:00:00",
      "activo": true,
      "fecha_creacion": "2024-01-01T10:00:00Z",
      "proveedor": {
        "nombre_negocio": "Provider Business"
      }
    }
  ]
}
```

### POST /whatsapp/config

Create WhatsApp configuration.

**Request Body:**
```json
{
  "id_proveedor": 5,
  "numero_whatsapp": "+56912345678",
  "nombre_contacto": "Provider Name",
  "notificar_stock_bajo": true,
  "notificar_ventas": true,
  "horario_notificaciones_inicio": "09:00",
  "horario_notificaciones_fin": "18:00",
  "activo": true
}
```

**Response:**
```json
{
  "id_config": 2,
  "id_proveedor": 5,
  "numero_whatsapp": "+56912345678",
  "nombre_contacto": "Provider Name",
  "activo": true,
  "fecha_creacion": "2024-01-15T10:30:00Z"
}
```

### PATCH /whatsapp/config/:id

Update WhatsApp configuration.

**URL Parameters:**
- `id`: Config ID

**Request Body:**
```json
{
  "activo": false,
  "notificar_stock_bajo": false
}
```

**Response:**
```json
{
  "id_config": 2,
  "activo": false,
  "notificar_stock_bajo": false,
  "fecha_actualizacion": "2024-01-15T11:00:00Z"
}
```

---

## Analytics

### GET /analytics/product/:id

Get comprehensive analytics for a product.

**URL Parameters:**
- `id`: Product ID

**Query Parameters:**
- `fecha_desde` (optional): Start date (ISO 8601)
- `fecha_hasta` (optional): End date (ISO 8601)

**Response:**
```json
{
  "product": {
    "id_producto": 15,
    "nombre_producto": "Camomila Premium",
    "stock_actual": 60,
    "stock_minimo": 10,
    "stock_maximo": 100
  },
  "stock_status": {
    "current_stock": 60,
    "reserved_stock": 5,
    "available_stock": 55,
    "stock_percentage": 60.0,
    "is_low_stock": false,
    "days_until_stockout": 30
  },
  "movement_stats": {
    "by_type": [
      {
        "tipo_movimiento": "ENTRADA_REABASTECIMIENTO",
        "_sum": { "cantidad": 150 },
        "_count": { "_all": 5 }
      },
      {
        "tipo_movimiento": "SALIDA_VENTA",
        "_sum": { "cantidad": 100 },
        "_count": { "_all": 20 }
      }
    ]
  },
  "recent_movements": [
    {
      "id_movimiento": 123,
      "tipo_movimiento": "ENTRADA_REABASTECIMIENTO",
      "cantidad": 50,
      "fecha_movimiento": "2024-01-15T10:30:00Z"
    }
  ],
  "active_reservations": {
    "_sum": { "cantidad_reservada": 5 },
    "_count": { "_all": 2 }
  },
  "alerts": {
    "total": 3,
    "unresolved": 1
  }
}
```

---

## Error Responses

All endpoints return appropriate HTTP status codes:

- `200 OK` - Request successful
- `201 Created` - Resource created successfully
- `400 Bad Request` - Invalid request parameters
- `404 Not Found` - Resource not found
- `500 Internal Server Error` - Server error

Error response format:
```json
{
  "error": "Error message description"
}
```

---

## Rate Limiting

API endpoints may be rate limited. Respect the following headers:

- `X-RateLimit-Limit`: Maximum requests per time window
- `X-RateLimit-Remaining`: Remaining requests in current window
- `X-RateLimit-Reset`: Time when the rate limit resets (Unix timestamp)

---

## Authentication

(To be implemented)

All API endpoints will require authentication. Include the authentication token in the request headers:

```
Authorization: Bearer <your-token>
```

---

## Webhooks

### WhatsApp Webhook Events

The WhatsApp webhook (`POST /whatsapp/webhook`) receives events from Meta's WhatsApp Business API.

**Event Types:**
- `messages` - New message received
- `statuses` - Message delivery status updates

All incoming messages are:
1. Logged to `whatsapp_mensajes` table
2. Parsed for commands (stock queries, entries, exits, etc.)
3. Processed to update stock
4. Response message generated

---

## Best Practices

1. **Pagination**: Always use pagination for list endpoints to avoid large payloads
2. **Date Filtering**: Use ISO 8601 format for dates (e.g., `2024-01-15T10:30:00Z`)
3. **Error Handling**: Always check response status codes and handle errors appropriately
4. **Idempotency**: Stock movements create unique records, repeated requests create duplicate movements
5. **Reservations**: Always release or complete reservations to free up stock
6. **Alerts**: Mark alerts as resolved after taking corrective action

---

## Examples

### Create Entry Movement and Check Stock

```javascript
// 1. Create stock entry
const entry = await fetch('https://your-url/stock/movements', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    id_producto: 15,
    tipo_movimiento: 'ENTRADA_REABASTECIMIENTO',
    cantidad: 50,
    metodo_registro: 'MANUAL',
    observaciones: 'Monthly restock'
  })
});

// 2. Get product analytics
const analytics = await fetch('https://your-url/stock/analytics/product/15');
console.log(analytics.stock_status.available_stock); // 60
```

### Create Reservation

```javascript
const reservation = await fetch('https://your-url/stock/reservations', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    id_producto: 15,
    cantidad_reservada: 5,
    id_pedido: 50,
    duracion_horas: 24
  })
});
```

### Get Unresolved Alerts

```javascript
const alerts = await fetch(
  'https://your-url/stock/alerts?resuelta=false&limit=10'
);

// Resolve alert
await fetch(`https://your-url/stock/alerts/${alertId}/resolve`, {
  method: 'PATCH',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    observaciones_resolucion: 'Stock replenished'
  })
});
```
