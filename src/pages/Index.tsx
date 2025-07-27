
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Beaker, 
  Droplets, 
  Sparkles, 
  SprayCanIcon, 
  Car, 
  Home, 
  Utensils, 
  Shirt, 
  Bath, 
  Shield, 
  Zap, 
  Leaf, 
  FlaskConical, 
  Truck, 
  Building,
  DollarSign,
  Package,
  Calculator
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const Index = () => {
  const navigate = useNavigate();

  const formulations = [
    { id: 1, name: "Phenyl", slug: "phenyl", icon: Droplets, color: "bg-blue-500", description: "Disinfecting floor cleaner" },
    { id: 2, name: "Dish Wash Liquid", slug: "dish-wash-liquid", icon: Utensils, color: "bg-green-500", description: "Grease cutting formula" },
    { id: 3, name: "Copper/Brass Liquid", slug: "brass-cleaning-liquid", icon: Sparkles, color: "bg-amber-500", description: "Metal surface cleaner" },
    { id: 4, name: "Toilet Cleaner", slug: "toilet-cleaner", icon: Bath, color: "bg-cyan-500", description: "Bathroom disinfectant" },
    { id: 5, name: "Acid", slug: "acid", icon: FlaskConical, color: "bg-red-500", description: "Industrial strength acid" },
    { id: 6, name: "Hand Wash Liquid", slug: "hand-wash-liquid", icon: SprayCanIcon, color: "bg-purple-500", description: "Gentle hand cleanser" },
    { id: 7, name: "Liquid Detergent", slug: "liquid-detergent", icon: Droplets, color: "bg-teal-500", description: "Liquid laundry formula" },
    { id: 8, name: "Floor Cleaning Liquid", slug: "floor-cleaning-liquid", icon: Home, color: "bg-slate-600", description: "All floor types cleaner" },
    { id: 9, name: "Detergent Powder", slug: "detergent-powder", icon: Shirt, color: "bg-indigo-500", description: "Laundry washing powder" },    
    { id: 10, name: "Rose Water", slug: "rose-water", icon: Leaf, color: "bg-pink-500", description: "Natural rose essence" },
    { id: 11, name: "Pain Relief Balm", slug: "pain-relief-balm", icon: Shield, color: "bg-orange-500", description: "Zandu Balm formula" },
    { id: 12, name: "White Petroleum Jelly", slug: "white-petroleum-jelly", icon: Beaker, color: "bg-gray-500", description: "Vaseline formula" },
    { id: 13, name: "Product Prices", slug: "product-prices", icon: DollarSign, color: "bg-emerald-600", description: "View all product prices" },
    { id: 14, name: "Packing Materials Cost", slug: "packing-materials", icon: Package, color: "bg-violet-600", description: "Bottle and packaging costs" },
    { id: 15, name: "Chemical Prices", slug: "chemical-prices", icon: Calculator, color: "bg-lime-600", description: "Raw material pricing" }
  ];

  const handleFormulationClick = (formulation: typeof formulations[0]) => {
    console.log(`Navigating to ${formulation.name} formulation`);
    
    // Handle special pages
    if (formulation.id === 13) {
      navigate('/product-prices');
      return;
    }
    if (formulation.id === 14) {
      navigate('/packing-materials');
      return;
    }
    if (formulation.id === 15) {
      navigate('/chemical-prices');
      return;
    }
    
    // Regular formulation pages - now using slug instead of ID
    navigate(`/formulation/${formulation.slug}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <Header />
      
      <main className="py-12 px-6">
        <div className="max-w-7xl mx-auto">
          {/* Hero Section */}
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-slate-800 mb-4">
              Professional Cleaning Formulations
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              Comprehensive cleaning formulation management system with detailed 
              recipes, cost analysis, and manufacturing instructions
            </p>
          </div>

          {/* Dashboard Grid - Changed from 5x3 to 3x5 */}
          <div id="formulations" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
            {formulations.map((formulation) => {
              const IconComponent = formulation.icon;
              return (
                <Card 
                  key={formulation.id} 
                  className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-2 cursor-pointer border-2 hover:border-blue-300"
                  onClick={() => handleFormulationClick(formulation)}
                >
                  <CardContent className="p-6 text-center">
                    <div className={`${formulation.color} w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300`}>
                      <IconComponent className="h-8 w-8 text-white" />
                    </div>
                    <h3 className="font-semibold text-slate-800 mb-2 group-hover:text-blue-600 transition-colors">
                      {formulation.name}
                    </h3>
                    <p className="text-sm text-slate-500 group-hover:text-slate-600 transition-colors">
                      {formulation.description}
                    </p>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="mt-4 w-full group-hover:bg-blue-50 group-hover:border-blue-300 transition-colors"
                    >
                      {formulation.id > 12 ? 'View Pricing' : 'View Formulation'}
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Stats Section */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="text-center p-6 bg-white/70 backdrop-blur-sm">
              <h3 className="text-3xl font-bold text-blue-600 mb-2">12+</h3>
              <p className="text-slate-600">Product Formulations</p>
            </Card>
            <Card className="text-center p-6 bg-white/70 backdrop-blur-sm">
              <h3 className="text-3xl font-bold text-green-600 mb-2">15</h3>
              <p className="text-slate-600">Dashboard Categories</p>
            </Card>
            <Card className="text-center p-6 bg-white/70 backdrop-blur-sm">
              <h3 className="text-3xl font-bold text-purple-600 mb-2">99.9%</h3>
              <p className="text-slate-600">Efficacy Rate</p>
            </Card>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Index;
