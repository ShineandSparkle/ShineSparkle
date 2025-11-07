import { PricingData, PackingData } from "./types";

export const productPricesData: PricingData[] = [
    { id: 5, product: "Acid", uom: "1 Ltr", retailPrice: 50, bulkPrice5Ltr: 200 },
    { id: 3, product: "Brass Cleaning Liquid", uom: "500 ML", retailPrice: 100, bulkPrice5Ltr: 900 },
    { id: 7, product: "Detergent Powder", uom: "1 Kg", retailPrice: 150, bulkPrice5Ltr: 700 },
    { id: 2, product: "Dish Wash Liquid", uom: "500 ML", retailPrice: 80, bulkPrice5Ltr: 750 },
    { id: 9, product: "Floor Cleaning Liquid", uom: "1 Ltr", retailPrice: 100, bulkPrice5Ltr: 450 },
    { id: 6, product: "Hand Wash Liquid", uom: "500 ML", retailPrice: 100, bulkPrice5Ltr: 900 },
    { id: 8, product: "Liquid Detergent", uom: "1 Ltr", retailPrice: 100, bulkPrice5Ltr: 450 },
    { id: 1, product: "Phenyl", uom: "1 Ltr", retailPrice: 60, bulkPrice5Ltr: 250 },
    { id: 10, product: "Rose Water", uom: "1 Ltr", retailPrice: 60, bulkPrice5Ltr: 250 },
    { id: 4, product: "Toilet Cleaner", uom: "1 Ltr", retailPrice: 100, bulkPrice5Ltr: 450 },
    { id: 12, product: "Vaseline", uom: "25 Gms", retailPrice: 25, bulkPrice100Gms: 75 },
    { id: 11, product: "Zandu Balm", uom: "25 Gms", retailPrice: 80, bulkPrice100Gms: 280 },
];

export const packingMaterialsData: PackingData[] = [
  { id: 8, product: "5 Ltrs Transparent Bottle", minimumOrder: 0, retailPrice: 21 },
  { id: 9, product: "5 Ltrs HDPE Can", minimumOrder: 0, retailPrice: 36 },
  { id: 1, product: "Acid Bottles - 1 Ltr", minimumOrder: 105, retailPrice: 4.3 },
  { id: 6, product: "Colin Glass Cleaner Bottle - 500 ML", minimumOrder: 0, retailPrice: 16 },
  { id: 4, product: "Dish Wash Bottles - 500 ML", minimumOrder: 200, retailPrice: 9.5 },
  { id: 7, product: "Floor Cleaner Bottle - 500 ML & 1 Ltr", minimumOrder: 0, retailPrice: 10 },
  { id: 5, product: "Hand Wash with Pump Bottle - 500 ML", minimumOrder: 200, retailPrice: 14 },
  { id: 2, product: "Phenyl Bottles - 1 Ltr", minimumOrder: 128, retailPrice: 6.3 },
  { id: 3, product: "Toilet Cleaner Bottles - 1 Ltr", minimumOrder: 180, retailPrice: 18.5 },
  { id: 10, product: "Zandu Balm & Vaseline Bottle - 25 Gms", minimumOrder: 12, retailPrice: 4.2 }
];

export interface ChemicalData {
  id: number;
  chemical: string;
  rate: number;
  uom: string;
}

export const chemicalPrices: ChemicalData[] = [
    { id: 1, chemical: "Acid Slurry", rate: 180, uom: "KG" },
    { id: 2, chemical: "Acid Thickener", rate: 400, uom: "KG" },
    { id: 3, chemical: "Alphox 200", rate: 240, uom: "LTR" },
    { id: 4, chemical: "AOS (Alpha Olefin Sulphonate)", rate: 250, uom: "KG" },
    { id: 5, chemical: "Balm Pack", rate: 880, uom: "NOS" },
    { id: 6, chemical: "BKC (Benzalkonium Chloride)", rate: 150, uom: "LTR" },
    { id: 7, chemical: "Caustic Soda", rate: 80, uom: "KG" },
    { id: 8, chemical: "Citric Acid", rate: 150, uom: "KG" },
    { id: 9, chemical: "Colour", rate: 400, uom: "LTR" },
    { id: 10, chemical: "Crystals", rate: 80, uom: "KG" },
    { id: 11, chemical: "Glycerin", rate: 200, uom: "LTR" },
    { id: 12, chemical: "Handwash Base - Pearl", rate: 200, uom: "KG" },
    { id: 13, chemical: "Hydrochloric Acid", rate: 20, uom: "LTR" },
    { id: 14, chemical: "Jasmine Perfume", rate: 1000, uom: "LTR" },
    { id: 15, chemical: "Perfume", rate: 1000, uom: "LTR" },
    { id: 16, chemical: "Phenyl Concentrate", rate: 180, uom: "LTR" },
    { id: 17, chemical: "Robin Blue", rate: 400, uom: "KG" },
    { id: 18, chemical: "RO Water", rate: 0.5, uom: "LTR" },
    { id: 19, chemical: "Rose Extract", rate: 1000, uom: "LTR" },
    { id: 20, chemical: "Salt", rate: 30, uom: "KG" },
    { id: 21, chemical: "SLES (Sodium Lauryl Ether Sulfate)", rate: 100, uom: "KG" },
    { id: 22, chemical: "Slurry", rate: 180, uom: "KG" },
    { id: 23, chemical: "Soda Ash (Sodium Carbonate)", rate: 60, uom: "KG" },
    { id: 24, chemical: "Sodium Benzoate", rate: 280, uom: "KG" },
    { id: 25, chemical: "SS (Sodium Sulphate) - Global Salt", rate: 35, uom: "KG" },
    { id: 26, chemical: "Tinopal", rate: 220, uom: "KG" },
    { id: 27, chemical: "TSP (Trisodium Phosphate)", rate: 30, uom: "KG" },
    { id: 28, chemical: "White Petroleum Jelly Base", rate: 320, uom: "KG" },
];
