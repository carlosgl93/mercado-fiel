/*
  Warnings:

  - You are about to drop the column `direccion` on the `clientes` table. All the data in the column will be lost.
  - You are about to drop the column `direccion_entrega` on the `pedidos` table. All the data in the column will be lost.
  - You are about to drop the column `direccion` on the `proveedores` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "clientes" DROP COLUMN "direccion",
ADD COLUMN     "id_direccion" INTEGER;

-- AlterTable
ALTER TABLE "pedidos" DROP COLUMN "direccion_entrega",
ADD COLUMN     "costo_envio" DECIMAL(8,2),
ADD COLUMN     "id_direccion_entrega" INTEGER;

-- AlterTable
ALTER TABLE "proveedores" DROP COLUMN "direccion",
ADD COLUMN     "cobra_envio" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "envio_gratis_desde" DECIMAL(10,2),
ADD COLUMN     "id_direccion" INTEGER,
ADD COLUMN     "radio_entrega_km" INTEGER DEFAULT 10;

-- CreateTable
CREATE TABLE "regiones" (
    "id_region" SERIAL NOT NULL,
    "codigo_region" VARCHAR(10) NOT NULL,
    "nombre" VARCHAR(100) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "regiones_pkey" PRIMARY KEY ("id_region")
);

-- CreateTable
CREATE TABLE "comunas" (
    "id_comuna" SERIAL NOT NULL,
    "id_region" INTEGER NOT NULL,
    "nombre" VARCHAR(100) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "comunas_pkey" PRIMARY KEY ("id_comuna")
);

-- CreateTable
CREATE TABLE "direcciones" (
    "id_direccion" SERIAL NOT NULL,
    "calle" VARCHAR(200) NOT NULL,
    "numero" VARCHAR(20),
    "departamento" VARCHAR(20),
    "id_comuna" INTEGER NOT NULL,
    "id_region" INTEGER NOT NULL,
    "codigo_postal" VARCHAR(10),
    "referencia" TEXT,
    "latitud" DECIMAL(9,6),
    "longitud" DECIMAL(9,6),
    "direccion_completa" TEXT,
    "activa" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "direcciones_pkey" PRIMARY KEY ("id_direccion")
);

-- CreateTable
CREATE TABLE "areas_servicio" (
    "id_area" SERIAL NOT NULL,
    "id_proveedor" INTEGER NOT NULL,
    "tipo" VARCHAR(20) NOT NULL,
    "id_comuna" INTEGER,
    "id_region" INTEGER,
    "radio_km" INTEGER,
    "costo_envio" DECIMAL(8,2),
    "tiempo_entrega_dias" INTEGER DEFAULT 3,
    "activa" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "areas_servicio_pkey" PRIMARY KEY ("id_area")
);

-- CreateIndex
CREATE UNIQUE INDEX "regiones_codigo_region_key" ON "regiones"("codigo_region");

-- AddForeignKey
ALTER TABLE "comunas" ADD CONSTRAINT "comunas_id_region_fkey" FOREIGN KEY ("id_region") REFERENCES "regiones"("id_region") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "direcciones" ADD CONSTRAINT "direcciones_id_comuna_fkey" FOREIGN KEY ("id_comuna") REFERENCES "comunas"("id_comuna") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "direcciones" ADD CONSTRAINT "direcciones_id_region_fkey" FOREIGN KEY ("id_region") REFERENCES "regiones"("id_region") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "proveedores" ADD CONSTRAINT "proveedores_id_direccion_fkey" FOREIGN KEY ("id_direccion") REFERENCES "direcciones"("id_direccion") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "areas_servicio" ADD CONSTRAINT "areas_servicio_id_proveedor_fkey" FOREIGN KEY ("id_proveedor") REFERENCES "proveedores"("id_proveedor") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "clientes" ADD CONSTRAINT "clientes_id_direccion_fkey" FOREIGN KEY ("id_direccion") REFERENCES "direcciones"("id_direccion") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pedidos" ADD CONSTRAINT "pedidos_id_direccion_entrega_fkey" FOREIGN KEY ("id_direccion_entrega") REFERENCES "direcciones"("id_direccion") ON DELETE SET NULL ON UPDATE CASCADE;
