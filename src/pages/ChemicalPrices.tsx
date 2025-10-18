import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { chemicalPrices } from "@/data/pricingData";

const ChemicalPrices = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <Header />

      <main className="py-8 px-6">
        <div className="max-w-7xl mx-auto">
          {/* Header Section */}
          <div className="relative mb-10">
            <h1 className="text-3xl font-bold text-slate-800 text-center">
              Chemical Prices
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

          {/* Cards Grid - 3 per row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {chemicalPrices.map((chemical) => (
              <Card
                key={chemical.id}
                className="p-4 flex items-center justify-between bg-white rounded-2xl transition-all hover:shadow-lg"
                style={{
                  boxShadow: "inset 6px 0 0 0 #1F44B6, 0 4px 10px rgba(0,0,0,0.08)",
                }}
              >
                <span className="font-semibold text-slate-800 w-1/2 truncate">{chemical.chemical}</span>
                <span className="text-slate-600 text-sm">UOM: {chemical.uom}</span>
                <span className="font-bold text-yellow-700 text-lg whitespace-nowrap">₹ {chemical.rate}</span>
              </Card>
            ))}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default ChemicalPrices;
