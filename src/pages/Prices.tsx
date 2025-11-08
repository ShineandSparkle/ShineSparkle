import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
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

  // Load custom prices from database
  useEffect(() => {
    loadPrices();
  }, []);

  const loadPrices = async () => {
    try {
      const { data, error } = await supabase
        .from('settings')
        .select('setting_data')
        .eq('setting_type', 'pricing')
        .single();

      if (error && error.code !== 'PGRST116') { // PGRST116 = no rows returned
        throw error;
      }

      if (data?.setting_data) {
        // Merge database prices with default formulation data
        const customPrices = data.setting_data;
        const mergedPrices = formulationsData.map(formulation => {
          const customPrice = customPrices[formulation.id];
          if (customPrice) {
            return {
              ...formulation,
              costPer500ML: customPrice.costPer500ML ?? formulation.costPer500ML,
              costPer1L: customPrice.costPer1L ?? formulation.costPer1L,
              costPer5L: customPrice.costPer5L ?? formulation.costPer5L,
            };
          }
          return formulation;
        });
        setPrices(mergedPrices);
      }
    } catch (error) {
      console.error('Error loading prices:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePriceChange = (formulationId: number, field: string, value: string) => {
    const numValue = parseFloat(value) || 0;
    setPrices(prices.map(p => 
      p.id === formulationId ? { ...p, [field]: numValue } : p
    ));
  };

  const savePrices = async () => {
    try {
      // Convert prices array to object for storage
      const pricingData = prices.reduce((acc, formulation) => {
        acc[formulation.id] = {
          costPer500ML: formulation.costPer500ML,
          costPer1L: formulation.costPer1L,
          costPer5L: formulation.costPer5L,
        };
        return acc;
      }, {} as any);

      // First check if pricing setting exists
      const { data: existing } = await supabase
        .from('settings')
        .select('id')
        .eq('setting_type', 'pricing')
        .single();

      if (existing) {
        // Update existing
        const { error } = await supabase
          .from('settings')
          .update({
            setting_data: pricingData,
            updated_at: new Date().toISOString(),
          })
          .eq('setting_type', 'pricing');

        if (error) throw error;
      } else {
        // Insert new - note: user_id will be null for now since we don't have auth
        const { error } = await supabase
          .from('settings')
          .insert({
            setting_type: 'pricing',
            setting_data: pricingData,
            user_id: '00000000-0000-0000-0000-000000000000', // Placeholder UUID
          });

        if (error) throw error;
      }

      toast({
        title: "Success",
        description: "Prices saved successfully",
      });
      setEditMode(false);
    } catch (error) {
      console.error('Error saving prices:', error);
      toast({
        title: "Error",
        description: "Failed to save prices",
        variant: "destructive",
      });
    }
  };

  const cancelEdit = () => {
    setEditMode(false);
    loadPrices(); // Reload original prices
  };

  // Filter formulations based on search term
  const filteredFormulations = prices.filter(formulation =>
    formulation.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    formulation.category.toLowerCase().includes(searchTerm.toLowerCase())
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
              View and manage pricing for all formulations
            </p>
          </div>

          <Card className="bg-white/80 backdrop-blur-sm">
            <CardHeader>
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <CardTitle className="text-2xl text-slate-800">Formulation Prices</CardTitle>
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
                    <Button onClick={() => setEditMode(true)} className="bg-blue-600 hover:bg-blue-700">
                      <Edit className="h-4 w-4 mr-2" />
                      Edit Prices
                    </Button>
                  ) : (
                    <div className="flex gap-2">
                      <Button onClick={savePrices} className="bg-green-600 hover:bg-green-700">
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
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Sl No</TableHead>
                      <TableHead>Formulation Name</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead className="text-right">500 ML (₹)</TableHead>
                      <TableHead className="text-right">1 Ltr (₹)</TableHead>
                      <TableHead className="text-right">5 Ltr (₹)</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredFormulations.map((formulation, index) => (
                      <TableRow key={formulation.id}>
                        <TableCell>{index + 1}</TableCell>
                        <TableCell className="font-medium">{formulation.name}</TableCell>
                        <TableCell>{formulation.category}</TableCell>
                        <TableCell className="text-right">
                          {editMode ? (
                            <Input
                              type="number"
                              step="0.01"
                              value={formulation.costPer500ML}
                              onChange={(e) => handlePriceChange(formulation.id, 'costPer500ML', e.target.value)}
                              className="w-24 ml-auto text-right"
                            />
                          ) : (
                            formulation.costPer500ML > 0 
                              ? formulation.costPer500ML.toFixed(2) 
                              : '-'
                          )}
                        </TableCell>
                        <TableCell className="text-right">
                          {editMode ? (
                            <Input
                              type="number"
                              step="0.01"
                              value={formulation.costPer1L}
                              onChange={(e) => handlePriceChange(formulation.id, 'costPer1L', e.target.value)}
                              className="w-24 ml-auto text-right"
                            />
                          ) : (
                            formulation.costPer1L > 0 
                              ? formulation.costPer1L.toFixed(2) 
                              : '-'
                          )}
                        </TableCell>
                        <TableCell className="text-right">
                          {editMode ? (
                            <Input
                              type="number"
                              step="0.01"
                              value={formulation.costPer5L}
                              onChange={(e) => handlePriceChange(formulation.id, 'costPer5L', e.target.value)}
                              className="w-24 ml-auto text-right"
                            />
                          ) : (
                            formulation.costPer5L > 0 
                              ? formulation.costPer5L.toFixed(2) 
                              : '-'
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
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
