import { useState, useMemo } from "react";
import { formulationsData } from "@/data/formulations";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

interface QuantityInput {
  [formulationId: number]: number;
}

interface AggregatedIngredient {
  particulars: string;
  uom: string;
  totalQty: number;
  rate: number;
  totalAmount: number;
}

const formatNumber = (num: number): string => {
  // Round to 3 decimal places
  const rounded = Math.round(num * 1000) / 1000;
  // Convert to string and remove trailing zeros
  return rounded.toString().replace(/\.?0+$/, '');
};

const IndentSheet = () => {
  const [quantities, setQuantities] = useState<QuantityInput>({});

  const handleQuantityChange = (formulationId: number, value: string) => {
    const numValue = parseFloat(value) || 0;
    setQuantities(prev => ({
      ...prev,
      [formulationId]: numValue
    }));
  };

  const aggregatedIngredients = useMemo(() => {
    const ingredientMap = new Map<string, AggregatedIngredient>();

    Object.entries(quantities).forEach(([formulationId, qtyRequired]) => {
      if (qtyRequired <= 0) return;

      const formulation = formulationsData.find(f => f.id === Number(formulationId));
      if (!formulation) return;

      const totalQuantity = formulation.TotalQuantity ?? formulation.baseYield;
      const multiplier = qtyRequired / totalQuantity;

      formulation.ingredients.forEach(ingredient => {
        const key = `${ingredient.particulars}_${ingredient.uom}`;
        const scaledQty = ingredient.qty * multiplier;
        const scaledAmount = ingredient.amount * multiplier;

        if (ingredientMap.has(key)) {
          const existing = ingredientMap.get(key)!;
          existing.totalQty += scaledQty;
          existing.totalAmount += scaledAmount;
        } else {
          ingredientMap.set(key, {
            particulars: ingredient.particulars,
            uom: ingredient.uom,
            totalQty: scaledQty,
            rate: ingredient.rate,
            totalAmount: scaledAmount
          });
        }
      });
    });

    return Array.from(ingredientMap.values()).sort((a, b) => 
      b.totalAmount - a.totalAmount
    );
  }, [quantities]);

  const totalAmount = aggregatedIngredients.reduce((sum, ing) => sum + ing.totalAmount, 0);

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-50 to-indigo-50">
      <Header />
      
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="mb-8 text-center">
        <h1 className="text-4xl font-bold text-slate-800 mb-2">Indent Sheet</h1>
        <p className="text-slate-600">Enter quantities required for each formulation to calculate total ingredients needed</p>
    </div>


      {/* Formulations Cards */}
      <div className="mb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {formulationsData.map((formulation) => (
            <Card
              key={formulation.id}
              className="p-6 relative overflow-hidden shadow-md rounded-2xl bg-white transition-all hover:shadow-lg"
              style={{
                boxShadow: "inset 6px 0 0 0 #1E293B, 0 4px 10px rgba(0,0,0,0.08)",
              }}
            >
              <div className="flex items-center justify-between">
                <p className="text-lg font-semibold text-slate-900 tracking-wide">
                  {formulation.name}
                </p>
                <div className="flex items-center space-x-2">
                  <label
                    htmlFor={`qty-${formulation.id}`}
                    className="text-sm text-slate-600"
                  >
                    Qty:
                  </label>
                  <Input
                    id={`qty-${formulation.id}`}
                    type="number"
                    min="0"
                    step="0.01"
                    placeholder="0.00"
                    value={quantities[formulation.id] || ""}
                    onChange={(e) =>
                      handleQuantityChange(formulation.id, e.target.value)
                    }
                    className="w-24 text-right border-slate-300 focus:border-slate-700 focus:ring-0"
                  />
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>



        {/* Aggregated Ingredients */}
        {aggregatedIngredients.length > 0 && (
          <Card className="p-6">
            <h2 className="text-2xl font-semibold text-slate-800 mb-4">Total Ingredients Required</h2>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-12">Sl No</TableHead>
                    <TableHead>Particulars</TableHead>
                    <TableHead>UOM</TableHead>
                    <TableHead className="text-right">Total Qty</TableHead>
                    <TableHead className="text-right">Rate (₹)</TableHead>
                    <TableHead className="text-right">Total Amount (₹)</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {aggregatedIngredients.map((ingredient, index) => (
                    <TableRow key={index}>
                      <TableCell className="font-medium">{index + 1}</TableCell>
                      <TableCell className="font-medium">{ingredient.particulars}</TableCell>
                      <TableCell>{ingredient.uom}</TableCell>
                      <TableCell className="text-right">{formatNumber(ingredient.totalQty)}</TableCell>
                      <TableCell className="text-right">₹{ingredient.rate.toFixed(2)}</TableCell>
                      <TableCell className="text-right font-semibold">₹{ingredient.totalAmount.toFixed(2)}</TableCell>
                    </TableRow>
                  ))}
                  <TableRow className="bg-slate-100 font-bold">
                    <TableCell colSpan={5} className="text-right">Grand Total:</TableCell>
                    <TableCell className="text-right text-lg">₹{totalAmount.toFixed(2)}</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>
          </Card>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default IndentSheet;
