
import { FormulationData } from "../types";

export const floorCleaningFormulation: FormulationData = {
  id: 8,
  name: "Floor Cleaning Liquid",
  slug: "floor-cleaning-liquid",
  category: "Household Cleaners",
  description: "All-purpose floor cleaner with pleasant fragrance",
  baseYield: 10, // Total quantity from ingredients
  manualTotalQuantity: undefined, // Set to override auto-calculated quantity (e.g., 10.1)
  ingredients: [
    { slNo: 1, particulars: "RO Water", uom: "LTR", qty: 8.5, rate: 0.5, amount: 8.5 * 0.5 },
    { slNo: 2, particulars: "BKC", uom: "LTR", qty: 0.5, rate: 150, amount: 0.5 * 150 },
    { slNo: 3, particulars: "SLES", uom: "KGS", qty: 1, rate: 200, amount: 1.0 * 100 },
    { slNo: 4, particulars: "Color", uom: "LTR", qty: 0.05, rate: 400, amount: 0.05 * 400 },
    { slNo: 5, particulars: "Perfume", uom: "LTR", qty: 0.05, rate: 1000, amount: 0.05 * 1000 }
  ],
  costPer500ML: 0, // Auto-calculated
  costPer1L: 0, // Auto-calculated
  costPer5L: 0, // Auto-calculated
  costPer500MLBottle: 10.00,
  costPer1LBottle: 16.00,
  costPer5LBottle: null,
  methodOfPreparation: [
    "Mix water and BKC",
    "Add SLES for cleaning action",
    "Add color for appeal",
    "Add perfume for fragrance",
    "Mix thoroughly"
  ]
};
