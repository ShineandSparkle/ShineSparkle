import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const ProductPrices = () => {
  const navigate = useNavigate();

  const productPrices = [
    { id: 1, product: "Phenyl", uom: "1 Ltr", retailPrice: 60, bulkPrice5Ltr: 250 },
    { id: 2, product: "Dish Wash Liquid", uom: "500 ML", retailPrice: 80, bulkPrice5Ltr: 750 },
    { id: 3, product: "Copper/Brass/Steel Liquid", uom: "500 ML", retailPrice: 100, bulkPrice5Ltr: 900 },
    { id: 4, product: "Harpic", uom: "1 Ltr", retailPrice: 100, bulkPrice5Ltr: 450 },
    { id: 5, product: "Acid", uom: "1 Ltr", retailPrice: 50, bulkPrice5Ltr: 200 },
    { id: 6, product: "Hand Wash Liquid", uom: "500 ML", retailPrice: 100, bulkPrice5Ltr: 900 },
    { id: 7, product: "Detergent Powder", uom: "1 Kg", retailPrice: 150, bulkPrice5Ltr: 700 },
    { id: 8, product: "Liquid Detergent", uom: "1 Ltr", retailPrice: 100, bulkPrice5Ltr: 450 },
    { id: 9, product: "Floor Cleaning Liquid", uom: "1 Ltr", retailPrice: 100, bulkPrice5Ltr: 450 },
    { id: 10, product: "Rose Water", uom: "1 Ltr", retailPrice: 60, bulkPrice5Ltr: 250 },
    { id: 11, product: "Pain Relief Balm (Zandu Balm)", uom: "25 Gms", retailPrice: 80, bulkPrice100Gms: 280 },
    { id: 12, product: "White Petroleum Jelly (Vaseline)", uom: "25 Gms", retailPrice: 25, bulkPrice100Gms: 75 },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <Header />

      <main className="py-8 px-6">
        <div className="max-w-5xl mx-auto">
          {/* Header Section */}
          <div className="relative mb-10">
            <h1 className="text-3xl font-bold text-slate-800 text-center">
              Product Prices
            </h1>
            <div className="absolute right-0 top-1/2 transform -translate-y-1/2">
              <Button 
                variant="outline" 
                onClick={() => navigate('/')}
                className="flex items-center"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Dashboard
              </Button>
            </div>
          </div>

          {/* Cards Grid - 2 cards per row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {productPrices.map((product) => {
              const bulkPrice = product.bulkPrice100Gms ?? product.bulkPrice5Ltr;
              const bulkLabel = product.bulkPrice100Gms ? "100Gms Bulk Price" : "5 Ltr Price Bulk";

              return (
                <Card
                  key={product.id}
                  className="w-full flex justify-between items-center bg-white rounded-2xl p-6 transition-all hover:shadow-lg"
                  style={{
                    boxShadow: "inset 6px 0 0 0 #1F44B6, 0 4px 10px rgba(0,0,0,0.08)",
                  }}
                >
                  <div className="flex-1">
                    <span className="font-semibold text-slate-800">{product.product}</span>
                  </div>

                  <div className="w-20 text-center">
                    <div className="text-xs text-slate-500">UOM</div>
                    <div className="font-medium text-slate-700">{product.uom}</div>
                  </div>

                  <div className="w-28 text-center">
                    <div className="text-xs text-slate-500">Retail Price</div>
                    <div className="font-bold text-yellow-700">₹ {product.retailPrice}</div>
                  </div>

                  <div className="w-32 text-center">
                    <div className="text-xs text-slate-500">{bulkLabel}</div>
                    <div className="font-bold text-green-700">₹ {bulkPrice}</div>
                  </div>
                </Card>
              );
            })}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default ProductPrices;
