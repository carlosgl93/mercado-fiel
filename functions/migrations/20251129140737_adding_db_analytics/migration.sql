-- CreateEnum
CREATE TYPE "tipo_evento_analytics" AS ENUM ('product_view', 'add_to_cart', 'remove_from_cart', 'supplier_profile_view', 'campaign_view', 'campaign_join', 'begin_checkout', 'purchase', 'search');

-- CreateTable
CREATE TABLE "whatsapp_config" (
    "id_config" SERIAL NOT NULL,
    "id_proveedor" INTEGER NOT NULL,
    "numero_whatsapp" VARCHAR(20) NOT NULL,
    "webhook_token" TEXT NOT NULL,
    "activo" BOOLEAN NOT NULL DEFAULT true,
    "notificar_stock_bajo" BOOLEAN NOT NULL DEFAULT true,
    "notificar_ventas" BOOLEAN NOT NULL DEFAULT true,
    "idioma" VARCHAR(5) NOT NULL DEFAULT 'es',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),

    CONSTRAINT "whatsapp_config_pkey" PRIMARY KEY ("id_config")
);

-- CreateTable
CREATE TABLE "whatsapp_mensajes" (
    "id_mensaje" SERIAL NOT NULL,
    "id_config" INTEGER NOT NULL,
    "numero_remitente" VARCHAR(20) NOT NULL,
    "mensaje_entrante" TEXT NOT NULL,
    "mensaje_respuesta" TEXT,
    "accion" "AccionWhatsApp",
    "id_producto" INTEGER,
    "datos_procesados" JSONB,
    "procesado_exitoso" BOOLEAN NOT NULL DEFAULT false,
    "error" TEXT,
    "fecha_mensaje" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "whatsapp_mensajes_pkey" PRIMARY KEY ("id_mensaje")
);

-- CreateTable
CREATE TABLE "eventos_analytics" (
    "id_evento" BIGSERIAL NOT NULL,
    "id_usuario" INTEGER,
    "id_proveedor" INTEGER,
    "id_producto" INTEGER,
    "id_campana" INTEGER,
    "tipo_evento" "tipo_evento_analytics" NOT NULL,
    "metadata" JSONB,
    "session_id" VARCHAR(100),
    "user_agent" VARCHAR(500),
    "ip_address" VARCHAR(45),
    "referrer" VARCHAR(500),
    "page_url" VARCHAR(1000),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "eventos_analytics_pkey" PRIMARY KEY ("id_evento")
);

-- CreateIndex
CREATE UNIQUE INDEX "whatsapp_config_id_proveedor_key" ON "whatsapp_config"("id_proveedor");

-- CreateIndex
CREATE UNIQUE INDEX "whatsapp_config_webhook_token_key" ON "whatsapp_config"("webhook_token");

-- CreateIndex
CREATE INDEX "whatsapp_mensajes_id_config_fecha_mensaje_idx" ON "whatsapp_mensajes"("id_config", "fecha_mensaje");

-- CreateIndex
CREATE INDEX "whatsapp_mensajes_accion_idx" ON "whatsapp_mensajes"("accion");

-- CreateIndex
CREATE INDEX "eventos_analytics_id_proveedor_created_at_idx" ON "eventos_analytics"("id_proveedor", "created_at");

-- CreateIndex
CREATE INDEX "eventos_analytics_id_producto_tipo_evento_created_at_idx" ON "eventos_analytics"("id_producto", "tipo_evento", "created_at");

-- CreateIndex
CREATE INDEX "eventos_analytics_id_usuario_created_at_idx" ON "eventos_analytics"("id_usuario", "created_at");

-- CreateIndex
CREATE INDEX "eventos_analytics_tipo_evento_created_at_idx" ON "eventos_analytics"("tipo_evento", "created_at");

-- CreateIndex
CREATE INDEX "eventos_analytics_session_id_idx" ON "eventos_analytics"("session_id");

-- AddForeignKey
ALTER TABLE "whatsapp_config" ADD CONSTRAINT "whatsapp_config_id_proveedor_fkey" FOREIGN KEY ("id_proveedor") REFERENCES "proveedores"("id_proveedor") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "whatsapp_mensajes" ADD CONSTRAINT "whatsapp_mensajes_id_config_fkey" FOREIGN KEY ("id_config") REFERENCES "whatsapp_config"("id_config") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "whatsapp_mensajes" ADD CONSTRAINT "whatsapp_mensajes_id_producto_fkey" FOREIGN KEY ("id_producto") REFERENCES "productos"("id_producto") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "eventos_analytics" ADD CONSTRAINT "eventos_analytics_id_usuario_fkey" FOREIGN KEY ("id_usuario") REFERENCES "usuarios"("id_usuario") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "eventos_analytics" ADD CONSTRAINT "eventos_analytics_id_proveedor_fkey" FOREIGN KEY ("id_proveedor") REFERENCES "proveedores"("id_proveedor") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "eventos_analytics" ADD CONSTRAINT "eventos_analytics_id_producto_fkey" FOREIGN KEY ("id_producto") REFERENCES "productos"("id_producto") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "eventos_analytics" ADD CONSTRAINT "eventos_analytics_id_campana_fkey" FOREIGN KEY ("id_campana") REFERENCES "compras_colectivas"("id_campana") ON DELETE SET NULL ON UPDATE CASCADE;
