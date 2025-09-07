
import { FormulationData } from "../types";

export const liquidDetergentFormulation: FormulationData = {
  id: 7,
  name: "Liquid Detergent",
  slug: "liquid-detergent",
  category: "Laundry Care",
  description: "Concentrated liquid detergent for machine wash",
  baseYield: 10, // Total quantity from ingredients
  manualTotalQuantity: undefined, // Set to override auto-calculated quantity (e.g., 10.32)
  ingredients: [
    { slNo: 1, particulars: "RO Water", uom: "LTR", qty: 8.5, rate: 0.5, amount: 8.5 * 0.5 },
    { slNo: 2, particulars: "Slurry", uom: "KGS", qty: 1.25, rate: 180, amount: 1.25 * 180 },
    { slNo: 3, particulars: "SLES", uom: "KGS", qty: 0.4, rate: 100, amount: 0.4 * 100 },
    { slNo: 4, particulars: "Citric Acid", uom: "LTR", qty: 0.05, rate: 150, amount: 0.05 * 150 },
    { slNo: 5, particulars: "Caustic Soda", uom: "KGS", qty: 0.2, rate: 80, amount: 0.2 * 80 },        
    { slNo: 6, particulars: "Tinopal", uom: "KGS", qty: 0.005, rate: 220, amount: 0.005 * 220 },
    { slNo: 7, particulars: "Sodium Benzoate", uom: "KGS", qty: 0.005, rate: 280, amount: 0.005 * 280 },
    { slNo: 8, particulars: "Colour", uom: "LTR", qty: 0.03, rate: 400, amount: 0.03 * 400 },
    { slNo: 9, particulars: "Aplhox", uom: "LTR", qty: 0.04, rate: 240, amount: 0.04 * 240 },    
    { slNo: 10, particulars: "Perfume", uom: "LTR", qty: 0.04, rate: 1000, amount: 0.04 * 1000 }
  ],
  costPer500ML: 0, // Auto-calculated
  costPer1L: 0, // Auto-calculated
  costPer5L: 0, // Auto-calculated
  costPer500MLBottle: null,
  costPer1LBottle: 19,
  costPer5LBottle: 21,
  methodOfPreparation: [
    "Heat water to 60°C",
    "Add caustic soda carefully",
    "Add linear alkyl benzene slowly",
    "Mix until clear solution forms",
    "Add salt for viscosity",
    "Add color and perfume when cool"
  ]
};
