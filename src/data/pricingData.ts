
import { PricingData, PackingData } from "./types";

export const productPricesData: PricingData[] = [
  { id: 1, product: "Phenyl", uom: "1 Ltr", retailPrice: 60, bulkPrice5Ltr: 250 },
  { id: 2, product: "Dish Wash Liquid", uom: "500 ML", retailPrice: 80, bulkPrice5Ltr: 750 },
  { id: 3, product: "Copper/Brass/Steel Liquid", uom: "500 ML", retailPrice: 100, bulkPrice5Ltr: 900 },
  { id: 4, product: "Harpic", uom: "1 Ltr", retailPrice: 100, bulkPrice5Ltr: 450 },
  { id: 5, product: "Acid", uom: "1 Ltr", retailPrice: 50, bulkPrice5Ltr: 200 },
  { id: 6, product: "Hand Wash Liquid", uom: "500 ML", retailPrice: 70, bulkPrice5Ltr: 650 },
  { id: 7, product: "Detergent Powder", uom: "1 Kg", retailPrice: 150, bulkPrice5Ltr: 700 },
  { id: 8, product: "Liquid Detergent", uom: "1 Ltr", retailPrice: 100, bulkPrice5Ltr: 450 },
  { id: 9, product: "Floor Cleaning Liquid", uom: "1 Ltr", retailPrice: 100, bulkPrice5Ltr: 450 },
  { id: 10, product: "Rose Water", uom: "1 Ltr", retailPrice: 60, bulkPrice5Ltr: 250 },
  { id: 11, product: "Pain Relief Balm (Zandu Balm)", uom: "25 Gms", retailPrice: 80, bulkPrice100Gms: 280 },
  { id: 12, product: "White Petroleum Jelly (Vaseline)", uom: "25 Gms", retailPrice: 25, bulkPrice100Gms: 75 }
];

export const packingMaterialsData: PackingData[] = [
  { id: 1, product: "Acid Bottles - 1 Ltr", minimumOrder: 105, retailPrice: 4.3 },
  { id: 2, product: "Phenyl Bottles - 1 Ltr", minimumOrder: 128, retailPrice: 6.3 },
  { id: 3, product: "Toilet Cleaner Bottles - 1 Ltr", minimumOrder: 180, retailPrice: 18.5 },
  { id: 4, product: "Dish Wash Bottles - 500 ML", minimumOrder: 200, retailPrice: 9.5 },
  { id: 5, product: "Hand Wash with Pump Bottle - 500 ML", minimumOrder: 200, retailPrice: 14 },
  { id: 6, product: "Colin Glass Cleaner Bottle - 500 ML", minimumOrder: 0, retailPrice: 16 },
  { id: 7, product: "Floor Cleaner Bottle - 500 ML & 1 Ltr", minimumOrder: 0, retailPrice: 10 },
  { id: 8, product: "5 Ltrs Transparent Bottle", minimumOrder: 0, retailPrice: 21 },
  { id: 9, product: "5 Ltrs HDPE Can", minimumOrder: 0, retailPrice: 36 },
  { id: 10, product: "Zandu Balm & Vaseline Bottle - 25 Gms", minimumOrder: 12, retailPrice: 4.2 }
];
