
import { FormulationData } from "../types";

export const whitePetroleumJellyFormulation: FormulationData = {
  id: 12,
  name: "White Petroleum Jelly",
  slug: "white-petroleum-jelly",
  category: "Personal Care",
  description: "Pure white petroleum jelly similar to Vaseline",
  baseYield: 0.25, // Total quantity from ingredients
  TotalQuantity: undefined, // Set to override auto-calculated quantity (e.g., 10.0)
  ingredients: [
    { slNo: 1, particulars: "White Petroleum Jelly Base", uom: "KGS", qty: 0.25, rate: 320, amount: 0.25 * 320 }
  ],
  costPer500ML: 0, // Auto-calculated
  costPer1L: 0, // Auto-calculated  
  costPer5L: 0, // Auto-calculated
  costPer500MLBottle: 15.00,
  costPer1LBottle: null,
  costPer5LBottle: null,
  methodOfPreparation: [
    "Melt petroleum jelly base gently",
    "Add vitamin E for nourishment",
    "Add antioxidant for preservation",
    "Mix thoroughly",
    "Pour into sterile containers"
  ]
};
