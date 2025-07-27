
import { FormulationData } from "../types";

export const whitePetroleumJellyFormulation: FormulationData = {
  id: 12,
  name: "White Petroleum Jelly",
  slug: "white-petroleum-jelly",
  category: "Personal Care",
  description: "Pure white petroleum jelly similar to Vaseline",
  baseYield: 10.0, // Total quantity from ingredients
  ingredients: [
{ slNo: 1, particulars: "White Petroleum Jelly Base", uom: "KGS", qty: 9.8, rate: 120, amount: 9.8 * 120 },
{ slNo: 2, particulars: "Vitamin E", uom: "KGS", qty: 0.1, rate: 2000, amount: 0.1 * 2000 },
{ slNo: 3, particulars: "Antioxidant", uom: "KGS", qty: 0.1, rate: 500, amount: 0.1 * 500 }
  ],
  costPerLtr: 30.93,
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
