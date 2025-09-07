
import { FormulationData } from "../types";

export const roseWaterFormulation: FormulationData = {
  id: 10,
  name: "Rose Water",
  slug: "rose-water",
  category: "Personal Care",
  description: "Pure rose water for skincare and aromatherapy",
  baseYield: 10.00, // Total quantity from ingredients
  manualTotalQuantity: undefined, // Set to override auto-calculated quantity (e.g., 9.1)
  ingredients: [
    { slNo: 1, particulars: "RO Water", uom: "LTR", qty: 9.0, rate: 0.5, amount: 9.0 * 0.5 },
    { slNo: 2, particulars: "Rose Extract", uom: "LTR", qty: 0.1, rate: 1000, amount: 0.1 * 1000 }
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