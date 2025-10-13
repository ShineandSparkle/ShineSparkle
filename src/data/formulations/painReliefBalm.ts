
import { FormulationData } from "../types";

export const painReliefBalmFormulation: FormulationData = {
  id: 11,
  name: "Pain Relief Balm",
  slug: "pain-relief-balm",
  category: "Personal Care",
  description: "Herbal pain relief balm similar to Zandu Balm",
  baseYield: 0.250, // Total quantity from ingredients
  TotalQuantity: undefined, // Set to override auto-calculated quantity (e.g., 10.0)
  ingredients: [
    { slNo: 1, particulars: "Balm Pack", uom: "KGS", qty: 0.25, rate: 880, amount: 0.25 * 880 }
  ],
  costPer500ML: 0, // Auto-calculated
  costPer1L: 0, // Auto-calculated  
  costPer5L: 0, // Auto-calculated
  costPer500MLBottle: 15.00,
  costPer1LBottle: null,
  costPer5LBottle: null,
  methodOfPreparation: [
    "Melt petroleum jelly gently",
    "Add menthol and camphor",
    "Add essential oils",
    "Mix thoroughly while cooling",
    "Pour into containers before setting"
  ]
};