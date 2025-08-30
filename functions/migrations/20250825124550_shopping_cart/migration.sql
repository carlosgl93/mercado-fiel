-- CreateTable
CREATE TABLE "descuentos_cantidad" (
    "id_descuento" SERIAL NOT NULL,
    "id_producto" INTEGER NOT NULL,
    "cantidad_minima" INTEGER NOT NULL,
    "descuento_porcentaje" DECIMAL(5,2) NOT NULL,
    "precio_descuento" DECIMAL(10,2),
    "activo" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "descuentos_cantidad_pkey" PRIMARY KEY ("id_descuento")
);

-- CreateTable
CREATE TABLE "carrito" (
    "id_carrito" SERIAL NOT NULL,
    "id_usuario" INTEGER NOT NULL,
    "id_producto" INTEGER NOT NULL,
    "cantidad" INTEGER NOT NULL,
    "precio_unitario" DECIMAL(10,2) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "carrito_pkey" PRIMARY KEY ("id_carrito")
);

-- CreateIndex
CREATE UNIQUE INDEX "descuentos_cantidad_id_producto_cantidad_minima_key" ON "descuentos_cantidad"("id_producto", "cantidad_minima");

-- CreateIndex
CREATE UNIQUE INDEX "carrito_id_usuario_id_producto_key" ON "carrito"("id_usuario", "id_producto");

-- AddForeignKey
ALTER TABLE "descuentos_cantidad" ADD CONSTRAINT "descuentos_cantidad_id_producto_fkey" FOREIGN KEY ("id_producto") REFERENCES "productos"("id_producto") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "carrito" ADD CONSTRAINT "carrito_id_usuario_fkey" FOREIGN KEY ("id_usuario") REFERENCES "usuarios"("id_usuario") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "carrito" ADD CONSTRAINT "carrito_id_producto_fkey" FOREIGN KEY ("id_producto") REFERENCES "productos"("id_producto") ON DELETE RESTRICT ON UPDATE CASCADE;
