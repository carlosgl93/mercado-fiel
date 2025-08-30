/**
 * Utility functions for converting between camelCase and snake_case
 * Used for frontend-backend data mapping
 */

// Convert camelCase to snake_case
export const toSnakeCase = (str: string): string => {
  return str.replace(/[A-Z]/g, (letter) => `_${letter.toLowerCase()}`);
};

// Convert snake_case to camelCase
export const toCamelCase = (str: string): string => {
  return str.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase());
};

// Convert object keys from camelCase to snake_case
export const objectToSnakeCase = (obj: any): any => {
  if (obj === null || obj === undefined) return obj;

  if (Array.isArray(obj)) {
    return obj.map(objectToSnakeCase);
  }

  if (typeof obj === 'object' && obj.constructor === Object) {
    const converted: any = {};
    Object.keys(obj).forEach((key) => {
      const snakeKey = toSnakeCase(key);
      converted[snakeKey] = objectToSnakeCase(obj[key]);
    });
    return converted;
  }

  return obj;
};

// Convert object keys from snake_case to camelCase
export const objectToCamelCase = (obj: any): any => {
  if (obj === null || obj === undefined) return obj;

  if (Array.isArray(obj)) {
    return obj.map(objectToCamelCase);
  }

  if (typeof obj === 'object' && obj.constructor === Object) {
    const converted: any = {};
    Object.keys(obj).forEach((key) => {
      const camelKey = toCamelCase(key);
      converted[camelKey] = objectToCamelCase(obj[key]);
    });
    return converted;
  }

  return obj;
};

// Specific mapping functions for common API responses
export const mapProductFromApi = (product: any) => {
  return objectToCamelCase(product);
};

export const mapProductToApi = (product: any) => {
  return objectToSnakeCase(product);
};

export const mapQuantityDiscountFromApi = (discount: any) => {
  return objectToCamelCase(discount);
};

export const mapQuantityDiscountToApi = (discount: any) => {
  return objectToSnakeCase(discount);
};

// Category mapping functions
export const mapCategoryFromApi = (category: any) => {
  return objectToCamelCase(category);
};

export const mapCategoryToApi = (category: any) => {
  return objectToSnakeCase(category);
};

// Cart item mapping functions
export const mapCartItemFromApi = (cartItem: any) => {
  return objectToCamelCase(cartItem);
};

export const mapCartItemToApi = (cartItem: any) => {
  return objectToSnakeCase(cartItem);
};
