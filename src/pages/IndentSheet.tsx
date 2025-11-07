import { useState, useMemo } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { formulationsData } from "@/data/formulations";
import { format, startOfMonth } from "date-fns";
import { Calendar as CalendarIcon, Save, ChevronLeft, ChevronRight, FileDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

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
  const rounded = Math.round(num * 1000) / 1000;
  const str = rounded.toString();
  return str.includes(".") ? str.replace(/\.?0+$/, "") : str;
};

const IndentSheet = () => {
  const [quantities, setQuantities] = useState<QuantityInput>({});
  const [selectedMonth, setSelectedMonth] = useState<Date>(new Date());
  const [showMonthPicker, setShowMonthPicker] = useState(false);

  const handleQuantityChange = (formulationId: number, value: string) => {
    const numValue = parseFloat(value) || 0;
    setQuantities((prev) => ({
      ...prev,
      [formulationId]: numValue,
    }));
  };

  const aggregatedIngredients = useMemo(() => {
    const ingredientMap = new Map<string, AggregatedIngredient>();

    Object.entries(quantities).forEach(([formulationId, qtyRequired]) => {
      if (qtyRequired <= 0) return;

      const formulation = formulationsData.find((f) => f.id === Number(formulationId));
      if (!formulation) return;

      const totalQuantity = formulation.TotalQuantity ?? formulation.baseYield;
      const multiplier = qtyRequired / totalQuantity;

      formulation.ingredients.forEach((ingredient) => {
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
            totalAmount: scaledAmount,
          });
        }
      });
    });

    return Array.from(ingredientMap.values()).sort((a, b) => b.totalAmount - a.totalAmount);
  }, [quantities]);

  const handleSaveIndent = async () => {
    const monthStart = startOfMonth(selectedMonth);

    const entries = Object.entries(quantities)
      .filter(([_, qty]) => qty > 0)
      .map(([formulationId, quantity]) => {
        const formulation = formulationsData.find((f) => f.id === parseInt(formulationId));
        if (!formulation) return null;

        return {
          month: format(monthStart, "yyyy-MM-dd"),
          formulation_name: formulation.name,
          quantity,
          ingredients: formulation.ingredients.map((ing) => ({
            particulars: ing.particulars,
            qty: ing.qty,
            uom: ing.uom,
            rate: ing.rate,
          })),
        };
      })
      .filter((entry) => entry !== null);

    if (entries.length === 0) {
      toast.error("Please enter at least one quantity");
      return;
    }

    const { error: indentError } = await supabase.from("indent_sheet_entries").insert(entries);
    if (indentError) {
      toast.error("Failed to save indent sheet");
      console.error(indentError);
      return;
    }

    const chemicalUpdates = new Map<string, number>();
    aggregatedIngredients.forEach((ingredient) => {
      const currentQty = chemicalUpdates.get(ingredient.particulars) || 0;
      chemicalUpdates.set(ingredient.particulars, currentQty + ingredient.totalQty);
    });

    const { data: existingMaterials, error: fetchError } = await supabase
      .from("raw_materials_stock")
      .select("*")
      .eq("month", format(monthStart, "yyyy-MM-dd"));

    if (fetchError) console.error(fetchError);

    for (const [chemical, purchasedQty] of chemicalUpdates.entries()) {
      const existing = existingMaterials?.find((m) => m.chemical_name === chemical);

      if (existing) {
        const { error: updateError } = await supabase
          .from("raw_materials_stock")
          .update({
            purchased: Number(existing.purchased) + purchasedQty,
            closing:
              Number(existing.opening) + Number(existing.purchased) + purchasedQty - Number(existing.used),
          })
          .eq("id", existing.id);
        if (updateError) console.error(updateError);
      } else {
        const { error: insertError } = await supabase.from("raw_materials_stock").insert({
          month: format(monthStart, "yyyy-MM-dd"),
          chemical_name: chemical,
          opening: 0,
          purchased: purchasedQty,
          used: 0,
          closing: purchasedQty,
        });
        if (insertError) console.error(insertError);
      }
    }

    toast.success("Indent sheet saved successfully");
  };

  const totalAmount = aggregatedIngredients.reduce((sum, ing) => sum + ing.totalAmount, 0);

  const exportToPDF = () => {
    const doc = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a4",
    });

    const pageWidth = doc.internal.pageSize.getWidth();
    const monthYear = format(selectedMonth, "MMMM yyyy");

    // Title
    doc.setFontSize(18);
    doc.setFont("helvetica", "bold");
    doc.text("Indent Sheet - Total Required Ingredients", pageWidth / 2, 15, { align: "center" });

    // Month
    doc.setFontSize(12);
    doc.setFont("helvetica", "normal");
    doc.text(`Month: ${monthYear}`, pageWidth / 2, 23, { align: "center" });

    let currentY = 30;

    // Indent Items Section
    const indentItems = Object.entries(quantities)
      .filter(([_, qty]) => qty > 0)
      .map(([formulationId, quantity]) => {
        const formulation = formulationsData.find((f) => f.id === parseInt(formulationId));
        return formulation ? [formulation.name, quantity.toString()] : null;
      })
      .filter((item) => item !== null);

    if (indentItems.length > 0) {
      doc.setFontSize(14);
      doc.setFont("helvetica", "bold");
      doc.text("Indent Items", 14, currentY);
      currentY += 7;

      autoTable(doc, {
        startY: currentY,
        head: [["Product Name", "Quantity Required"]],
        body: indentItems,
        theme: "grid",
        styles: {
          fontSize: 10,
          cellPadding: 3,
        },
        headStyles: {
          fillColor: [31, 68, 182],
          textColor: 255,
          fontStyle: "bold",
          halign: "center",
        },
        columnStyles: {
          0: { halign: "left", cellWidth: 130 },
          1: { halign: "center", cellWidth: 50 },
        },
      });

      currentY = (doc as any).lastAutoTable.finalY + 10;
    }

    // Total Required Ingredients Section
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.text("Total Required Ingredients", 14, currentY);
    currentY += 7;

    // Table data
    const tableData = aggregatedIngredients.map((ingredient, index) => [
      (index + 1).toString(),
      ingredient.particulars,
      ingredient.uom,
      formatNumber(ingredient.totalQty),
      ingredient.rate.toFixed(2),
      ingredient.totalAmount.toFixed(2),
    ]);

    // Add Grand Total row
    tableData.push([
      "",
      "",
      "",
      "",
      "Grand Total:",
      totalAmount.toFixed(2),
    ]);

    autoTable(doc, {
      startY: currentY,
      head: [["Sl No", "Particulars", "UOM", "Total Qty", "Rate", "Total Amt"]],
      body: tableData,
      theme: "grid",
      styles: {
        fontSize: 10,
        cellPadding: 3,
      },
      headStyles: {
        fillColor: [31, 68, 182],
        textColor: 255,
        fontStyle: "bold",
        halign: "center",
      },
      columnStyles: {
        0: { halign: "center", cellWidth: 15 },
        1: { halign: "left", cellWidth: 55 },
        2: { halign: "center", cellWidth: 20 },
        3: { halign: "center", cellWidth: 25 },
        4: { halign: "center", cellWidth: 30 },
        5: { halign: "center", cellWidth: 35 },
      },
      didParseCell: (data) => {
        // Style the Grand Total row
        if (data.row.index === tableData.length - 1) {
          data.cell.styles.fontStyle = "bold";
          data.cell.styles.fillColor = [240, 240, 240];
        }
      },
    });

    doc.save(`Indent_Sheet_${monthYear.replace(" ", "_")}.pdf`);
    toast.success("PDF exported successfully");
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-50 to-indigo-50">
      <Header />

      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-4xl font-bold text-slate-800">Indent Sheet</h1>
          <div className="flex gap-4 items-center">
            <Popover open={showMonthPicker} onOpenChange={setShowMonthPicker}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-[240px] justify-start text-left font-normal",
                    !selectedMonth && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {selectedMonth ? format(selectedMonth, "MMMM yyyy") : <span>Pick a month</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-4">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => setSelectedMonth(new Date(selectedMonth.getFullYear() - 1, selectedMonth.getMonth()))}
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <div className="font-semibold">{selectedMonth.getFullYear()}</div>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => setSelectedMonth(new Date(selectedMonth.getFullYear() + 1, selectedMonth.getMonth()))}
                    >
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    {['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'].map((month, index) => (
                      <Button
                        key={month}
                        variant={selectedMonth.getMonth() === index ? "default" : "outline"}
                        onClick={() => {
                          setSelectedMonth(new Date(selectedMonth.getFullYear(), index));
                          setShowMonthPicker(false);
                        }}
                        className="w-full"
                      >
                        {month}
                      </Button>
                    ))}
                  </div>
                </div>
              </PopoverContent>
            </Popover>
            <Button onClick={handleSaveIndent} className="gap-2">
              <Save className="h-4 w-4" />
              Save Indent
            </Button>
          </div>
        </div>

        {/* === 3 Cards per Row (Product + Qty Inline) === */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
          {formulationsData.map((formulation) => (
            <Card
              key={formulation.id}
              className="p-4 flex items-center justify-between bg-white shadow-md rounded-2xl transition-all hover:shadow-lg"
              style={{
                boxShadow: "inset 6px 0 0 0 #1F44B6, 0 4px 10px rgba(0,0,0,0.08)",
              }}
            >
              <div className="flex flex-col">
                <Label className="font-semibold text-slate-800 text-sm mb-1">
                  {formulation.name}
                </Label>
              </div>
              <Input
                type="number"
                min="0"
                step="1"
                value={quantities[formulation.id] || ""}
                onChange={(e) => handleQuantityChange(formulation.id, e.target.value)}
                onWheel={(e) => e.currentTarget.blur()}
                placeholder="Qty"
                className="w-24 text-right font-medium"
              />
            </Card>
          ))}
        </div>

        {/* === Aggregated Ingredients Table === */}
        {aggregatedIngredients.length > 0 && (
          <Card
            className="overflow-hidden"
            style={{ boxShadow: "0 10px 15px -3px rgba(34,84,210,0.3), 0 4px 6px -2px rgba(34,84,210,0.2)" }}
          >
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold text-slate-800">Total Required Ingredients</h2>
                <Button
                  onClick={exportToPDF}
                  variant="outline"
                  className="gap-2"
                >
                  <FileDown className="h-4 w-4" />
                  Export PDF
                </Button>
              </div>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Sl No</TableHead>
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
                        <TableCell>{index + 1}</TableCell>
                        <TableCell className="font-medium">{ingredient.particulars}</TableCell>
                        <TableCell>{ingredient.uom}</TableCell>
                        <TableCell className="text-right">{formatNumber(ingredient.totalQty)}</TableCell>
                        <TableCell className="text-right">₹{ingredient.rate.toFixed(2)}</TableCell>
                        <TableCell className="text-right font-semibold">
                          ₹{ingredient.totalAmount.toFixed(2)}
                        </TableCell>
                      </TableRow>
                    ))}
                    <TableRow className="bg-slate-100 font-bold">
                      <TableCell colSpan={5} className="text-right">
                        Grand Total:
                      </TableCell>
                      <TableCell className="text-right text-lg">₹{totalAmount.toFixed(2)}</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default IndentSheet;
