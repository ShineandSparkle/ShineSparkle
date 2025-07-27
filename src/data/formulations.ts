
import { FormulationData, PricingData, PackingData } from "./types";
import { formulationsData } from "./formulationsList";
import { productPricesData, packingMaterialsData } from "./pricingData";

export const getFormulationById = (id: number): FormulationData | undefined => {
  return formulationsData.find(formulation => formulation.id === id);
};

export const getFormulationBySlug = (slug: string): FormulationData | undefined => {
  return formulationsData.find(formulation => formulation.slug === slug);
};

export const getProductPrices = (): PricingData[] => {
  return productPricesData;
};

export const getPackingMaterials = (): PackingData[] => {
  return packingMaterialsData;
};

// Re-export types and data for backward compatibility
export type { FormulationData, PricingData, PackingData, Ingredient } from "./types";
export { formulationsData, productPricesData, packingMaterialsData };
