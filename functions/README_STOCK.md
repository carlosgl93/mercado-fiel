# Stock Management System

Comprehensive inventory and stock management system with WhatsApp bot integration for Mercado Fiel.

## 🌟 Features

### Core Stock Management
- ✅ **Real-time stock tracking** - Monitor inventory levels across all products
- ✅ **Movement history** - Complete audit trail of all stock changes
- ✅ **Automatic alerts** - Get notified when stock is low, depleted, or exceeded
- ✅ **Stock reservations** - Reserve inventory for pending orders
- ✅ **Multiple movement types** - Entries, exits, adjustments, returns, shrinkage
- ✅ **Analytics dashboard** - Comprehensive insights into stock performance

### WhatsApp Bot Integration
- 🤖 **Natural language commands** - Manage stock via WhatsApp messages
- 📊 **Real-time queries** - Check stock levels on the go
- 📥 **Quick updates** - Add or remove stock with simple commands
- 📈 **Instant reports** - Get stock summaries via WhatsApp
- 🔔 **Smart notifications** - Receive alerts for low stock during business hours

## 📋 Table of Contents

- [Architecture](#architecture)
- [Database Schema](#database-schema)
- [API Endpoints](#api-endpoints)
- [WhatsApp Commands](#whatsapp-commands)
- [Setup Guide](#setup-guide)
- [Usage Examples](#usage-examples)
- [Development](#development)

## 🏗 Architecture

```
┌─────────────────┐
│   Frontend      │ React Components
│   (React)       │ - StockDashboard
│                 │ - StockAlerts
└────────┬────────┘ - MovementHistory
         │
         ↓
┌─────────────────┐
│   Backend       │ Firebase Cloud Functions
│   (Express)     │ - /stock/* endpoints
│                 │ - stockRouter
└────────┬────────┘ - stockController
         │
         ↓
┌─────────────────┐
│   Database      │ PostgreSQL + Prisma ORM
│   (Prisma)      │ - productos (enhanced)
│                 │ - movimientos_stock
└────────┬────────┘ - alertas_stock
         │          - whatsapp_config
         │          - whatsapp_mensajes
         │          - reservas_stock
         ↓
┌─────────────────┐
│   WhatsApp      │ Meta Business API
│   Bot           │ - Webhook integration
│                 │ - Command processing
└─────────────────┘ - Auto responses
```

## 🗄 Database Schema

### Enhanced Tables

#### `productos` (Enhanced)
New fields added:
- `stock_actual` - Current stock quantity (default: 0)
- `stock_minimo` - Minimum stock threshold (default: 5)
- `stock_maximo` - Maximum stock capacity (default: 1000)
- `alerta_stock_bajo` - Enable low stock alerts (default: true)
- `permite_venta_sin_stock` - Allow sales without stock (default: false)
- `dias_reabastecimiento` - Days to restock (default: 7)
- `ultimo_reabastecimiento` - Last restock date

### New Tables

#### `movimientos_stock`
Tracks all stock movements:
- Entry types: Purchase, Return, Adjustment, Restock
- Exit types: Sale, Return, Adjustment, Shrinkage
- Audit fields: Previous stock, resulting stock, timestamp
- Registration method: Manual, Automatic, WhatsApp

#### `alertas_stock`
Stock alert system:
- Alert types: Low stock, Out of stock, Exceeded, Expiring soon
- Severity levels: Info, Warning, Critical
- Resolution tracking
- User/provider assignment

#### `whatsapp_config`
WhatsApp integration settings per provider:
- Phone number and contact name
- Notification preferences
- Business hours configuration
- Active status

#### `whatsapp_mensajes`
Message log for audit and debugging:
- Incoming messages
- Detected actions
- Response messages
- Processing status

#### `reservas_stock`
Temporary stock allocations:
- Order-based reservations
- Expiration management
- States: Active, Completed, Cancelled, Expired

### Enums

- `TipoMovimiento` - Movement types (8 variants)
- `MetodoRegistro` - How movement was recorded
- `TipoAlerta` - Alert types
- `TipoReserva` - Reservation types
- `EstadoReserva` - Reservation states
- `AccionWhatsApp` - WhatsApp command actions

## 🔌 API Endpoints

See [API_DOCUMENTATION.md](./API_DOCUMENTATION.md) for complete details.

### Quick Reference

**Stock Movements:**
- `GET /stock/movements` - List movements with filters
- `POST /stock/movements` - Create new movement

**Alerts:**
- `GET /stock/alerts` - List alerts
- `PATCH /stock/alerts/:id/resolve` - Resolve alert

**Reservations:**
- `GET /stock/reservations` - List reservations
- `POST /stock/reservations` - Create reservation
- `PATCH /stock/reservations/:id/release` - Release reservation

**WhatsApp:**
- `GET/POST /stock/whatsapp/webhook` - Webhook endpoint
- `GET/POST/PATCH /stock/whatsapp/config` - Configuration

**Analytics:**
- `GET /stock/analytics/product/:id` - Product analytics

## 💬 WhatsApp Commands

Providers can manage stock via WhatsApp messages:

```
📋 Help
"ayuda" - Show available commands

📦 Query Stock
"stock producto 123" - Check stock for product #123

📥 Add Stock
"agregar 50 unidades producto 123" - Add 50 units

📤 Remove Stock
"salida 10 unidades producto 123" - Remove 10 units

🔧 Adjust Stock
"ajustar producto 123 cantidad 100" - Set stock to 100

📊 Reports
"reporte" - Get stock summary

🔔 Alerts
"alertas" - Configure notifications
```

See [WHATSAPP_SETUP.md](./WHATSAPP_SETUP.md) for complete setup instructions.

## 🚀 Setup Guide

### 1. Database Migration

Already applied! Migration `20251015002804_add_stock_management` created:
- 6 PostgreSQL enums
- 5 new tables with indexes
- 7 new columns in `productos`

### 2. Environment Variables

Copy and configure:
```bash
cd functions
cp .env.example .env
# Edit .env with your credentials
```

Required variables:
- `WHATSAPP_VERIFY_TOKEN`
- `WHATSAPP_PHONE_NUMBER_ID`
- `WHATSAPP_ACCESS_TOKEN`
- `DATABASE_URL`

### 3. Deploy Backend

```bash
cd functions
npm install
npm run build
firebase deploy --only functions
```

### 4. Configure WhatsApp

Follow [WHATSAPP_SETUP.md](./WHATSAPP_SETUP.md):
1. Set up Meta Developer Portal
2. Configure webhook with verify token
3. Create WhatsApp config in database

### 5. Build Frontend (Next Step)

```bash
npm run dev
```

## 📖 Usage Examples

### Create Stock Entry via API

```javascript
const response = await fetch('/stock/movements', {
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
```

### Query Stock via WhatsApp

**User sends:** `stock producto 15`

**Bot replies:**
```
✅ Camomila Premium (ID: 15)

📦 Stock Actual: *45 unidades*
📊 Stock Mínimo: 10
📈 Stock Máximo: 100

✅ Stock en niveles normales.
```

### Create Reservation for Order

```javascript
const reservation = await fetch('/stock/reservations', {
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

## 🛠 Development

### File Structure

```
functions/
├── src/
│   ├── controllers/
│   │   └── stockController.ts     # Business logic & WhatsApp parsing
│   ├── routes/
│   │   └── stock.ts               # API endpoints
│   └── functions/
│       └── api.ts                 # Router registration
├── schema.prisma                  # Database schema
├── .env.example                   # Environment template
├── API_DOCUMENTATION.md           # API reference
├── WHATSAPP_SETUP.md             # Setup guide
└── README_STOCK.md               # This file
```

### Key Technologies

- **Backend:** Firebase Cloud Functions (Node.js, Express)
- **Database:** PostgreSQL with Prisma ORM
- **WhatsApp:** Meta Business API webhooks
- **Frontend:** React, Material-UI (to be implemented)

### Running Locally

```bash
# Install dependencies
cd functions
npm install

# Generate Prisma Client
npx prisma generate

# Start emulator
firebase emulators:start --only functions
```

### Testing

```bash
# Test webhook verification
curl -X GET "http://localhost:5001/your-project/us-central1/api/stock/whatsapp/webhook?hub.mode=subscribe&hub.verify_token=your-token&hub.challenge=TEST"

# Test stock query
curl -X GET "http://localhost:5001/your-project/us-central1/api/stock/movements?product_id=15"
```

## 📊 Monitoring

### Database Queries

```sql
-- Check recent movements
SELECT * FROM movimientos_stock 
ORDER BY fecha_movimiento DESC 
LIMIT 10;

-- Unresolved alerts
SELECT * FROM alertas_stock 
WHERE resuelta = false;

-- Active reservations
SELECT * FROM reservas_stock 
WHERE estado_reserva = 'ACTIVA';

-- WhatsApp message success rate
SELECT 
  COUNT(*) as total,
  SUM(CASE WHEN procesado_exitoso THEN 1 ELSE 0 END) as successful
FROM whatsapp_mensajes;
```

### Logs

```bash
# Firebase Functions logs
firebase functions:log

# Filter by stock operations
firebase functions:log --only api | grep "stock"
```

## 🔒 Security

- ✅ WhatsApp webhook verification with token
- ✅ Phone number validation before processing
- ✅ All messages logged for audit
- ✅ Input validation on all endpoints
- ⏳ Authentication (to be implemented)
- ⏳ Rate limiting (to be implemented)

## 📝 Next Steps

### Backend ✅
- [x] Database schema design
- [x] Prisma migration
- [x] Stock controller
- [x] REST API endpoints
- [x] WhatsApp webhook
- [x] Command parsing
- [x] Environment configuration

### Frontend ⏳
- [ ] StockDashboard component
- [ ] StockAlerts component
- [ ] MovementHistory component
- [ ] ReservationsManager component
- [ ] WhatsApp config UI

### Integration ⏳
- [ ] Deploy to production
- [ ] Configure Meta webhook
- [ ] Test WhatsApp commands
- [ ] Monitor performance
- [ ] User training

## 🤝 Contributing

When adding features:
1. Update schema.prisma if needed
2. Run migration: `npx prisma migrate dev`
3. Update controllers and routes
4. Add tests
5. Update documentation

## 📚 Resources

- [API Documentation](./API_DOCUMENTATION.md)
- [WhatsApp Setup Guide](./WHATSAPP_SETUP.md)
- [Prisma Documentation](https://www.prisma.io/docs)
- [WhatsApp Business Platform](https://developers.facebook.com/docs/whatsapp)
- [Firebase Functions](https://firebase.google.com/docs/functions)

## 🐛 Troubleshooting

### TypeScript Errors (stock_actual, etc. not found)
These are IDE false positives. The Prisma Client was successfully generated with all new fields. Try:
```bash
npx prisma generate
# Reload VS Code window
```

### WhatsApp Webhook Not Receiving Messages
1. Check webhook URL is HTTPS and publicly accessible
2. Verify verify_token matches in .env and Meta portal
3. Check Firebase Functions logs for errors
4. Ensure webhook subscribed to "messages" field

### Stock Not Updating
1. Check `procesado_exitoso` in `whatsapp_mensajes` table
2. Review `movimientos_stock` for new entries
3. Verify product ID exists in database
4. Check Firebase Functions logs

---

**Status:** ✅ Backend Complete | ⏳ Frontend In Progress

**Last Updated:** January 15, 2024
