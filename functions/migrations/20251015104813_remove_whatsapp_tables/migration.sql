/*
  Warnings:

  - You are about to drop the `whatsapp_config` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `whatsapp_mensajes` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "whatsapp_config" DROP CONSTRAINT "whatsapp_config_id_proveedor_fkey";

-- DropForeignKey
ALTER TABLE "whatsapp_mensajes" DROP CONSTRAINT "whatsapp_mensajes_id_config_fkey";

-- DropForeignKey
ALTER TABLE "whatsapp_mensajes" DROP CONSTRAINT "whatsapp_mensajes_id_producto_fkey";

-- DropTable
DROP TABLE "whatsapp_config";

-- DropTable
DROP TABLE "whatsapp_mensajes";
