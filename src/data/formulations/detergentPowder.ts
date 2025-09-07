
import { FormulationData } from "../types";

export const detergentPowderFormulation: FormulationData = {
  id: 9,
  name: "Detergent Powder",
  slug: "detergent-powder",
  category: "Laundry Care",
  description: "High-efficiency detergent powder for all fabrics",
  baseYield: 8.2, // Total quantity from ingredients
  TotalQuantity: undefined, // Set to override auto-calculated quantity (e.g., 8.2)
  ingredients: [
{ slNo: 1, particulars: "Soda Ash", uom: "KGS", qty: 3.0, rate: 25, amount: 3.0 * 25 },
{ slNo: 2, particulars: "Linear Alkyl Benzene", uom: "KGS", qty: 2.0, rate: 180, amount: 2.0 * 180 },
{ slNo: 3, particulars: "Sodium Sulphate", uom: "KGS", qty: 3.0, rate: 15, amount: 3.0 * 15 },
{ slNo: 4, particulars: "Brightener", uom: "KGS", qty: 0.1, rate: 500, amount: 0.1 * 500 },
{ slNo: 5, particulars: "Perfume", uom: "KGS", qty: 0.1, rate: 1200, amount: 0.1 * 1200 }
  ],
  costPer500ML: 30.00,
  costPer1L: 65.00,
  costPer5L: 325.00,
  costPer500MLBottle: 32.50,
  costPer1LBottle: 6.00,
  costPer5LBottle: 21.00,
  methodOfPreparation: [
    "Mix all dry ingredients thoroughly",
    "Add perfume and mix well",
    "Ensure uniform distribution",
    "Pack in moisture-proof containers"
  ]
};