-- AlterTable
ALTER TABLE "compras_colectivas" ADD COLUMN     "id_descuento_aplicado" INTEGER,
ALTER COLUMN "max_participantes" SET DEFAULT 5;

-- AddForeignKey
ALTER TABLE "compras_colectivas" ADD CONSTRAINT "compras_colectivas_id_descuento_aplicado_fkey" FOREIGN KEY ("id_descuento_aplicado") REFERENCES "descuentos_cantidad"("id_descuento") ON DELETE SET NULL ON UPDATE CASCADE;
