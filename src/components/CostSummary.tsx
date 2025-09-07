
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calculator } from "lucide-react";
import { FormulationData } from "@/data/types";

interface CostSummaryProps {
  formulation: FormulationData;
}

const CostSummary = ({ formulation }: CostSummaryProps) => {
  const autoCalculatedQuantity = formulation.ingredients.reduce((sum, ingredient) => sum + ingredient.qty, 0);
  const totalQuantity = formulation.TotalQuantity || autoCalculatedQuantity;
  const totalAmount = formulation.ingredients.reduce((sum, ingredient) => sum + ingredient.amount, 0);

  // Auto-calculate cost per litre from total amount and base yield
  const calculatedCostPerLtr = totalAmount / formulation.baseYield;

  // Auto-calculate product costs from calculated costPerLtr
  const calculatedCostPer500ML = (calculatedCostPerLtr * 0.5);
  const calculatedCostPer1L = calculatedCostPerLtr;
  const calculatedCostPer5L = (calculatedCostPerLtr * 5);

  // Calculate combined product + bottle costs
  const totalCostPer500ML = calculatedCostPer500ML + (formulation.costPer500MLBottle || 0);
  const totalCostPer1L = calculatedCostPer1L + (formulation.costPer1LBottle || 0);
  const totalCostPer5L = calculatedCostPer5L + (formulation.costPer5LBottle || 0);

  // Check which bottle costs exist and are greater than 0
  const has500MLBottle = formulation.costPer500MLBottle !== null && formulation.costPer500MLBottle > 0;
  const has1LBottle = formulation.costPer1LBottle !== null && formulation.costPer1LBottle > 0;
  const has5LBottle = formulation.costPer5LBottle !== null && formulation.costPer5LBottle > 0;
  const hasAnyBottleCosts = has500MLBottle || has1LBottle || has5LBottle;

  return (
    <Card className="sticky top-8">
      <CardHeader>
        <CardTitle className="flex items-center">
          <Calculator className="h-5 w-5 mr-2" />
          Cost Summary
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-3">
          <div className="flex justify-between items-center p-3 bg-slate-50 rounded-lg">
            <span className="font-medium">Total Quantity:</span>
            <span className="font-bold">{totalQuantity.toFixed(2)} L</span>
          </div>
          
          <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
            <span className="font-medium">Total Amount:</span>
            <span className="font-bold text-blue-600">₹{totalAmount.toFixed(2)}</span>
          </div>
          
          <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
            <span className="font-medium">Cost per Litre:</span>
            <span className="font-bold text-green-600">₹{calculatedCostPerLtr.toFixed(2)}</span>
          </div>

          {/* Show auto-calculated product costs only if bottle costs exist */}
          {hasAnyBottleCosts && (
            <>
              <div className="border-t pt-3 space-y-2">
                <h4 className="font-semibold text-slate-700">Product Cost (Auto-calculated):</h4>
                {has500MLBottle && (
                  <div className="flex justify-between items-center p-2 bg-emerald-50 rounded">
                    <span className="text-sm">500 ML:</span>
                    <span className="font-semibold text-emerald-600">₹{calculatedCostPer500ML.toFixed(2)}</span>
                  </div>
                )}
                {has1LBottle && (
                  <div className="flex justify-between items-center p-2 bg-cyan-50 rounded">
                    <span className="text-sm">1 Litre:</span>
                    <span className="font-semibold text-cyan-600">₹{calculatedCostPer1L.toFixed(2)}</span>
                  </div>
                )}
                {has5LBottle && (
                  <div className="flex justify-between items-center p-2 bg-indigo-50 rounded">
                    <span className="text-sm">5 Litre:</span>
                    <span className="font-semibold text-indigo-600">₹{calculatedCostPer5L.toFixed(2)}</span>
                  </div>
                )}
              </div>
              
              <div className="border-t pt-3 space-y-2">
                <h4 className="font-semibold text-slate-700">Total Cost (Product + Bottle):</h4>
                {has500MLBottle && (
                  <div className="flex justify-between items-center p-2 bg-yellow-50 rounded">
                    <span className="text-sm">500 ML {formulation.name}:</span>
                    <span className="font-semibold text-yellow-600">₹{totalCostPer500ML.toFixed(2)}</span>
                  </div>
                )}
                {has1LBottle && (
                  <div className="flex justify-between items-center p-2 bg-orange-50 rounded">
                    <span className="text-sm">1 Litre {formulation.name}:</span>
                    <span className="font-semibold text-orange-600">₹{totalCostPer1L.toFixed(2)}</span>
                  </div>
                )}
                {has5LBottle && (
                  <div className="flex justify-between items-center p-2 bg-purple-50 rounded">
                    <span className="text-sm">5 Litre {formulation.name}:</span>
                    <span className="font-semibold text-purple-600">₹{totalCostPer5L.toFixed(2)}</span>
                  </div>
                )}
              </div>
              
              <div className="border-t pt-3 space-y-2">
                <h4 className="font-semibold text-slate-700">Bottle Cost:</h4>
                {has500MLBottle && (
                  <div className="flex justify-between items-center p-2 bg-rose-50 rounded">
                    <span className="text-sm">500 ML Bottle:</span>
                    <span className="font-semibold text-rose-600">₹{formulation.costPer500MLBottle!.toFixed(2)}</span>
                  </div>
                )}                      
                {has1LBottle && (
                  <div className="flex justify-between items-center p-2 bg-teal-50 rounded">
                    <span className="text-sm">1 Litre Bottle:</span>
                    <span className="font-semibold text-teal-600">₹{formulation.costPer1LBottle!.toFixed(2)}</span>
                  </div>
                )}
                {has5LBottle && (
                  <div className="flex justify-between items-center p-2 bg-violet-50 rounded">
                    <span className="text-sm">5 Litre Bottle:</span>
                    <span className="font-semibold text-violet-600">₹{formulation.costPer5LBottle!.toFixed(2)}</span>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default CostSummary;
