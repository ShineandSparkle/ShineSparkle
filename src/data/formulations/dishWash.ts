
import { FormulationData } from "../types";

export const dishWashFormulation: FormulationData = {
  id: 2,
  name: "Dish Wash Liquid",
  slug: "dish-wash-liquid",
  category: "Kitchen Cleaners",
  description: "Effective dishwashing liquid with grease cutting formula",
  baseYield: 10.00, // Total quantity from ingredients
  manualTotalQuantity: undefined, // Set to override auto-calculated quantity (e.g., 12.9)
  ingredients: [
    { slNo: 1, particulars: "RO Water", uom: "LTR", qty: 10.5, rate: 0.5, amount: 10.5 * 0.5 },
    { slNo: 2, particulars: "Slurry", uom: "KGS", qty: 1.0, rate: 180, amount: 1.0 * 180 },
    { slNo: 3, particulars: "SLES", uom: "KGS", qty: 1.0, rate: 120, amount: 1.0 * 120 },
    { slNo: 4, particulars: "AOS", uom: "KGS", qty: 0.25, rate: 250, amount: 0.25 * 250 },
    { slNo: 5, particulars: "Caustic Soda", uom: "KGS", qty: 0.1, rate: 80, amount: 0.1 * 80 },
    { slNo: 6, particulars: "Citric Acid", uom: "LTR", qty: 0.02, rate: 150, amount: 0.02 * 150 },
    { slNo: 7, particulars: "Sodium Benzoate", uom: "KGS", qty: 0.002, rate: 280, amount: 0.002 * 280 },
    { slNo: 8, particulars: "Salt", uom: "KGS", qty: 0.175, rate: 30, amount: 0.175 * 30 },
    { slNo: 9, particulars: "Colour", uom: "LTR", qty: 0.025, rate: 400, amount: 0.025 * 400 },
    { slNo: 10, particulars: "Perfume", uom: "LTR", qty: 0.04, rate: 1000, amount: 0.04 * 1000 }
  ],
  costPer500ML: 0, // Auto-calculated
  costPer1L: 0, // Auto-calculated
  costPer5L: 0, // Auto-calculated
  costPer500MLBottle: 9.5,
  costPer1LBottle: null,
  costPer5LBottle: null,
  methodOfPreparation: [
    "Heat water to 40°C in main mixing vessel",
    "Add slurry slowly while mixing",
    "Add SLES gradually to avoid excessive foaming",
    "Add AOS for enhanced cleaning power",
    "Add caustic soda to maintain alkalinity",
    "Add citric acid to balance pH",
    "Add preservative (sodium benzoate)",
    "Add salt to achieve desired viscosity",
    "Add color for product appeal",
    "Add perfume for pleasant fragrance",
    "Mix thoroughly for uniform consistency"
  ]
};
