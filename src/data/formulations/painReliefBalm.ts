
import { FormulationData } from "../types";

export const painReliefBalmFormulation: FormulationData = {
  id: 11,
  name: "Pain Relief Balm",
  slug: "pain-relief-balm",
  category: "Personal Care",
  description: "Herbal pain relief balm similar to Zandu Balm",
  baseYield: 10.0, // Total quantity from ingredients
  ingredients: [
{ slNo: 1, particulars: "White Petroleum Jelly", uom: "KGS", qty: 7.0, rate: 120, amount: 7.0 * 120 },
{ slNo: 2, particulars: "Menthol", uom: "KGS", qty: 1.0, rate: 800, amount: 1.0 * 800 },
{ slNo: 3, particulars: "Camphor", uom: "KGS", qty: 1.0, rate: 400, amount: 1.0 * 400 },
{ slNo: 4, particulars: "Eucalyptus Oil", uom: "LTR", qty: 0.5, rate: 600, amount: 0.5 * 600 },
{ slNo: 5, particulars: "Wintergreen Oil", uom: "LTR", qty: 0.5, rate: 500, amount: 0.5 * 500 }
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