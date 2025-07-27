
import { FormulationData } from "../types";

export const acidFormulation: FormulationData = {
  id: 5,
  name: "Acid",
  slug: "acid",
  category: "Industrial Cleaners",
  description: "General purpose acid cleaner for heavy-duty cleaning",
  baseYield: 10.00, // Total quantity from ingredients
  ingredients: [
    { slNo: 1, particulars: "Hydrochloric Acid", uom: "LTR", qty: 10.0, rate: 20, amount: 10 * 20 },  
  ],
  costPerLtr: 20.00,
  costPer500ML: 0, // Auto-calculated
  costPer1L: 0, // Auto-calculated
  costPer5L: 0, // Auto-calculated
  costPer500MLBottle: null,
  costPer1LBottle: 6.00,
  costPer5LBottle: 21.00,
  methodOfPreparation: [
    "Carefully add hydrochloric acid to a acid-resistant vessel",
    "Add color for identification",
    "Mix gently",
    "Store in acid-resistant containers"
  ]
};
