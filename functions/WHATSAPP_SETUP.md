# WhatsApp Bot Integration - Setup Guide

This guide explains how to set up the WhatsApp Business API integration for stock management.

## Prerequisites

1. **Meta Business Account** - Create one at [business.facebook.com](https://business.facebook.com)
2. **WhatsApp Business API Access** - Apply for API access through Meta
3. **Phone Number** - A dedicated phone number for your WhatsApp Business account
4. **Firebase Functions** - Deployed and accessible via HTTPS

## Setup Steps

### 1. Meta Developer Portal Configuration

1. Go to [developers.facebook.com](https://developers.facebook.com)
2. Create a new app or select existing app
3. Add **WhatsApp** product to your app
4. Navigate to **WhatsApp > Configuration**
5. Note down:
   - Phone Number ID
   - WhatsApp Business Account ID
   - Generate an Access Token (Settings > Access Tokens)

### 2. Configure Environment Variables

Copy `.env.example` to `.env`:

```bash
cp .env.example .env
```

Update the following variables in `.env`:

```env
WHATSAPP_VERIFY_TOKEN=my-secure-verify-token-123
WHATSAPP_PHONE_NUMBER_ID=123456789012345
WHATSAPP_ACCESS_TOKEN=EAAB...your-long-access-token
WHATSAPP_BUSINESS_ACCOUNT_ID=987654321098765
```

### 3. Deploy Firebase Functions

```bash
cd functions
npm install
npm run build
firebase deploy --only functions
```

Note the deployed function URL (e.g., `https://us-central1-your-project.cloudfunctions.net/api`)

### 4. Configure WhatsApp Webhook

1. In Meta Developer Portal, go to **WhatsApp > Configuration > Webhook**
2. Click **Edit** under "Webhook"
3. Enter:
   - **Callback URL**: `https://your-firebase-url/stock/whatsapp/webhook`
   - **Verify Token**: Same as `WHATSAPP_VERIFY_TOKEN` in your `.env`
4. Click **Verify and Save**
5. Subscribe to webhook fields:
   - ✅ messages

### 5. Create WhatsApp Configuration in Database

Use the API endpoint to create a WhatsApp config:

```bash
curl -X POST https://your-firebase-url/stock/whatsapp/config \
  -H "Content-Type: application/json" \
  -d '{
    "id_proveedor": 1,
    "numero_whatsapp": "+56912345678",
    "nombre_contacto": "Provider Name",
    "notificar_stock_bajo": true,
    "notificar_ventas": true,
    "horario_notificaciones_inicio": "09:00",
    "horario_notificaciones_fin": "18:00",
    "activo": true
  }'
```

## WhatsApp Commands

Once configured, providers can send these commands via WhatsApp:

### Help & Information
- `ayuda` - Show available commands
- `help` - Show available commands

### Stock Queries
- `stock producto 123` - Check stock for product #123
- `consulta inventario #123` - Alternative syntax
- `stock` - Get general stock information

### Stock Entry (Add)
- `agregar 50 unidades producto 123` - Add 50 units to product #123
- `entrada producto 123 cantidad 50` - Alternative syntax
- `ingreso producto 123 cantidad 50` - Alternative syntax

### Stock Exit (Remove)
- `salida 10 unidades producto 123` - Remove 10 units from product #123
- `venta producto 123 cantidad 10` - Alternative syntax
- `retirar producto 123 cantidad 10` - Alternative syntax

### Stock Adjustment
- `ajustar producto 123 cantidad 100` - Set stock to exactly 100 units
- `corregir stock producto 123 a 100` - Alternative syntax

### Reports
- `reporte` - Get stock summary report
- `resumen de stock` - Alternative syntax
- `informe` - Alternative syntax

### Configuration
- `alertas` - Configure alert settings
- `configurar notificaciones` - Alternative syntax

## Example Message Flow

**User sends:** `stock producto 15`

**Bot replies:**
```
✅ Camomila Premium (ID: 15)

📦 Stock Actual: *45 unidades*
📊 Stock Mínimo: 10
📈 Stock Máximo: 100

✅ Stock en niveles normales.
```

**User sends:** `salida 30 unidades producto 15`

**Bot replies:**
```
✅ Salida de Stock Registrada

📦 Producto: Camomila Premium
➖ Cantidad: -30 unidades
📊 Stock anterior: 45
📉 Stock nuevo: 15

ID Movimiento: #1234
```

## Testing

### Test Webhook Verification

```bash
curl -X GET "https://your-firebase-url/stock/whatsapp/webhook?hub.mode=subscribe&hub.verify_token=my-secure-verify-token-123&hub.challenge=TEST_CHALLENGE"
```

Should return: `TEST_CHALLENGE`

### Test Message Processing

Send a test message from your WhatsApp Business number to verify:

1. Message is received by webhook
2. Command is parsed correctly
3. Stock is updated in database
4. Response is logged in `whatsapp_mensajes` table

Check logs:

```bash
firebase functions:log
```

## Database Tables

### whatsapp_config
Stores WhatsApp configuration for each provider:
- Phone numbers
- Notification preferences
- Active status
- Business hours

### whatsapp_mensajes
Logs all WhatsApp messages:
- Incoming messages
- Detected actions
- Response messages
- Processing status

### movimientos_stock
All stock movements including those from WhatsApp (metodo_registro = 'WHATSAPP')

## Troubleshooting

### Webhook not receiving messages
1. Verify webhook URL is correct and accessible via HTTPS
2. Check verify token matches in `.env` and Meta portal
3. Ensure webhook is subscribed to "messages" field
4. Check Firebase Functions logs for errors

### Commands not being recognized
1. Check `whatsapp_mensajes` table for logged messages
2. Verify `accion_detectada` column shows correct action
3. Review command parsing logic in `stockController.ts`
4. Check for typos in command messages

### Stock not updating
1. Verify `procesado_exitoso` is `true` in `whatsapp_mensajes`
2. Check `movimientos_stock` table for new entries
3. Review Firebase Functions logs for errors
4. Verify product ID exists in database

### Rate Limiting
WhatsApp has rate limits:
- 1,000 business-initiated messages per 24 hours (tier 1)
- User-initiated messages have no limit

## Security Considerations

1. **Verify Token**: Use a strong, random verify token
2. **Access Token**: Keep access token secure, rotate regularly
3. **Phone Number Validation**: Only process messages from registered providers
4. **Rate Limiting**: Implement rate limiting on webhook endpoint
5. **Input Validation**: Always validate product IDs and quantities
6. **Audit Trail**: All messages are logged in `whatsapp_mensajes`

## Monitoring

Monitor these metrics:
- Message success rate (`procesado_exitoso` in `whatsapp_mensajes`)
- Response times
- Failed webhook calls
- Stock alert frequency

Query for failed messages:

```sql
SELECT * FROM whatsapp_mensajes 
WHERE procesado_exitoso = false 
ORDER BY fecha_mensaje DESC 
LIMIT 10;
```

## Next Steps

1. ✅ Configure Meta Developer Portal
2. ✅ Set environment variables
3. ✅ Deploy Firebase Functions
4. ✅ Configure webhook
5. ✅ Create WhatsApp configs for providers
6. ✅ Test with sample commands
7. ⏳ Train providers on available commands
8. ⏳ Monitor usage and optimize

## Support

For issues:
1. Check Firebase Functions logs
2. Review `whatsapp_mensajes` table
3. Verify webhook configuration in Meta portal
4. Contact Meta support for API issues

## Resources

- [WhatsApp Business Platform Documentation](https://developers.facebook.com/docs/whatsapp)
- [Meta Business Help Center](https://www.facebook.com/business/help)
- [Firebase Functions Documentation](https://firebase.google.com/docs/functions)
