# WhatsApp Bot Integration Guide for Mercado Fiel Stock Management

**Last Updated:** October 15, 2025  
**API Version:** 1.0  
**Target:** External WhatsApp Bot Integration

---

## 📋 Overview

This document provides the complete specification for integrating an external WhatsApp bot with the Mercado Fiel Stock Management API. The Mercado Fiel API provides REST endpoints that your WhatsApp bot should call to manage inventory operations.

**Architecture:**
```
WhatsApp User → WhatsApp Bot (External) → Mercado Fiel API (Cloud Functions)
```

---

## 🔐 Authentication

All API requests must include authentication headers:

```http
Authorization: Bearer YOUR_API_KEY
Content-Type: application/json
X-Client: WhatsApp-Bot
```

**Required Environment Variables for WhatsApp Bot:**
- `MERCADO_FIEL_API_URL` - Base URL (e.g., `https://us-central1-mercadofiel.cloudfunctions.net/api`)
- `MERCADO_FIEL_API_KEY` - API authentication token

---

## 🎯 Available Endpoints

### Base URL
```
https://your-mercadofiel-api.com/api/stock
```

All endpoints are under the `/stock` path.

---

## 📦 1. Add Stock (ENTRADA)

**Use Case:** Supplier wants to add inventory (restock, purchase arrival, returns)

**WhatsApp Commands:**
- `entrada 123 50` - Add 50 units to product 123
- `+123 50` - Shorthand version
- `agregar 50 unidades al producto 123` - Natural language

**API Endpoint:**
```http
POST /stock/movements
```

**Request Body:**
```json
{
  "id_producto": 123,
  "tipo_movimiento": "ENTRADA_REABASTECIMIENTO",
  "cantidad": 50,
  "metodo_registro": "WHATSAPP",
  "id_usuario_registro": null,
  "observaciones": "Agregado vía WhatsApp por +56912345678"
}
```

**Available Movement Types for ENTRADA:**
- `ENTRADA_COMPRA` - Stock from purchase
- `ENTRADA_DEVOLUCION` - Stock from customer return
- `ENTRADA_AJUSTE` - Manual adjustment (increase)
- `LIBERACION_RESERVA` - Released from reservation
- `ENTRADA_REABASTECIMIENTO` - General restock (recommended default)

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "id_movimiento": 456,
    "id_producto": 123,
    "tipo_movimiento": "ENTRADA_REABASTECIMIENTO",
    "cantidad": 50,
    "stock_previo": 100,
    "stock_resultante": 150,
    "fecha_movimiento": "2025-10-15T14:30:00Z",
    "producto": {
      "id_producto": 123,
      "nombre_producto": "Producto XYZ"
    }
  },
  "stock_updated": {
    "stock_previo": 100,
    "stock_actual": 150
  }
}
```

**Error Response (400):**
```json
{
  "success": false,
  "error": "Missing required fields: id_producto, tipo_movimiento, cantidad"
}
```

**Error Response (404):**
```json
{
  "success": false,
  "error": "Product not found"
}
```

**WhatsApp Bot Should Return:**
```
✅ Stock Actualizado

📦 Producto XYZ
📊 Stock anterior: 100
➕ Cantidad agregada: 50
📈 Stock actual: 150
```

---

## 📤 2. Remove Stock (SALIDA)

**Use Case:** Supplier records sales, damages, adjustments

**WhatsApp Commands:**
- `salida 123 30` - Remove 30 units from product 123
- `-123 30` - Shorthand
- `venta 123 5` - Record sale of 5 units
- `vendí 5 del producto 123` - Natural language

**API Endpoint:**
```http
POST /stock/movements
```

**Request Body:**
```json
{
  "id_producto": 123,
  "tipo_movimiento": "SALIDA_VENTA",
  "cantidad": 30,
  "metodo_registro": "WHATSAPP",
  "id_usuario_registro": null,
  "observaciones": "Venta registrada vía WhatsApp por +56912345678"
}
```

**Available Movement Types for SALIDA:**
- `SALIDA_VENTA` - Stock sold (recommended for sales)
- `SALIDA_DEVOLUCION` - Return to supplier
- `SALIDA_MERMA` - Damaged/expired stock
- `SALIDA_AJUSTE` - Manual adjustment (decrease)
- `RESERVA` - Reserved for order

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "id_movimiento": 457,
    "id_producto": 123,
    "tipo_movimiento": "SALIDA_VENTA",
    "cantidad": 30,
    "stock_previo": 150,
    "stock_resultante": 120,
    "fecha_movimiento": "2025-10-15T14:35:00Z",
    "producto": {
      "id_producto": 123,
      "nombre_producto": "Producto XYZ"
    }
  },
  "stock_updated": {
    "stock_previo": 150,
    "stock_actual": 120
  }
}
```

**Error Response (400 - Insufficient Stock):**
```json
{
  "success": false,
  "error": "Insufficient stock for this operation"
}
```

**WhatsApp Bot Should Return:**
```
✅ Venta Registrada

📦 Producto XYZ
📊 Stock anterior: 150
➖ Cantidad vendida: 30
📉 Stock actual: 120
```

---

## 🔍 3. Query Stock

**Use Case:** Supplier wants to check current inventory levels

**WhatsApp Commands:**
- `stock 123` - Check stock of product 123
- `?123` - Shorthand
- `cuanto stock tiene el producto 123` - Natural language

**API Endpoint:**
```http
GET /stock/analytics/product/:id
```

**Request:**
```http
GET /stock/analytics/product/123
Authorization: Bearer YOUR_API_KEY
```

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "product": {
      "id_producto": 123,
      "nombre_producto": "Producto XYZ",
      "stock_actual": 120,
      "stock_minimo": 20,
      "stock_maximo": 500,
      "ultimo_reabastecimiento": "2025-10-15T14:30:00Z"
    },
    "movement_stats": [
      {
        "tipo_movimiento": "ENTRADA_REABASTECIMIENTO",
        "_sum": { "cantidad": 200 },
        "_count": { "id_movimiento": 5 }
      },
      {
        "tipo_movimiento": "SALIDA_VENTA",
        "_sum": { "cantidad": 80 },
        "_count": { "id_movimiento": 12 }
      }
    ],
    "recent_movements": [
      {
        "id_movimiento": 457,
        "tipo_movimiento": "SALIDA_VENTA",
        "cantidad": 30,
        "fecha_movimiento": "2025-10-15T14:35:00Z"
      }
    ],
    "active_reservations": {
      "count": 2,
      "total_quantity": 15,
      "available_stock": 105
    },
    "unresolved_alerts": 0
  }
}
```

**Error Response (404):**
```json
{
  "success": false,
  "error": "Product not found"
}
```

**WhatsApp Bot Should Return:**
```
📊 Consulta de Stock

📦 Producto: Producto XYZ
📈 Stock actual: 120
🔒 Stock reservado: 15
✅ Stock disponible: 105
⚠️ Stock mínimo: 20
📊 Stock máximo: 500
📊 Estado: 🟢 OK
```

If stock is low (≤ stock_minimo):
```
📊 Estado: 🔴 BAJO
⚠️ ¡Stock bajo! Considera reabastecer
```

---

## ⚙️ 4. Set Absolute Stock (AJUSTE)

**Use Case:** Supplier wants to set exact stock value (physical inventory count)

**WhatsApp Commands:**
- `set 123 100` - Set product 123 to exactly 100 units
- `establecer stock del 123 a 100` - Natural language

**Implementation Strategy:**

This requires **TWO API calls**:

### Step 1: Get Current Stock
```http
GET /stock/analytics/product/123
```

### Step 2: Calculate Difference and Create Movement

If current stock = 120 and new stock = 100:
- Difference = -20 (need to remove)
- Use `SALIDA_AJUSTE` with quantity 20

If current stock = 80 and new stock = 100:
- Difference = +20 (need to add)
- Use `ENTRADA_AJUSTE` with quantity 20

### Step 3: Create Adjustment Movement
```http
POST /stock/movements
```

**Request Body (if removing):**
```json
{
  "id_producto": 123,
  "tipo_movimiento": "SALIDA_AJUSTE",
  "cantidad": 20,
  "metodo_registro": "WHATSAPP",
  "observaciones": "Ajuste absoluto vía WhatsApp. Stock establecido a 100"
}
```

**Request Body (if adding):**
```json
{
  "id_producto": 123,
  "tipo_movimiento": "ENTRADA_AJUSTE",
  "cantidad": 20,
  "metodo_registro": "WHATSAPP",
  "observaciones": "Ajuste absoluto vía WhatsApp. Stock establecido a 100"
}
```

**WhatsApp Bot Should Return:**
```
✅ Stock Establecido

📦 Producto XYZ
📊 Stock anterior: 120
⚙️ Stock nuevo: 100
```

---

## 📊 5. Get Stock Movements History

**Use Case:** Review recent stock changes for auditing

**API Endpoint:**
```http
GET /stock/movements
```

**Query Parameters:**
- `page` - Page number (default: 1)
- `limit` - Items per page (default: 20)
- `id_producto` - Filter by product ID
- `tipo_movimiento` - Filter by movement type
- `metodo_registro` - Filter by registration method (e.g., `WHATSAPP`)
- `fecha_desde` - Start date (ISO 8601)
- `fecha_hasta` - End date (ISO 8601)

**Example Request:**
```http
GET /stock/movements?id_producto=123&limit=10&metodo_registro=WHATSAPP
```

**Success Response:**
```json
{
  "success": true,
  "data": [
    {
      "id_movimiento": 457,
      "id_producto": 123,
      "tipo_movimiento": "SALIDA_VENTA",
      "cantidad": 30,
      "stock_previo": 150,
      "stock_resultante": 120,
      "metodo_registro": "WHATSAPP",
      "fecha_movimiento": "2025-10-15T14:35:00Z",
      "observaciones": "Venta registrada vía WhatsApp por +56912345678",
      "producto": {
        "id_producto": 123,
        "nombre_producto": "Producto XYZ"
      },
      "usuario": null
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 25,
    "totalPages": 3
  }
}
```

**WhatsApp Bot Could Return:**
```
📜 Historial de Movimientos

Últimos 5 movimientos del producto 123:

1️⃣ 15/10 14:35 - VENTA
   ➖ 30 unidades (150 → 120)

2️⃣ 15/10 14:30 - REABASTECIMIENTO
   ➕ 50 unidades (100 → 150)

3️⃣ 14/10 16:20 - VENTA
   ➖ 10 unidades (110 → 100)
```

---

## 🚨 6. Get Stock Alerts

**Use Case:** Check low stock warnings

**API Endpoint:**
```http
GET /stock/alerts
```

**Query Parameters:**
- `page` - Page number
- `limit` - Items per page
- `id_producto` - Filter by product
- `tipo_alerta` - Filter by alert type
- `resuelta` - Filter by resolved status (`true`/`false`)

**Alert Types:**
- `STOCK_BAJO` - Stock at or below minimum
- `STOCK_CRITICO` - Stock below half of minimum
- `STOCK_AGOTADO` - Stock at zero
- `PROXIMO_VENCIMIENTO` - Expiration warning
- `VENCIDO` - Expired product

**Example Request:**
```http
GET /stock/alerts?resuelta=false&limit=5
```

**Success Response:**
```json
{
  "success": true,
  "data": [
    {
      "id_alerta": 1,
      "id_producto": 456,
      "tipo_alerta": "STOCK_BAJO",
      "stock_actual": 15,
      "stock_minimo": 20,
      "mensaje": "Stock bajo para Producto ABC",
      "fecha_alerta": "2025-10-15T10:00:00Z",
      "resuelta": false,
      "producto": {
        "id_producto": 456,
        "nombre_producto": "Producto ABC",
        "stock_actual": 15,
        "stock_minimo": 20,
        "imagen_url": "https://..."
      }
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 5,
    "total": 3,
    "totalPages": 1
  }
}
```

**WhatsApp Bot Could Return:**
```
⚠️ Alertas de Stock

Tienes 3 alertas activas:

🔴 Producto ABC (#456)
   Stock actual: 15
   Stock mínimo: 20
   Falta: 5 unidades

🔴 Producto DEF (#789)
   Stock actual: 8
   Stock mínimo: 10
   Falta: 2 unidades
```

---

## � 7. List Supplier Products

**Use Case:** Supplier wants to see all their products with current stock levels

**WhatsApp Commands:**
- `productos` - List all my products
- `mis productos` - Natural language
- `lista` - Shorthand
- `inventario` - Alternative

**API Endpoint:**
```http
GET /productos
```

**Query Parameters:**
- `page` - Page number (default: 1)
- `limit` - Items per page (default: 10, max: 50)
- `proveedor` - Filter by supplier ID (required for WhatsApp bot)
- `search` - Search by product name or description
- `categoria` - Filter by category ID
- `disponible` - Filter by availability (`true`/`false`)
- `sortBy` - Sort field: `nombre_producto`, `precio_unitario`, `created_at`, `updated_at`
- `sortOrder` - Sort direction: `asc` or `desc`

**Example Request:**
```http
GET /productos?proveedor=456&limit=20&disponible=true&sortBy=nombre_producto&sortOrder=asc
Authorization: Bearer YOUR_API_KEY
```

**Success Response:**
```json
{
  "success": true,
  "data": {
    "productos": [
      {
        "id_producto": 123,
        "nombre_producto": "Producto XYZ",
        "descripcion": "Descripción del producto",
        "precio_unitario": 1500,
        "unit_type": "kg",
        "stock_actual": 120,
        "stock_minimo": 20,
        "stock_maximo": 500,
        "disponible": true,
        "imagen_url": "https://...",
        "categoria": {
          "id_categoria": 5,
          "nombre_categoria": "Frutas"
        },
        "created_at": "2025-10-01T10:00:00Z",
        "updated_at": "2025-10-15T14:35:00Z"
      },
      {
        "id_producto": 124,
        "nombre_producto": "Producto ABC",
        "precio_unitario": 2500,
        "unit_type": "unidad",
        "stock_actual": 45,
        "stock_minimo": 10,
        "disponible": true,
        "categoria": {
          "id_categoria": 5,
          "nombre_categoria": "Frutas"
        }
      }
    ],
    "pagination": {
      "currentPage": 1,
      "totalPages": 3,
      "totalItems": 58,
      "itemsPerPage": 20,
      "hasNextPage": true,
      "hasPrevPage": false
    }
  }
}
```

**Error Response (401 - Unauthorized):**
```json
{
  "success": false,
  "error": "Unauthorized"
}
```

**WhatsApp Bot Should Return:**

For a simple list:
```
📦 *Tus Productos* (Página 1/3)

1️⃣ Producto XYZ (#123)
   📊 Stock: 120 / Min: 20
   💰 $1,500 por kg
   ✅ Disponible

2️⃣ Producto ABC (#124)
   📊 Stock: 45 / Min: 10
   💰 $2,500 por unidad
   ✅ Disponible

3️⃣ Producto DEF (#125)
   📊 Stock: 5 / Min: 15
   💰 $800 por kg
   🔴 Stock bajo

---
Para ver más: "productos pagina 2"
Para buscar: "buscar [nombre]"
```

For products with low stock warnings:
```
📦 *Tus Productos* (58 total)

⚠️ *3 productos con stock bajo:*

🔴 Producto DEF (#125)
   Stock: 5 / Mínimo: 15
   Faltan: 10 unidades

🔴 Producto GHI (#126)
   Stock: 2 / Mínimo: 10
   Faltan: 8 unidades

---
Total disponibles: 55
Total no disponibles: 3
```

**Implementation Notes:**

1. **Supplier ID Requirement:**
   - The WhatsApp bot must identify which supplier (proveedor) is making the request
   - Use the WhatsApp phone number to look up the supplier's `id_proveedor`
   - Always include `proveedor=<id>` in the query parameters

2. **Pagination:**
   - For WhatsApp, recommend `limit=10` for readability
   - Allow users to request specific pages: "productos pagina 2"
   - Show page indicators in responses

3. **Search Functionality:**
   - Users can search: "buscar tomates"
   - Pass search term as `search=tomates`
   - Searches in product name, description, and supplier business name

4. **Stock Status Indicators:**
   - 🟢 OK - Stock above minimum
   - 🟡 Low - Stock at or below minimum
   - 🔴 Critical - Stock below half of minimum
   - ⚫ Out - Stock at zero

---

## �📋 8. Stock Reservations

**Use Case:** Reserve stock for pending orders

### Get Reservations
```http
GET /stock/reservations
```

**Query Parameters:**
- `id_producto` - Filter by product
- `estado` - Filter by status (`ACTIVA`, `COMPLETADA`, `CANCELADA`, `EXPIRADA`)

### Create Reservation
```http
POST /stock/reservations
```

**Request Body:**
```json
{
  "id_producto": 123,
  "tipo_reserva": "PEDIDO",
  "cantidad_reservada": 10,
  "id_usuario": null,
  "id_pedido": 789,
  "fecha_expiracion": "2025-10-20T23:59:59Z",
  "observaciones": "Reserva para pedido cliente vía WhatsApp"
}
```

**Reservation Types:**
- `PEDIDO` - Reserved for order
- `CAMPANA` - Reserved for campaign
- `TEMPORAL` - Temporary hold

**Success Response:**
```json
{
  "success": true,
  "data": {
    "id_reserva": 10,
    "id_producto": 123,
    "tipo_reserva": "PEDIDO",
    "cantidad_reservada": 10,
    "estado": "ACTIVA",
    "fecha_reserva": "2025-10-15T14:40:00Z",
    "fecha_expiracion": "2025-10-20T23:59:59Z"
  }
}
```

**Error Response (400 - Insufficient Stock):**
```json
{
  "success": false,
  "error": "Insufficient available stock for reservation",
  "data": {
    "stock_actual": 120,
    "already_reserved": 15,
    "available": 105,
    "requested": 110
  }
}
```

### Release Reservation
```http
PATCH /stock/reservations/:id/release
```

**Request Body:**
```json
{
  "estado": "CANCELADA"
}
```

---

## 🔧 Implementation Checklist for WhatsApp Bot

### 1. **Environment Setup**
- [ ] Add `MERCADO_FIEL_API_URL` to environment variables
- [ ] Add `MERCADO_FIEL_API_KEY` to environment variables (store in Secret Manager for production)
- [ ] Configure HTTP client with 15-second timeout
- [ ] Set up authentication headers for all requests

### 2. **Command Parser**
Update your stock agent to recognize these commands:

**Quick Commands (Regex):**
```
entrada <product_id> <quantity>     → Add stock
salida <product_id> <quantity>      → Remove stock
venta <product_id> <quantity>       → Record sale
stock <product_id>                  → Query stock
set <product_id> <quantity>         → Set absolute stock
+<product_id> <quantity>            → Add (shorthand)
-<product_id> <quantity>            → Remove (shorthand)
?<product_id>                       → Query (shorthand)
productos [pagina N]                → List products (with optional page)
mis productos                       → List products
lista                               → List products
buscar <texto>                      → Search products
alertas                             → List alerts
historial <product_id>              → Movement history
```

**Natural Language (AI):**
- "agregar 20 unidades del producto 123"
- "vendí 5 del producto 456"
- "cuanto stock tiene el 789"
- "establecer stock del 123 a 100"
- "muéstrame mis productos"
- "buscar tomates"
- "productos disponibles"

### 3. **API Client Functions**

Implement these functions in your `MercadoFielService`:

```
add_stock(product_id, quantity, whatsapp_phone, notes)
  → POST /stock/movements with ENTRADA_REABASTECIMIENTO

remove_stock(product_id, quantity, whatsapp_phone, movement_type, notes)
  → POST /stock/movements with SALIDA_VENTA or SALIDA_MERMA

record_sale(product_id, quantity, whatsapp_phone, notes)
  → POST /stock/movements with SALIDA_VENTA

query_stock(product_id)
  → GET /stock/analytics/product/:id

set_stock(product_id, new_quantity, whatsapp_phone, notes)
  → GET analytics first, then POST movement with ENTRADA_AJUSTE or SALIDA_AJUSTE

list_products(supplier_id, page, limit, search, available_only)
  → GET /productos?proveedor=:id&page=:page&limit=:limit&search=:search&disponible=:available

get_alerts(resolved_status)
  → GET /stock/alerts?resuelta=false

get_history(product_id, limit)
  → GET /stock/movements?id_producto=:id&metodo_registro=WHATSAPP
```

### 4. **Error Handling**

Map API errors to user-friendly WhatsApp messages:

| API Error | HTTP Code | WhatsApp Message |
|-----------|-----------|------------------|
| Product not found | 404 | "❌ Producto #123 no encontrado" |
| Insufficient stock | 400 | "❌ Stock insuficiente (disponible: 10, solicitado: 20)" |
| Missing fields | 400 | "❌ Comando incompleto. Usa: entrada <producto> <cantidad>" |
| Timeout | 408 | "⏱️ Tiempo agotado. Intenta nuevamente" |
| Server error | 500 | "❌ Error del servidor. Contacta soporte" |
| Unauthorized | 401 | "🔒 No autorizado. Verifica tu cuenta" |

### 5. **Response Formatting**

Create WhatsApp-friendly responses with emojis:

**Stock Added:**
```
✅ Stock Actualizado
📦 [Product Name]
📊 Stock anterior: [prev]
➕ Cantidad agregada: [qty]
📈 Stock actual: [current]
```

**Stock Removed:**
```
✅ Venta Registrada
📦 [Product Name]
📊 Stock anterior: [prev]
➖ Cantidad: [qty]
📉 Stock actual: [current]
```

**Stock Query:**
```
📊 Consulta de Stock
📦 [Product Name]
📈 Stock actual: [stock]
🔒 Reservado: [reserved]
✅ Disponible: [available]
⚠️ Mínimo: [minimum]
📊 Estado: [🟢 OK / 🔴 BAJO]
```

### 6. **Logging**

Log these events for monitoring:

```
stock_command_received - User sent stock command
stock_command_parsed - Command successfully parsed
api_request_sent - Request sent to Mercado Fiel API
api_response_received - Response received (include status code)
api_error_occurred - API error (include error details)
stock_operation_completed - Operation successful
whatsapp_response_sent - Response sent to user
```

### 7. **Testing Scenarios**

Test these cases before production:

- [ ] Add stock to existing product
- [ ] Remove stock (valid quantity)
- [ ] Remove stock (insufficient quantity) → Should return error
- [ ] Query stock for existing product
- [ ] Query stock for non-existent product → Should return error
- [ ] Set absolute stock (increase)
- [ ] Set absolute stock (decrease)
- [ ] Record sale
- [ ] List all products for supplier
- [ ] List products with pagination (page 2, page 3)
- [ ] Search products by name
- [ ] Filter products by availability
- [ ] Get stock alerts
- [ ] Get movement history
- [ ] API timeout handling
- [ ] Invalid API key → Should return 401
- [ ] Malformed request → Should return 400
- [ ] Supplier with no products → Should return empty list

---

## 🔒 Security Considerations

### 1. **Supplier Verification**

Before processing stock commands, verify the WhatsApp number is authorized:

**Option A: Database Lookup**
- Maintain a table of authorized WhatsApp numbers in your bot's database
- Cross-reference with supplier records in Mercado Fiel

**Option B: API Verification Endpoint (Future)**
```http
POST /suppliers/verify
{
  "whatsapp_phone": "+56912345678"
}

Response:
{
  "authorized": true,
  "supplier_id": 456,
  "supplier_name": "Proveedor XYZ"
}
```

**Note:** This endpoint doesn't exist yet in Mercado Fiel API. You'll need to:
- Either implement it in Mercado Fiel API
- Or handle authorization in the WhatsApp bot database

### 2. **Rate Limiting**

Implement rate limits in your WhatsApp bot:
- Max 10 stock operations per minute per user
- Max 50 operations per hour per user

### 3. **Audit Trail**

Always include in `observaciones` field:
- WhatsApp phone number
- Timestamp
- Original message text (optional)

Example:
```
"observaciones": "Venta registrada vía WhatsApp por +56912345678 el 15/10/2025 14:35"
```

---

## 📈 Monitoring & Analytics

### Recommended Metrics to Track

1. **Success Rate:**
   - Total stock commands received
   - Successful API calls
   - Failed API calls
   - Error rate by type

2. **Performance:**
   - Average API response time
   - Timeout frequency
   - Commands per hour/day

3. **Usage Patterns:**
   - Most used commands (entrada vs salida vs query)
   - Peak usage hours
   - Most active products

4. **Error Analysis:**
   - "Product not found" frequency → Suggests user education needed
   - "Insufficient stock" frequency → Suggests inventory planning issues
   - Timeout frequency → Suggests API performance issues

---

## 🚀 Deployment Steps

### Step 1: Update WhatsApp Bot Code
- Implement API client functions
- Update command parser
- Add error handling
- Test locally with sample data

### Step 2: Configure Environment
```bash
# .env file
MERCADO_FIEL_API_URL=https://us-central1-mercadofiel.cloudfunctions.net/api
MERCADO_FIEL_API_KEY=your_production_api_key_here
```

### Step 3: Deploy to Production
```bash
# Docker
docker-compose down
docker-compose up --build -d

# Or Cloud Run (if using Terraform)
terraform apply
```

### Step 4: Test with Real Supplier
- Select one test supplier
- Share WhatsApp number with them
- Walk through each command type
- Monitor logs for errors

### Step 5: Gradual Rollout
- Week 1: 5 suppliers
- Week 2: 20 suppliers
- Week 3: All suppliers

---

## 📞 Support & Troubleshooting

### Common Issues

**Issue:** "❌ Error 401 Unauthorized"
- **Cause:** Invalid or missing API key
- **Solution:** Verify `MERCADO_FIEL_API_KEY` environment variable

**Issue:** "⏱️ Timeout errors"
- **Cause:** Mercado Fiel API slow response
- **Solution:** Increase timeout from 15s to 30s

**Issue:** "❌ Producto no encontrado" frequently
- **Cause:** Users typing wrong product IDs
- **Solution:** Implement product search/autocomplete feature

**Issue:** "❌ Stock insuficiente" on valid operations
- **Cause:** Active reservations reducing available stock
- **Solution:** Show available vs actual stock in query response

### Debug Checklist

When investigating issues:

1. Check WhatsApp bot logs for command parsing
2. Check HTTP request/response logs
3. Verify API key is correct
4. Test API endpoint directly with curl/Postman
5. Check Mercado Fiel API logs in Firebase Console
6. Verify product exists in database
7. Check stock levels and reservations

---

## 📚 Additional Resources

### API Testing with curl

**Add Stock:**
```bash
curl -X POST https://your-api.com/api/stock/movements \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "id_producto": 123,
    "tipo_movimiento": "ENTRADA_REABASTECIMIENTO",
    "cantidad": 50,
    "metodo_registro": "WHATSAPP",
    "observaciones": "Test from curl"
  }'
```

**Query Stock:**
```bash
curl -X GET https://your-api.com/api/stock/analytics/product/123 \
  -H "Authorization: Bearer YOUR_API_KEY"
```

**List Products:**
```bash
# List all products for supplier ID 456
curl -X GET "https://your-api.com/api/productos?proveedor=456&limit=20" \
  -H "Authorization: Bearer YOUR_API_KEY"

# Search products
curl -X GET "https://your-api.com/api/productos?proveedor=456&search=tomate" \
  -H "Authorization: Bearer YOUR_API_KEY"

# List with pagination
curl -X GET "https://your-api.com/api/productos?proveedor=456&page=2&limit=10" \
  -H "Authorization: Bearer YOUR_API_KEY"
```

### Movement Type Reference

| Spanish Command | tipo_movimiento | Use Case |
|----------------|-----------------|----------|
| entrada | ENTRADA_REABASTECIMIENTO | General restock |
| compra | ENTRADA_COMPRA | New purchase arrived |
| devolucion cliente | ENTRADA_DEVOLUCION | Customer returned item |
| salida | SALIDA_VENTA | General sale |
| venta | SALIDA_VENTA | Confirmed sale |
| merma | SALIDA_MERMA | Damaged/expired |
| ajuste + | ENTRADA_AJUSTE | Inventory correction (add) |
| ajuste - | SALIDA_AJUSTE | Inventory correction (remove) |

---

## 📝 Next Steps for Full Integration

### Short Term (This Week)
1. ✅ Implement basic API client in WhatsApp bot
2. ✅ Add command parsing (regex + AI)
3. ✅ Test with sample product IDs
4. ✅ Deploy to staging environment

### Medium Term (Next 2 Weeks)
1. Add supplier verification/authorization
2. Implement stock alerts notifications
3. Add movement history review commands
4. Create reservation management commands

### Long Term (Next Month)
1. Add analytics dashboard for suppliers
2. Implement scheduled reports (daily/weekly stock summary)
3. Add bulk operations (update multiple products)
4. Create inventory planning suggestions

---

## ✅ Implementation Checklist

Copy this checklist to track your progress:

- [ ] Configure `MERCADO_FIEL_API_URL` environment variable
- [ ] Configure `MERCADO_FIEL_API_KEY` environment variable
- [ ] Create HTTP client with authentication headers
- [ ] Implement `add_stock()` function → POST /stock/movements
- [ ] Implement `remove_stock()` function → POST /stock/movements
- [ ] Implement `query_stock()` function → GET /stock/analytics/product/:id
- [ ] Implement `set_stock()` function → GET analytics + POST movement
- [ ] Implement `list_products()` function → GET /productos?proveedor=:id
- [ ] Implement `search_products()` function → GET /productos?search=:query
- [ ] Implement `get_alerts()` function → GET /stock/alerts
- [ ] Implement `get_history()` function → GET /stock/movements
- [ ] Add command parser for quick commands (regex)
- [ ] Add natural language parser (AI)
- [ ] Implement error handling with user-friendly messages
- [ ] Add WhatsApp response formatting with emojis
- [ ] Implement pagination for product lists
- [ ] Implement logging for monitoring
- [ ] Add supplier verification/authorization
- [ ] Map WhatsApp phone number to supplier ID
- [ ] Test all commands with sample data
- [ ] Test error scenarios (404, 400, timeout)
- [ ] Test product listing with pagination
- [ ] Test product search functionality
- [ ] Deploy to staging
- [ ] Test with real supplier in staging
- [ ] Deploy to production
- [ ] Monitor logs for first week

---

**Document Version:** 1.0  
**Last Updated:** October 15, 2025  
**Maintained By:** Mercado Fiel Development Team  

For questions or issues, contact the development team or check the Mercado Fiel API documentation.
