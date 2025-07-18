/*
  Warnings:

  - You are about to drop the column `plan_actual` on the `proveedores` table. All the data in the column will be lost.
  - You are about to drop the column `tipo_usuario` on the `usuarios` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[id_usuario]` on the table `proveedores` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `id_usuario` to the `proveedores` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "comentarios" ADD COLUMN     "clientesId_cliente" INTEGER;

-- AlterTable
ALTER TABLE "pagos" ADD COLUMN     "id_pedido" INTEGER;

-- AlterTable
ALTER TABLE "proveedores" DROP COLUMN "plan_actual",
ADD COLUMN     "id_usuario" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "solicitudescontacto" ADD COLUMN     "clientesId_cliente" INTEGER;

-- AlterTable
ALTER TABLE "usuarios" DROP COLUMN "tipo_usuario",
ADD COLUMN     "id_plan" INTEGER;

-- CreateTable
CREATE TABLE "roles" (
    "id_rol" SERIAL NOT NULL,
    "nombre" VARCHAR(50) NOT NULL,
    "descripcion" TEXT,

    CONSTRAINT "roles_pkey" PRIMARY KEY ("id_rol")
);

-- CreateTable
CREATE TABLE "UsuarioRol" (
    "id_usuario" INTEGER NOT NULL,
    "id_rol" INTEGER NOT NULL,

    CONSTRAINT "UsuarioRol_pkey" PRIMARY KEY ("id_usuario","id_rol")
);

-- CreateTable
CREATE TABLE "clientes" (
    "id_cliente" SERIAL NOT NULL,
    "id_usuario" INTEGER NOT NULL,
    "direccion" VARCHAR(150),
    "telefono" VARCHAR(20),
    "fecha_registro" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "clientes_pkey" PRIMARY KEY ("id_cliente")
);

-- CreateTable
CREATE TABLE "compras_colectivas" (
    "id_campana" SERIAL NOT NULL,
    "nombre" VARCHAR(100) NOT NULL,
    "descripcion" TEXT,
    "id_proveedor" INTEGER NOT NULL,
    "id_producto" INTEGER NOT NULL,
    "precio_objetivo" DECIMAL(10,2) NOT NULL,
    "cantidad_objetivo" INTEGER NOT NULL,
    "min_participantes" INTEGER,
    "max_participantes" INTEGER,
    "cantidad_min_usuario" INTEGER NOT NULL DEFAULT 1,
    "cantidad_max_usuario" INTEGER,
    "requiere_aprobacion" BOOLEAN NOT NULL DEFAULT false,
    "fecha_inicio" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "fecha_fin" TIMESTAMP(3),
    "estado" TEXT NOT NULL DEFAULT 'abierta',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "compras_colectivas_pkey" PRIMARY KEY ("id_campana")
);

-- CreateTable
CREATE TABLE "participantes_colectivos" (
    "id_participante" SERIAL NOT NULL,
    "id_campana" INTEGER NOT NULL,
    "id_usuario" INTEGER NOT NULL,
    "cantidad" INTEGER NOT NULL,
    "monto_aportado" DECIMAL(10,2) NOT NULL,
    "fecha_aporte" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "estado" TEXT NOT NULL DEFAULT 'activo',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "participantes_colectivos_pkey" PRIMARY KEY ("id_participante")
);

-- CreateTable
CREATE TABLE "escalas_precios" (
    "id_escala" SERIAL NOT NULL,
    "id_campana" INTEGER NOT NULL,
    "cantidad_minima" INTEGER NOT NULL,
    "precio_unitario" DECIMAL(10,2) NOT NULL,
    "descuento_porcentaje" DECIMAL(5,2),
    "activa" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "escalas_precios_pkey" PRIMARY KEY ("id_escala")
);

-- CreateTable
CREATE TABLE "progreso_campanas" (
    "id_progreso" SERIAL NOT NULL,
    "id_campana" INTEGER NOT NULL,
    "participantes_actuales" INTEGER NOT NULL DEFAULT 0,
    "cantidad_actual" INTEGER NOT NULL DEFAULT 0,
    "monto_recaudado" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "porcentaje_completado" DECIMAL(5,2) NOT NULL DEFAULT 0,
    "precio_actual" DECIMAL(10,2),
    "siguiente_tier" INTEGER,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "progreso_campanas_pkey" PRIMARY KEY ("id_progreso")
);

-- CreateTable
CREATE TABLE "pedidos" (
    "id_pedido" SERIAL NOT NULL,
    "id_usuario" INTEGER NOT NULL,
    "tipo_pedido" TEXT NOT NULL,
    "id_campana" INTEGER,
    "total" DECIMAL(10,2) NOT NULL,
    "estado" TEXT NOT NULL DEFAULT 'pendiente',
    "fecha_pedido" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "fecha_entrega" TIMESTAMP(3),
    "direccion_entrega" VARCHAR(200),
    "notas" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "pedidos_pkey" PRIMARY KEY ("id_pedido")
);

-- CreateTable
CREATE TABLE "items_pedido" (
    "id_item" SERIAL NOT NULL,
    "id_pedido" INTEGER NOT NULL,
    "id_producto" INTEGER NOT NULL,
    "cantidad" INTEGER NOT NULL,
    "precio_unitario" DECIMAL(10,2) NOT NULL,
    "subtotal" DECIMAL(10,2) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "items_pedido_pkey" PRIMARY KEY ("id_item")
);

-- CreateTable
CREATE TABLE "notificaciones" (
    "id_notificacion" SERIAL NOT NULL,
    "id_usuario" INTEGER NOT NULL,
    "tipo" TEXT NOT NULL,
    "titulo" VARCHAR(200) NOT NULL,
    "mensaje" TEXT NOT NULL,
    "leida" BOOLEAN NOT NULL DEFAULT false,
    "id_campana" INTEGER,
    "url_accion" VARCHAR(255),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "notificaciones_pkey" PRIMARY KEY ("id_notificacion")
);

-- CreateTable
CREATE TABLE "lista_deseos" (
    "id_lista" SERIAL NOT NULL,
    "id_usuario" INTEGER NOT NULL,
    "id_producto" INTEGER NOT NULL,
    "notificar_campana" BOOLEAN NOT NULL DEFAULT true,
    "cantidad_deseada" INTEGER,
    "precio_maximo" DECIMAL(10,2),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "lista_deseos_pkey" PRIMARY KEY ("id_lista")
);

-- CreateIndex
CREATE UNIQUE INDEX "roles_nombre_key" ON "roles"("nombre");

-- CreateIndex
CREATE UNIQUE INDEX "clientes_id_usuario_key" ON "clientes"("id_usuario");

-- CreateIndex
CREATE UNIQUE INDEX "participantes_colectivos_id_campana_id_usuario_key" ON "participantes_colectivos"("id_campana", "id_usuario");

-- CreateIndex
CREATE UNIQUE INDEX "progreso_campanas_id_campana_key" ON "progreso_campanas"("id_campana");

-- CreateIndex
CREATE UNIQUE INDEX "lista_deseos_id_usuario_id_producto_key" ON "lista_deseos"("id_usuario", "id_producto");

-- CreateIndex
CREATE UNIQUE INDEX "proveedores_id_usuario_key" ON "proveedores"("id_usuario");

-- AddForeignKey
ALTER TABLE "usuarios" ADD CONSTRAINT "usuarios_id_plan_fkey" FOREIGN KEY ("id_plan") REFERENCES "planes"("id_plan") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UsuarioRol" ADD CONSTRAINT "UsuarioRol_id_usuario_fkey" FOREIGN KEY ("id_usuario") REFERENCES "usuarios"("id_usuario") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UsuarioRol" ADD CONSTRAINT "UsuarioRol_id_rol_fkey" FOREIGN KEY ("id_rol") REFERENCES "roles"("id_rol") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "proveedores" ADD CONSTRAINT "proveedores_id_usuario_fkey" FOREIGN KEY ("id_usuario") REFERENCES "usuarios"("id_usuario") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "clientes" ADD CONSTRAINT "clientes_id_usuario_fkey" FOREIGN KEY ("id_usuario") REFERENCES "usuarios"("id_usuario") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "comentarios" ADD CONSTRAINT "comentarios_clientesId_cliente_fkey" FOREIGN KEY ("clientesId_cliente") REFERENCES "clientes"("id_cliente") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "solicitudescontacto" ADD CONSTRAINT "solicitudescontacto_clientesId_cliente_fkey" FOREIGN KEY ("clientesId_cliente") REFERENCES "clientes"("id_cliente") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pagos" ADD CONSTRAINT "pagos_id_pedido_fkey" FOREIGN KEY ("id_pedido") REFERENCES "pedidos"("id_pedido") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "compras_colectivas" ADD CONSTRAINT "compras_colectivas_id_proveedor_fkey" FOREIGN KEY ("id_proveedor") REFERENCES "proveedores"("id_proveedor") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "compras_colectivas" ADD CONSTRAINT "compras_colectivas_id_producto_fkey" FOREIGN KEY ("id_producto") REFERENCES "productos"("id_producto") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "participantes_colectivos" ADD CONSTRAINT "participantes_colectivos_id_campana_fkey" FOREIGN KEY ("id_campana") REFERENCES "compras_colectivas"("id_campana") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "participantes_colectivos" ADD CONSTRAINT "participantes_colectivos_id_usuario_fkey" FOREIGN KEY ("id_usuario") REFERENCES "usuarios"("id_usuario") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "escalas_precios" ADD CONSTRAINT "escalas_precios_id_campana_fkey" FOREIGN KEY ("id_campana") REFERENCES "compras_colectivas"("id_campana") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "progreso_campanas" ADD CONSTRAINT "progreso_campanas_id_campana_fkey" FOREIGN KEY ("id_campana") REFERENCES "compras_colectivas"("id_campana") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pedidos" ADD CONSTRAINT "pedidos_id_usuario_fkey" FOREIGN KEY ("id_usuario") REFERENCES "usuarios"("id_usuario") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pedidos" ADD CONSTRAINT "pedidos_id_campana_fkey" FOREIGN KEY ("id_campana") REFERENCES "compras_colectivas"("id_campana") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "items_pedido" ADD CONSTRAINT "items_pedido_id_pedido_fkey" FOREIGN KEY ("id_pedido") REFERENCES "pedidos"("id_pedido") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "items_pedido" ADD CONSTRAINT "items_pedido_id_producto_fkey" FOREIGN KEY ("id_producto") REFERENCES "productos"("id_producto") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "notificaciones" ADD CONSTRAINT "notificaciones_id_usuario_fkey" FOREIGN KEY ("id_usuario") REFERENCES "usuarios"("id_usuario") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "notificaciones" ADD CONSTRAINT "notificaciones_id_campana_fkey" FOREIGN KEY ("id_campana") REFERENCES "compras_colectivas"("id_campana") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "lista_deseos" ADD CONSTRAINT "lista_deseos_id_usuario_fkey" FOREIGN KEY ("id_usuario") REFERENCES "usuarios"("id_usuario") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "lista_deseos" ADD CONSTRAINT "lista_deseos_id_producto_fkey" FOREIGN KEY ("id_producto") REFERENCES "productos"("id_producto") ON DELETE RESTRICT ON UPDATE CASCADE;
