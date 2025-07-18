/*
  Warnings:

  - You are about to drop the column `clientesId_cliente` on the `comentarios` table. All the data in the column will be lost.
  - You are about to drop the column `clientesId_cliente` on the `solicitudescontacto` table. All the data in the column will be lost.
  - You are about to drop the `UsuarioRol` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "UsuarioRol" DROP CONSTRAINT "UsuarioRol_id_rol_fkey";

-- DropForeignKey
ALTER TABLE "UsuarioRol" DROP CONSTRAINT "UsuarioRol_id_usuario_fkey";

-- DropForeignKey
ALTER TABLE "comentarios" DROP CONSTRAINT "comentarios_clientesId_cliente_fkey";

-- DropForeignKey
ALTER TABLE "solicitudescontacto" DROP CONSTRAINT "solicitudescontacto_clientesId_cliente_fkey";

-- AlterTable
ALTER TABLE "comentarios" DROP COLUMN "clientesId_cliente";

-- AlterTable
ALTER TABLE "solicitudescontacto" DROP COLUMN "clientesId_cliente";

-- DropTable
DROP TABLE "UsuarioRol";

-- CreateTable
CREATE TABLE "usuario_rol" (
    "id_usuario" INTEGER NOT NULL,
    "id_rol" INTEGER NOT NULL,

    CONSTRAINT "usuario_rol_pkey" PRIMARY KEY ("id_usuario","id_rol")
);

-- AddForeignKey
ALTER TABLE "usuario_rol" ADD CONSTRAINT "usuario_rol_id_usuario_fkey" FOREIGN KEY ("id_usuario") REFERENCES "usuarios"("id_usuario") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "usuario_rol" ADD CONSTRAINT "usuario_rol_id_rol_fkey" FOREIGN KEY ("id_rol") REFERENCES "roles"("id_rol") ON DELETE RESTRICT ON UPDATE CASCADE;
