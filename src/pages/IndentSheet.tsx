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
      a.particulars.localeCompare(b.particulars)
    );
  }, [quantities]);

  const totalAmount = aggregatedIngredients.reduce((sum, ing) => sum + ing.totalAmount, 0);

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-50 to-indigo-50">
      <Header />
      
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-slate-800 mb-2">Indent Sheet</h1>
          <p className="text-slate-600">Enter quantities required for each formulation to calculate total ingredients needed</p>
        </div>

        {/* Formulations List */}
        <Card className="p-6 mb-8">
          <h2 className="text-2xl font-semibold text-slate-800 mb-4">Formulations</h2>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12">Sl No</TableHead>
                  <TableHead>Formulation Name</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead className="text-right">Base Yield</TableHead>
                  <TableHead className="text-right w-40">Qty Required (Litres/KGs)</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {formulationsData.map((formulation, index) => {
                  const totalQuantity = formulation.TotalQuantity ?? formulation.baseYield;
                  return (
                    <TableRow key={formulation.id}>
                      <TableCell className="font-medium">{index + 1}</TableCell>
                      <TableCell className="font-medium">{formulation.name}</TableCell>
                      <TableCell className="text-slate-600">{formulation.category}</TableCell>
                      <TableCell className="text-right">{totalQuantity.toFixed(2)}</TableCell>
                      <TableCell className="text-right">
                        <Input
                          type="number"
                          min="0"
                          step="0.01"
                          placeholder="0.00"
                          value={quantities[formulation.id] || ""}
                          onChange={(e) => handleQuantityChange(formulation.id, e.target.value)}
                          className="text-right"
                        />
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        </Card>

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
                      <TableCell className="text-right">{ingredient.totalQty.toFixed(3)}</TableCell>
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
