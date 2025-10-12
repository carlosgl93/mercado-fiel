export const useProductPricing = (product: any, cartQuantity: number) => {
  const calculateCurrentPrice = (basePrice: number, quantity: number, discounts: any[]) => {
    if (!discounts || discounts.length === 0) return basePrice;

    // Find the applicable discount based on quantity
    const applicableDiscount = discounts
      .filter((d) => quantity >= d.cantidadMinima)
      .sort((a, b) => b.cantidadMinima - a.cantidadMinima)[0];

    if (!applicableDiscount) return basePrice;

    // Use the correct property name and ensure it's a valid number
    const discountPercentage =
      applicableDiscount.descuentoPorcentaje || applicableDiscount.porcentajeDescuento || 0;
    return basePrice * (1 - discountPercentage / 100);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'CLP',
    }).format(amount);
  };

  if (!product) {
    return {
      currentPrice: 0,
      totalPrice: 0,
      effectiveQuantity: 0,
      formatCurrency,
      calculateCurrentPrice,
    };
  }

  const effectiveQuantity = cartQuantity || 1;
  const currentPrice = calculateCurrentPrice(
    product.precioUnitario,
    effectiveQuantity,
    product.descuentosCantidad || [],
  );
  const totalPrice = currentPrice * effectiveQuantity;

  return {
    currentPrice,
    totalPrice,
    effectiveQuantity,
    formatCurrency,
    calculateCurrentPrice,
  };
};