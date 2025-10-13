
import { FormulationData } from "../types";

export const detergentPowderFormulation: FormulationData = {
  id: 9,
  name: "Detergent Powder",
  slug: "detergent-powder",
  category: "Laundry Care",
  description: "High-efficiency detergent powder for all fabrics",
  baseYield: 6, // Total quantity from ingredients
  TotalQuantity: undefined, // Set to override auto-calculated quantity (e.g., 8.2)
  ingredients: [
    { slNo: 1, particulars: "Soda Ash", uom: "KGS", qty: 4.0, rate: 60, amount: 4.0 * 60 },
    { slNo: 2, particulars: "Acid Slury", uom: "KGS", qty: 1.0, rate: 180, amount: 1.0 * 180 },
    { slNo: 3, particulars: "SS", uom: "KGS", qty: 1.0, rate: 35, amount: 1.0 * 35 },
    { slNo: 4, particulars: "Jasmine Perfume", uom: "KGS", qty: 0.025, rate: 1000, amount: 0.025 * 1000 },
    { slNo: 5, particulars: "TSP", uom: "KGS", qty: 0.5, rate: 30, amount: 0.5 * 30 },
    { slNo: 6, particulars: "Crystals", uom: "KGS", qty: 0.1, rate: 80, amount: 0.1 * 80 },
    { slNo: 7, particulars: "Tinopal", uom: "KGS", qty: 0.025, rate: 220, amount: 0.025 * 220 },
    { slNo: 8, particulars: "Robin Blue", uom: "KGS", qty: 0.01, rate: 400, amount: 0.01 * 400 }
  ],
  costPer500ML: 0, // Auto-calculated
  costPer1L: 0, // Auto-calculated
  costPer5L: 0, // Auto-calculated
  costPer500MLBottle: 1.00,
  costPer1LBottle: 2.00,
  costPer5LBottle: null,
  methodOfPreparation: [
    "Mix all dry ingredients thoroughly",
    "Add perfume and mix well",
    "Ensure uniform distribution",
    "Pack in moisture-proof containers"
  ]
};