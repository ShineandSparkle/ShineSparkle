import { useState } from "react";
import { useParams } from "react-router-dom";
import { getFormulationBySlug } from "@/data/formulations";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import FormulationNotFound from "@/components/FormulationNotFound";
import FormulationHeader from "@/components/FormulationHeader";
import FormulationTable from "@/components/FormulationTable";
import MethodOfPreparation from "@/components/MethodOfPreparation";
import CostSummary from "@/components/CostSummary";
import YieldInput from "@/components/YieldInput";
import { FormulationData } from "@/data/types";

const FormulationDetail = () => {
  const { slug } = useParams();
  const baseFormulation = getFormulationBySlug(slug || "");

  const [currentYield, setCurrentYield] = useState(baseFormulation?.baseYield || 10);

  if (!baseFormulation) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
        <Header />
        <FormulationNotFound />
        <Footer />
      </div>
    );
  }

  const getScaledFormulation = (): FormulationData => {
    const scaleFactor = currentYield / baseFormulation.baseYield;
    const scaledIngredients = baseFormulation.ingredients.map(ingredient => ({
      ...ingredient,
      qty: ingredient.qty * scaleFactor,
      amount: ingredient.qty * scaleFactor * ingredient.rate
    }));

    return {
      ...baseFormulation,
      ingredients: scaledIngredients
    };
  };

  const scaledFormulation = getScaledFormulation();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <Header />

      <main className="py-4 sm:py-8 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto">
          <FormulationHeader 
            name={baseFormulation.name} 
            description={baseFormulation.description} 
          />

          {/* Yield Input for general formulations */}
          <YieldInput
            currentYield={currentYield}
            baseYield={baseFormulation.baseYield}
            onYieldChange={setCurrentYield}
          />

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <FormulationTable 
                name={baseFormulation.name} 
                ingredients={scaledFormulation.ingredients}
              />
              <MethodOfPreparation steps={baseFormulation.methodOfPreparation} />
            </div>

            <div className="lg:col-span-1">
              <CostSummary formulation={scaledFormulation} />
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default FormulationDetail;