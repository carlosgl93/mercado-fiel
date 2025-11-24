-- CreateEnum
CREATE TYPE "TipoMovimiento" AS ENUM ('ENTRADA_COMPRA', 'ENTRADA_DEVOLUCION', 'ENTRADA_AJUSTE', 'SALIDA_VENTA', 'SALIDA_DEVOLUCION', 'SALIDA_MERMA', 'SALIDA_AJUSTE', 'RESERVA', 'LIBERACION_RESERVA', 'ENTRADA_REABASTECIMIENTO');

-- CreateEnum
CREATE TYPE "MetodoRegistro" AS ENUM ('MANUAL', 'AUTOMATICO', 'WHATSAPP', 'API', 'IMPORTACION');

-- CreateEnum
CREATE TYPE "TipoAlerta" AS ENUM ('STOCK_BAJO', 'STOCK_CRITICO', 'STOCK_AGOTADO', 'REABASTECIMIENTO_PENDIENTE', 'RESERVA_EXPIRADA');

-- CreateEnum
CREATE TYPE "TipoReserva" AS ENUM ('PEDIDO', 'CAMPANA', 'APARTADO');

-- CreateEnum
CREATE TYPE "EstadoReserva" AS ENUM ('ACTIVA', 'COMPLETADA', 'CANCELADA', 'EXPIRADA');

-- CreateEnum
CREATE TYPE "AccionWhatsApp" AS ENUM ('CONSULTA_STOCK', 'ENTRADA_STOCK', 'SALIDA_STOCK', 'AJUSTE_STOCK', 'ALERTA_CONFIG', 'REPORTE', 'AYUDA');

-- DropForeignKey
ALTER TABLE "compras_colectivas" DROP CONSTRAINT "compras_colectivas_id_descuento_aplicado_fkey";

-- AlterTable
ALTER TABLE "compras_colectivas" ALTER COLUMN "max_participantes" DROP DEFAULT;

-- AlterTable
ALTER TABLE "productos" ADD COLUMN     "alerta_stock_bajo" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "dias_reabastecimiento" INTEGER DEFAULT 7,
ADD COLUMN     "permite_venta_sin_stock" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "stock_actual" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "stock_maximo" INTEGER DEFAULT 999999,
ADD COLUMN     "stock_minimo" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "ultimo_reabastecimiento" TIMESTAMP(3),
ALTER COLUMN "elegible_compra_colectiva" SET DEFAULT true;

-- CreateTable
CREATE TABLE "movimientos_stock" (
    "id_movimiento" SERIAL NOT NULL,
    "id_producto" INTEGER NOT NULL,
    "tipo_movimiento" "TipoMovimiento" NOT NULL,
    "cantidad" INTEGER NOT NULL,
    "stock_previo" INTEGER NOT NULL,
    "stock_resultante" INTEGER NOT NULL,
    "metodo_registro" "MetodoRegistro" NOT NULL DEFAULT 'AUTOMATICO',
    "id_usuario_registro" INTEGER,
    "id_pedido" INTEGER,
    "id_campana" INTEGER,
    "id_reserva" INTEGER,
    "observaciones" TEXT,
    "costo_unitario" DECIMAL(10,2),
    "costo_total" DECIMAL(10,2),
    "numero_factura" VARCHAR(100),
    "fecha_movimiento" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "movimientos_stock_pkey" PRIMARY KEY ("id_movimiento")
);

-- CreateTable
CREATE TABLE "alertas_stock" (
    "id_alerta" SERIAL NOT NULL,
    "id_producto" INTEGER NOT NULL,
    "tipo_alerta" "TipoAlerta" NOT NULL,
    "stock_actual" INTEGER NOT NULL,
    "stock_minimo" INTEGER,
    "mensaje" TEXT NOT NULL,
    "resuelta" BOOLEAN NOT NULL DEFAULT false,
    "fecha_resolucion" TIMESTAMP(3),
    "id_usuario_resolvio" INTEGER,
    "notas_resolucion" TEXT,
    "fecha_alerta" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "alertas_stock_pkey" PRIMARY KEY ("id_alerta")
);

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
CREATE TABLE "reservas_stock" (
    "id_reserva" SERIAL NOT NULL,
    "id_producto" INTEGER NOT NULL,
    "tipo_reserva" "TipoReserva" NOT NULL,
    "cantidad_reservada" INTEGER NOT NULL,
    "estado" "EstadoReserva" NOT NULL DEFAULT 'ACTIVA',
    "id_usuario" INTEGER,
    "id_pedido" INTEGER,
    "id_campana" INTEGER,
    "fecha_reserva" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "fecha_expiracion" TIMESTAMP(3),
    "fecha_liberacion" TIMESTAMP(3),
    "observaciones" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),

    CONSTRAINT "reservas_stock_pkey" PRIMARY KEY ("id_reserva")
);

-- CreateIndex
CREATE INDEX "movimientos_stock_id_producto_fecha_movimiento_idx" ON "movimientos_stock"("id_producto", "fecha_movimiento");

-- CreateIndex
CREATE INDEX "movimientos_stock_tipo_movimiento_idx" ON "movimientos_stock"("tipo_movimiento");

-- CreateIndex
CREATE INDEX "movimientos_stock_metodo_registro_idx" ON "movimientos_stock"("metodo_registro");

-- CreateIndex
CREATE INDEX "alertas_stock_id_producto_resuelta_idx" ON "alertas_stock"("id_producto", "resuelta");

-- CreateIndex
CREATE INDEX "alertas_stock_tipo_alerta_resuelta_idx" ON "alertas_stock"("tipo_alerta", "resuelta");

-- CreateIndex
CREATE UNIQUE INDEX "whatsapp_config_id_proveedor_key" ON "whatsapp_config"("id_proveedor");

-- CreateIndex
CREATE UNIQUE INDEX "whatsapp_config_webhook_token_key" ON "whatsapp_config"("webhook_token");

-- CreateIndex
CREATE INDEX "whatsapp_mensajes_id_config_fecha_mensaje_idx" ON "whatsapp_mensajes"("id_config", "fecha_mensaje");

-- CreateIndex
CREATE INDEX "whatsapp_mensajes_accion_idx" ON "whatsapp_mensajes"("accion");

-- CreateIndex
CREATE INDEX "reservas_stock_id_producto_estado_idx" ON "reservas_stock"("id_producto", "estado");

-- CreateIndex
CREATE INDEX "reservas_stock_estado_fecha_expiracion_idx" ON "reservas_stock"("estado", "fecha_expiracion");

-- CreateIndex
CREATE INDEX "productos_id_proveedor_disponible_idx" ON "productos"("id_proveedor", "disponible");

-- CreateIndex
CREATE INDEX "productos_stock_actual_idx" ON "productos"("stock_actual");

-- AddForeignKey
ALTER TABLE "movimientos_stock" ADD CONSTRAINT "movimientos_stock_id_producto_fkey" FOREIGN KEY ("id_producto") REFERENCES "productos"("id_producto") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "movimientos_stock" ADD CONSTRAINT "movimientos_stock_id_usuario_registro_fkey" FOREIGN KEY ("id_usuario_registro") REFERENCES "usuarios"("id_usuario") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "movimientos_stock" ADD CONSTRAINT "movimientos_stock_id_pedido_fkey" FOREIGN KEY ("id_pedido") REFERENCES "pedidos"("id_pedido") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "movimientos_stock" ADD CONSTRAINT "movimientos_stock_id_campana_fkey" FOREIGN KEY ("id_campana") REFERENCES "compras_colectivas"("id_campana") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "movimientos_stock" ADD CONSTRAINT "movimientos_stock_id_reserva_fkey" FOREIGN KEY ("id_reserva") REFERENCES "reservas_stock"("id_reserva") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "alertas_stock" ADD CONSTRAINT "alertas_stock_id_producto_fkey" FOREIGN KEY ("id_producto") REFERENCES "productos"("id_producto") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "alertas_stock" ADD CONSTRAINT "alertas_stock_id_usuario_resolvio_fkey" FOREIGN KEY ("id_usuario_resolvio") REFERENCES "usuarios"("id_usuario") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "whatsapp_config" ADD CONSTRAINT "whatsapp_config_id_proveedor_fkey" FOREIGN KEY ("id_proveedor") REFERENCES "proveedores"("id_proveedor") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "whatsapp_mensajes" ADD CONSTRAINT "whatsapp_mensajes_id_config_fkey" FOREIGN KEY ("id_config") REFERENCES "whatsapp_config"("id_config") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "whatsapp_mensajes" ADD CONSTRAINT "whatsapp_mensajes_id_producto_fkey" FOREIGN KEY ("id_producto") REFERENCES "productos"("id_producto") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reservas_stock" ADD CONSTRAINT "reservas_stock_id_producto_fkey" FOREIGN KEY ("id_producto") REFERENCES "productos"("id_producto") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reservas_stock" ADD CONSTRAINT "reservas_stock_id_usuario_fkey" FOREIGN KEY ("id_usuario") REFERENCES "usuarios"("id_usuario") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reservas_stock" ADD CONSTRAINT "reservas_stock_id_pedido_fkey" FOREIGN KEY ("id_pedido") REFERENCES "pedidos"("id_pedido") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reservas_stock" ADD CONSTRAINT "reservas_stock_id_campana_fkey" FOREIGN KEY ("id_campana") REFERENCES "compras_colectivas"("id_campana") ON DELETE SET NULL ON UPDATE CASCADE;
