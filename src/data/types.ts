
export interface Ingredient {
  slNo: number;
  particulars: string;
  uom: string;
  qty: number;
  rate: number;
  amount: number;
}

export interface FormulationData {
  id: number;
  name: string;
  slug: string;
  category: string;
  description: string;
  ingredients: Ingredient[];
  baseYield: number; // Base yield for the formulation
  manualTotalQuantity?: number; // Optional manual override for total quantity
  costPer500ML: number;
  costPer1L: number;
  costPer5L: number;
  costPer500MLBottle: number | null;
  costPer1LBottle: number | null;
  costPer5LBottle: number | null;
  methodOfPreparation: string[];
}

export interface PricingData {
  id: number;
  product: string;
  uom?: string;
  minimumOrder?: number;
  retailPrice: number;
  bulkPrice5Ltr?: number;
}

export interface PackingData {
  id: number;
  product: string;
  minimumOrder: number;
  retailPrice: number;
}
