
import { FormulationData } from "../types";

export const brassCleaningFormulation: FormulationData = {
  id: 3,
  name: "Brass Cleaning Liquid",
  slug: "brass-cleaning-liquid",
  category: "Metal Cleaners",
  description: "Effective formulation for cleaning brass surfaces, removes tarnish and restores shine.",
  baseYield: 10.00, // Total quantity from ingredients
  ingredients: [
    { slNo: 1, particulars: "RO Water", uom: "LTR", qty: 7, rate: 0.5, amount: 7 * 0.5 },
    { slNo: 2, particulars: "Citric Acid", uom: "KGS", qty: 0.75, rate: 150, amount: 0.75 * 150 },
    { slNo: 3, particulars: "Salt", uom: "KGS", qty: 0.75, rate: 30, amount: 0.75 * 20 },
    { slNo: 4, particulars: "SLES", uom: "KGS", qty: 3, rate: 100, amount: 3 * 100 },
    { slNo: 5, particulars: "Colour", uom: "LTR", qty: 0.05, rate: 400, amount: 0.05 * 400 }
  ],
  costPer500ML: 0, // Auto-calculated
  costPer1L: 0, // Auto-calculated
  costPer5L: 0, // Auto-calculated
  costPer500MLBottle: 9.50,
  costPer1LBottle: null,
  costPer5LBottle: null,
  methodOfPreparation: [
    "Add water to a clean mixing vessel",
    "Slowly Citric Acid to the water and mix well",
    "Add Salt and continue stirring until fully dissolved",
    "Add SLES to thicken the liquid",
    "Add Colour to the solution and stir well",
    "Add perfume as required for fragrance",
    "Mix the solution thoroughly until uniform consistency is achieved",
    "Let the liquid settle and filter if necessary",
    "Fill into 500 ml or 1 L bottles using clean equipment",
    "Store in a cool, dry place away from sunlight"
  ]
};