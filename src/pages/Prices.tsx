import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Edit, Save, X } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { formulationsData } from "@/data/formulations";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const Prices = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [editMode, setEditMode] = useState(false);
  const [prices, setPrices] = useState(formulationsData);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    loadPrices();
  }, []);

  const loadPrices = async () => {
    try {
      const { data, error } = await supabase
        .from("settings")
        .select("setting_data")
        .eq("setting_type", "pricing")
        .single();

      if (error && error.code !== "PGRST116") {
        throw error;
      }

      if (data?.setting_data) {
        const customPrices = data.setting_data;
        const mergedPrices = formulationsData.map((formulation) => {
          const customPrice = customPrices[formulation.id];
          if (customPrice) {
            return {
              ...formulation,
              costPer1L: customPrice.costPer1L ?? formulation.costPer1L,
            };
          }
          return formulation;
        });
        setPrices(mergedPrices);
      }
    } catch (error) {
      console.error("Error loading prices:", error);
    } finally {
      setLoading(false);
    }
  };

  const handlePriceChange = (
    formulationId: number,
    field: string,
    value: string
  ) => {
    const numValue = parseFloat(value) || 0;
    setPrices(
      prices.map((p) =>
        p.id === formulationId ? { ...p, [field]: numValue } : p
      )
    );
  };

  const savePrices = async () => {
    try {
      const pricingData = prices.reduce((acc, formulation) => {
        acc[formulation.id] = {
          costPer1L: formulation.costPer1L,
        };
        return acc;
      }, {} as any);

      const { data: existing } = await supabase
        .from("settings")
        .select("id")
        .eq("setting_type", "pricing")
        .single();

      if (existing) {
        const { error } = await supabase
          .from("settings")
          .update({
            setting_data: pricingData,
            updated_at: new Date().toISOString(),
          })
          .eq("setting_type", "pricing");

        if (error) throw error;
      } else {
        const { error } = await supabase.from("settings").insert({
          setting_type: "pricing",
          setting_data: pricingData,
          user_id: "00000000-0000-0000-0000-000000000000",
        });

        if (error) throw error;
      }

      toast({
        title: "Success",
        description: "Prices saved successfully",
        duration: 5000, // ✅ Auto-dismiss after 5 seconds
      });

      setEditMode(false);
    } catch (error) {
      console.error("Error saving prices:", error);
      toast({
        title: "Error",
        description: "Failed to save prices",
        variant: "destructive",
        duration: 5000, // ✅ Auto-dismiss after 5 seconds
      });
    }
  };

  const cancelEdit = () => {
    setEditMode(false);
    loadPrices();
  };

  const filteredFormulations = prices.filter((formulation) =>
    formulation.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <Header />

      <main className="py-6 sm:py-12 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto">
          {/* Hero Section */}
          <div className="text-center mb-8 sm:mb-12">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-slate-800 mb-4">
              Product Prices
            </h1>
            <p className="text-lg text-slate-600 max-w-3xl mx-auto">
              View and manage 1 L pricing for all formulations
            </p>
          </div>

          <Card className="bg-white/80 backdrop-blur-sm">
            <CardHeader>
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <CardTitle className="text-2xl text-slate-800">
                  Product Prices
                </CardTitle>
                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <div className="relative flex-1 sm:w-64">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <Input
                      placeholder="Search formulations..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  {!editMode ? (
                    <Button
                      onClick={() => setEditMode(true)}
                      className="bg-blue-600 hover:bg-blue-700"
                    >
                      <Edit className="h-4 w-4 mr-2" />
                      Edit Prices
                    </Button>
                  ) : (
                    <div className="flex gap-2">
                      <Button
                        onClick={savePrices}
                        className="bg-green-600 hover:bg-green-700"
                      >
                        <Save className="h-4 w-4 mr-2" />
                        Save
                      </Button>
                      <Button onClick={cancelEdit} variant="outline">
                        <X className="h-4 w-4 mr-2" />
                        Cancel
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </CardHeader>

            <CardContent>
              {/* 4x3 Grid Layout — Product & Price on same row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {filteredFormulations.map((formulation) => (
                  <Card
                    key={formulation.id}
                    className="border border-slate-200 shadow-sm"
                  >
                    <CardContent className="p-4 flex items-center justify-between">
                      <span className="text-sm font-medium text-slate-700 truncate pr-2">
                        {formulation.name}
                      </span>

                      {editMode ? (
                        <Input
                          type="number"
                          step="0.01"
                          value={formulation.costPer1L}
                          onChange={(e) =>
                            handlePriceChange(
                              formulation.id,
                              "costPer1L",
                              e.target.value
                            )
                          }
                          className="w-20 text-right"
                        />
                      ) : (
                        <span className="text-base font-semibold text-blue-700">
                          ₹
                          {formulation.costPer1L > 0
                            ? formulation.costPer1L.toFixed(2)
                            : "-"}
                        </span>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Prices;
