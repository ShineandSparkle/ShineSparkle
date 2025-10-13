
import { FormulationData } from "../types";

export const phenylFormulation: FormulationData = {
  id: 1,
  name: "Phenyl",
  slug: "phenyl",
  category: "Household Cleaners",
  description: "Multi-surface phenyl cleaning formulation with excellent disinfecting properties",
  baseYield: 10.00, // Total quantity from ingredients
  TotalQuantity: undefined, // Set to override auto-calculated quantity (e.g., 10.09)
  ingredients: [
    { slNo: 1, particulars: "Phenyl Concentrate", uom: "KGS", qty: 1.0, rate: 180, amount: 1.0 * 180 },
    { slNo: 2, particulars: "Perfume", uom: "LTR", qty: 0.03, rate: 1000, amount: 0.03 * 1000 },
    { slNo: 3, particulars: "Color", uom: "LTR", qty: 0.03, rate: 400, amount: 0.03 * 400 },
    { slNo: 4, particulars: "Alphox 200", uom: "LTR", qty: 0.03, rate: 240, amount: 0.03 * 240 },
    { slNo: 5, particulars: "RO Water", uom: "LTR", qty: 10, rate: 0.5, amount: 10 * 0.5 }
  ],
  costPer500ML: 0, // Auto-calculated
  costPer1L: 0, // Auto-calculated
  costPer5L: 0, // Auto-calculated
  costPer500MLBottle: null,
  costPer1LBottle: 6.00,
  costPer5LBottle: 21.00,
  methodOfPreparation: [
    "Take clean water in mixing tank",
    "Add phenyl concentrate slowly while stirring",
    "Add color for product appeal",
    "Add perfume for pleasant fragrance",
    "Mix thoroughly for uniform consistency",
    "Check pH level (should be around 9-10)",
    "Filter if necessary",
    "Fill in bottles"
  ]
};
