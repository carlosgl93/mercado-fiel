/*
  Warnings:

  - A unique constraint covering the columns `[auth_uid]` on the table `usuarios` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "descuentos_cantidad" ALTER COLUMN "updated_at" SET DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "productos" ADD COLUMN     "unit_type" VARCHAR(10) DEFAULT 'unit',
ALTER COLUMN "updated_at" SET DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "usuarios" ADD COLUMN     "auth_uid" UUID;

-- CreateIndex
CREATE UNIQUE INDEX "idx_usuarios_auth_uid" ON "usuarios"("auth_uid");
