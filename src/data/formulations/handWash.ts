
import { FormulationData } from "../types";

export const handWashFormulation: FormulationData = {
  id: 6,
  name: "Hand Wash Liquid",
  slug: "hand-wash-liquid",
  category: "Personal Care",
  description: "Gentle hand washing liquid with moisturizing properties",
  baseYield: 10.00, // Total quantity from ingredients
  TotalQuantity: undefined, // Set to override auto-calculated quantity (e.g., 13.16)
  ingredients: [
{ slNo: 1, particulars: "RO Water", uom: "LTR", qty: 10.0, rate: 0.5, amount: 10.0 * 0.5 },
{ slNo: 2, particulars: "Handwash Base - Pearl", uom: "LTR", qty: 1.0, rate: 200, amount: 1.0 * 200 },
{ slNo: 3, particulars: "SLES", uom: "KGS", qty: 1.0, rate: 100, amount: 1.0 * 100 },
{ slNo: 4, particulars: "Sodium Sulphate", uom: "KGS", qty: 1.0, rate: 40, amount: 1.0 * 40 },
{ slNo: 5, particulars: "Glycerin", uom: "KGS", qty: 0.1, rate: 200, amount: 0.1 * 200 },
{ slNo: 6, particulars: "Color", uom: "LTR", qty: 0.03, rate: 400, amount: 0.03 * 400 },
{ slNo: 7, particulars: "Perfume", uom: "LTR", qty: 0.03, rate: 1000, amount: 0.03 * 1000 }
  ],
  costPer500ML: 0, // Auto-calculated
  costPer1L: 0, // Auto-calculated  
  costPer5L: 0, // Auto-calculated
  costPer500MLBottle: 14.00,
  costPer1LBottle: 6.00,
  costPer5LBottle: null,
  methodOfPreparation: [
    "Heat water to 40°C",
    "Add SLES slowly while mixing",
    "Add salt to achieve viscosity",
    "Add glycerin for moisturizing",
    "Add color and perfume",
    "Mix thoroughly"
  ]
};