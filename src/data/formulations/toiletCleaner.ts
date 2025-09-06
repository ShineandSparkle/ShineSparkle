
import { FormulationData } from "../types";

export const toiletCleanerFormulation: FormulationData = {
  id: 4,
  name: "Toilet Cleaner",
  slug: "toilet-cleaner",
  category: "Bathroom Cleaners",
  description: "Powerful toilet cleaning formulation with acid-based formula",
  baseYield: 10, // Total quantity from ingredients
  ingredients: [
    { slNo: 1, particulars: "RO Water", uom: "LTR", qty: 8.0, rate: 0.5, amount: 8.0 * 0.5 },
    { slNo: 2, particulars: "Acid Thickener", uom: "KGS", qty: 0.25, rate: 400, amount: 0.25 * 400 },
    { slNo: 3, particulars: "HCL Acid", uom: "LTR", qty: 2.0, rate: 16, amount: 2.0 * 16 },
    { slNo: 4, particulars: "Color", uom: "LTR", qty: 0.001, rate: 5000, amount: 0.001 * 5000 }
  ],
  costPer500ML: 0, // Auto-calculated
  costPer1L: 0, // Auto-calculated  
  costPer5L: 0, // Auto-calculated
  costPer500MLBottle: null,
  costPer1LBottle: 19.00,
  costPer5LBottle: 21.00,
  methodOfPreparation: [
    "Start RO water in a suitable mixing container.",
    "Add color to the water and stir thoroughly to ensure uniform dispersion.",
    "Gradually add Acid Thickener to the colored water while stirring continuously. Mix until the solution achieves a consistent viscosity.",
    "Carefully add HCL Acid to the mixture. Stir slowly and continuously to blend the acid evenly into the solution.",
    "If desired, add perfume at this stage to enhance the fragrance of the final product.",
    "Mix the entire solution thoroughly to ensure all ingredients are well combined.",
    "Transfer the finished toilet cleaner into acid-resistant containers and store in a cool, dry place."
  ]
};
