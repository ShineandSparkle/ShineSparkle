
import { FormulationData } from "../types";

export const roseWaterFormulation: FormulationData = {
  id: 10,
  name: "Rose Water",
  slug: "rose-water",
  category: "Personal Care",
  description: "Pure rose water for skincare and aromatherapy",
  baseYield: 5.00, // Total quantity from ingredients
  TotalQuantity: undefined, // Set to override auto-calculated quantity (e.g., 9.1)
  ingredients: [
    { slNo: 1, particulars: "RO Water", uom: "LTR", qty: 5.0, rate: 0.5, amount: 5.0 * 0.5 },
    { slNo: 2, particulars: "Rose Extract", uom: "LTR", qty: 0.025, rate: 1000, amount: 0.025 * 1000 }
  ],
  costPer500ML: 0, // Auto-calculated
  costPer1L: 0, // Auto-calculated  
  costPer5L: 0, // Auto-calculated
  costPer500MLBottle: null,
  costPer1LBottle: 6.00,
  costPer5LBottle: null,
  methodOfPreparation: [
    "Take distilled water",
    "Add rose extract",
    "Add preservative",
    "Mix gently",
    "Filter and bottle"
  ]
};