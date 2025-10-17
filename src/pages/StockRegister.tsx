import { useState, useMemo, useEffect } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format, startOfMonth } from "date-fns";
import { Calendar as CalendarIcon, Printer, ArrowLeft, Plus, ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { formulationsData, productPricesData } from "@/data/formulations";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface StockEntry {
  id: string;
  productName: string;
  opening: number;
  production: number;
  sales: number;
  closing: number;
  amount: number;
}

interface RawMaterialEntry {
  id: string;
  chemicalName: string;
  opening: number;
  purchased: number;
  used: number;
  closing: number;
}

const chemicalsList = [
  "Acid (Hydrochloric acid)",
  "Acid Slurry",
  "Alphox 200",
  "AOS (Alpha Olefin Sulphonate)",
  "BKC (Benzalkonium Chloride)",
  "CAPB (Cocamidopropyl Betaine)",
  "Caustic Soda",
  "Citric Acid",
  "Colour",
  "Cutting Oil",
  "Glycerine",
  "Hand Wash Base",
  "IPA (Isopropyl Alcohol)",
  "Perfume - Jasmine - Phenyl",
  "Phenyl Compound",
  "Pine Oil",
  "SLES (Sodium Lauryl Ether Sulfate)",
  "Soap Oil",
  "Soda Ash (Sodium carbonate)",
  "SS (Sodium Sulphate) - Global Salt",
  "TRO (Turkey Red Oil)",
  "TSP (Trisodium Phosphate)",
  "Urea"
];

const getProductPrice = (productName: string): number => {
  const priceData = productPricesData.find(p => p.product === productName);
  return priceData?.retailPrice || 0;
};

const StockRegister = () => {
  const navigate = useNavigate();
  const [selectedMonth, setSelectedMonth] = useState<Date>(new Date(2025, 9)); // October 2025
  const [warehouseEntries, setWarehouseEntries] = useState<StockEntry[]>([]);
  const [distributorEntries, setDistributorEntries] = useState<StockEntry[]>([]);
  const [rawMaterialEntries, setRawMaterialEntries] = useState<RawMaterialEntry[]>([]);
  const [showMonthPicker, setShowMonthPicker] = useState(false);
  
  // Form states for Warehouse Register
  const [warehouseProduct, setWarehouseProduct] = useState<string>("");
  const [warehouseOpening, setWarehouseOpening] = useState<string>("");
  const [warehouseProduction, setWarehouseProduction] = useState<string>("");
  const [warehouseSales, setWarehouseSales] = useState<string>("");
  
  // Form states for Distributor Inventory
  const [distributorProduct, setDistributorProduct] = useState<string>("");
  const [distributorOpening, setDistributorOpening] = useState<string>("");
  const [distributorProduction, setDistributorProduction] = useState<string>("");
  const [distributorSales, setDistributorSales] = useState<string>("");

  // Form states for Raw Materials
  const [rawMaterialChemical, setRawMaterialChemical] = useState<string>("");
  const [rawMaterialOpening, setRawMaterialOpening] = useState<string>("");
  const [rawMaterialPurchased, setRawMaterialPurchased] = useState<string>("");
  const [rawMaterialUsed, setRawMaterialUsed] = useState<string>("");

  const warehouseClosing = useMemo(() => {
    const opening = parseFloat(warehouseOpening) || 0;
    const production = parseFloat(warehouseProduction) || 0;
    const sales = parseFloat(warehouseSales) || 0;
    return opening + production - sales;
  }, [warehouseOpening, warehouseProduction, warehouseSales]);

  const distributorClosing = useMemo(() => {
    const opening = parseFloat(distributorOpening) || 0;
    const production = parseFloat(distributorProduction) || 0;
    const sales = parseFloat(distributorSales) || 0;
    return opening + production - sales;
  }, [distributorOpening, distributorProduction, distributorSales]);

  const rawMaterialClosing = useMemo(() => {
    const opening = parseFloat(rawMaterialOpening) || 0;
    const purchased = parseFloat(rawMaterialPurchased) || 0;
    const used = parseFloat(rawMaterialUsed) || 0;
    return opening + purchased - used;
  }, [rawMaterialOpening, rawMaterialPurchased, rawMaterialUsed]);

  // Load entries from database when month changes
  useEffect(() => {
    loadWarehouseEntries();
    loadDistributorEntries();
    loadRawMaterialEntries();
  }, [selectedMonth]);

  // Auto-populate opening stock from previous month's closing when product is selected
  useEffect(() => {
    if (warehouseProduct) {
      const previousMonth = new Date(selectedMonth.getFullYear(), selectedMonth.getMonth() - 1);
      const prevMonthStart = startOfMonth(previousMonth);
      
      supabase
        .from('warehouse_stock')
        .select('closing')
        .eq('month', format(prevMonthStart, 'yyyy-MM-dd'))
        .eq('product_name', warehouseProduct)
        .maybeSingle()
        .then(({ data }) => {
          if (data && warehouseOpening === "") {
            setWarehouseOpening(data.closing.toString());
          }
        });
    }
  }, [warehouseProduct]);

  useEffect(() => {
    if (distributorProduct) {
      const previousMonth = new Date(selectedMonth.getFullYear(), selectedMonth.getMonth() - 1);
      const prevMonthStart = startOfMonth(previousMonth);
      
      supabase
        .from('distributor_stock')
        .select('closing')
        .eq('month', format(prevMonthStart, 'yyyy-MM-dd'))
        .eq('product_name', distributorProduct)
        .maybeSingle()
        .then(({ data }) => {
          if (data && distributorOpening === "") {
            setDistributorOpening(data.closing.toString());
          }
        });
    }
  }, [distributorProduct]);

  useEffect(() => {
    if (rawMaterialChemical) {
      const previousMonth = new Date(selectedMonth.getFullYear(), selectedMonth.getMonth() - 1);
      const prevMonthStart = startOfMonth(previousMonth);
      
      supabase
        .from('raw_materials_stock')
        .select('closing')
        .eq('month', format(prevMonthStart, 'yyyy-MM-dd'))
        .eq('chemical_name', rawMaterialChemical)
        .maybeSingle()
        .then(({ data }) => {
          if (data && rawMaterialOpening === "") {
            setRawMaterialOpening(data.closing.toString());
          }
        });
    }
  }, [rawMaterialChemical]);

  const loadWarehouseEntries = async () => {
    const monthStart = startOfMonth(selectedMonth);
    const { data, error } = await supabase
      .from('warehouse_stock')
      .select('*')
      .eq('month', format(monthStart, 'yyyy-MM-dd'));
    
    if (error) {
      console.error('Error loading warehouse entries:', error);
      return;
    }
    
    if (data) {
      const entries: StockEntry[] = data.map(entry => {
        const closing = Number(entry.closing);
        const price = getProductPrice(entry.product_name);
        return {
          id: entry.id,
          productName: entry.product_name,
          opening: Number(entry.opening),
          production: Number(entry.production),
          sales: Number(entry.sales),
          closing: closing,
          amount: closing * price
        };
      });
      setWarehouseEntries(entries);
    }
  };

  const loadDistributorEntries = async () => {
    const monthStart = startOfMonth(selectedMonth);
    const { data, error } = await supabase
      .from('distributor_stock')
      .select('*')
      .eq('month', format(monthStart, 'yyyy-MM-dd'));
    
    if (error) {
      console.error('Error loading distributor entries:', error);
      return;
    }
    
    if (data) {
      const entries: StockEntry[] = data.map(entry => {
        const closing = Number(entry.closing);
        const price = getProductPrice(entry.product_name);
        return {
          id: entry.id,
          productName: entry.product_name,
          opening: Number(entry.opening),
          production: Number(entry.production),
          sales: Number(entry.sales),
          closing: closing,
          amount: closing * price
        };
      });
      setDistributorEntries(entries);
    }
  };

  const loadRawMaterialEntries = async () => {
    const monthStart = startOfMonth(selectedMonth);
    const { data, error } = await supabase
      .from('raw_materials_stock')
      .select('*')
      .eq('month', format(monthStart, 'yyyy-MM-dd'));
    
    if (error) {
      console.error('Error loading raw material entries:', error);
      return;
    }
    
    if (data) {
      const entries: RawMaterialEntry[] = data.map(entry => ({
        id: entry.id,
        chemicalName: entry.chemical_name,
        opening: Number(entry.opening),
        purchased: Number(entry.purchased),
        used: Number(entry.used),
        closing: Number(entry.closing)
      }));
      setRawMaterialEntries(entries);
    }
  };

  const handleAddWarehouseEntry = async () => {
    if (!warehouseProduct) return;
    
    const monthStart = startOfMonth(selectedMonth);
    const opening = parseFloat(warehouseOpening) || 0;
    const production = parseFloat(warehouseProduction) || 0;
    const sales = parseFloat(warehouseSales) || 0;
    const closing = warehouseClosing;

    // Check if entry already exists for this product and month
    const { data: existing } = await supabase
      .from('warehouse_stock')
      .select('id')
      .eq('month', format(monthStart, 'yyyy-MM-dd'))
      .eq('product_name', warehouseProduct)
      .maybeSingle();

    if (existing) {
      toast.error('Entry already exists for this product in this month');
      return;
    }
    
    const { data, error } = await supabase
      .from('warehouse_stock')
      .insert({
        month: format(monthStart, 'yyyy-MM-dd'),
        product_name: warehouseProduct,
        opening: opening,
        production: production,
        sales: sales,
        closing: closing
      })
      .select()
      .single();
    
    if (error) {
      toast.error('Failed to add warehouse entry');
      console.error('Error adding warehouse entry:', error);
      return;
    }
    
    if (data) {
      const price = getProductPrice(data.product_name);
      const newEntry: StockEntry = {
        id: data.id,
        productName: data.product_name,
        opening: Number(data.opening),
        production: Number(data.production),
        sales: Number(data.sales),
        closing: Number(data.closing),
        amount: Number(data.closing) * price
      };
      
      setWarehouseEntries([...warehouseEntries, newEntry]);
      toast.success('Warehouse entry added successfully');
      
      // Reset form
      setWarehouseProduct("");
      setWarehouseOpening("");
      setWarehouseProduction("");
      setWarehouseSales("");
    }
  };

  const handleAddDistributorEntry = async () => {
    if (!distributorProduct) return;
    
    const monthStart = startOfMonth(selectedMonth);
    const opening = parseFloat(distributorOpening) || 0;
    const production = parseFloat(distributorProduction) || 0;
    const sales = parseFloat(distributorSales) || 0;
    const closing = distributorClosing;

    // Check if entry already exists for this product and month
    const { data: existing } = await supabase
      .from('distributor_stock')
      .select('id')
      .eq('month', format(monthStart, 'yyyy-MM-dd'))
      .eq('product_name', distributorProduct)
      .maybeSingle();

    if (existing) {
      toast.error('Entry already exists for this product in this month');
      return;
    }
    
    const { data, error } = await supabase
      .from('distributor_stock')
      .insert({
        month: format(monthStart, 'yyyy-MM-dd'),
        product_name: distributorProduct,
        opening: opening,
        production: production,
        sales: sales,
        closing: closing
      })
      .select()
      .single();
    
    if (error) {
      toast.error('Failed to add distributor entry');
      console.error('Error adding distributor entry:', error);
      return;
    }
    
    if (data) {
      const price = getProductPrice(data.product_name);
      const newEntry: StockEntry = {
        id: data.id,
        productName: data.product_name,
        opening: Number(data.opening),
        production: Number(data.production),
        sales: Number(data.sales),
        closing: Number(data.closing),
        amount: Number(data.closing) * price
      };
      
      setDistributorEntries([...distributorEntries, newEntry]);
      toast.success('Distributor entry added successfully');
      
      // Reset form
      setDistributorProduct("");
      setDistributorOpening("");
      setDistributorProduction("");
      setDistributorSales("");
    }
  };

  const handleAddRawMaterialEntry = async () => {
    if (!rawMaterialChemical) return;
    
    const monthStart = startOfMonth(selectedMonth);
    const opening = parseFloat(rawMaterialOpening) || 0;
    const purchased = parseFloat(rawMaterialPurchased) || 0;
    const used = parseFloat(rawMaterialUsed) || 0;
    const closing = rawMaterialClosing;

    // Check if entry already exists for this chemical and month
    const { data: existing } = await supabase
      .from('raw_materials_stock')
      .select('id')
      .eq('month', format(monthStart, 'yyyy-MM-dd'))
      .eq('chemical_name', rawMaterialChemical)
      .maybeSingle();

    if (existing) {
      toast.error('Entry already exists for this chemical in this month');
      return;
    }
    
    const { data, error } = await supabase
      .from('raw_materials_stock')
      .insert({
        month: format(monthStart, 'yyyy-MM-dd'),
        chemical_name: rawMaterialChemical,
        opening: opening,
        purchased: purchased,
        used: used,
        closing: closing
      })
      .select()
      .single();
    
    if (error) {
      toast.error('Failed to add raw material entry');
      console.error('Error adding raw material entry:', error);
      return;
    }
    
    if (data) {
      const newEntry: RawMaterialEntry = {
        id: data.id,
        chemicalName: data.chemical_name,
        opening: Number(data.opening),
        purchased: Number(data.purchased),
        used: Number(data.used),
        closing: Number(data.closing)
      };
      
      setRawMaterialEntries([...rawMaterialEntries, newEntry]);
      toast.success('Raw material entry added successfully');
      
      // Reset form
      setRawMaterialChemical("");
      setRawMaterialOpening("");
      setRawMaterialPurchased("");
      setRawMaterialUsed("");
    }
  };

  const handlePrintReport = () => {
    window.print();
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-50 to-indigo-50">
      <Header />
      
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-4xl font-bold text-slate-800">Stock Register</h1>
            <div className="flex gap-4">
              <Button
                onClick={handlePrintReport}
                variant="secondary"
                className="gap-2"
              >
                <Printer className="h-4 w-4" />
                Print Monthly Report
              </Button>
              <Button
                onClick={() => navigate("/")}
                variant="outline"
                className="gap-2"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to Dashboard
              </Button>
            </div>
          </div>

          {/* Month Selector */}
          <Card className="p-6 mb-6">
            <h2 className="text-xl font-semibold text-slate-800 mb-4">Select Month</h2>
            <Popover open={showMonthPicker} onOpenChange={setShowMonthPicker}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-[280px] justify-start text-left font-normal",
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
          </Card>

          {/* Tabs for Warehouse, Distributor, and Raw Materials */}
          <Tabs defaultValue="warehouse" className="w-full">
            <TabsList className="grid w-full grid-cols-3 mb-6">
              <TabsTrigger value="warehouse" className="text-lg">Warehouse</TabsTrigger>
              <TabsTrigger value="distributor" className="text-lg">Distributor</TabsTrigger>
              <TabsTrigger value="rawmaterials" className="text-lg">Raw Materials</TabsTrigger>
            </TabsList>

            {/* Warehouse Tab */}
            <TabsContent value="warehouse">
              <Card className="p-6 mb-6 shadow-lg">
                <h3 className="text-xl font-semibold text-slate-800 mb-4">Add Warehouse Entry - {format(selectedMonth, "MMMM yyyy")}</h3>
                <div className="flex gap-4 items-end flex-wrap">

                  <div className="flex flex-col gap-2 min-w-[180px]">
                    <label className="text-sm font-medium text-slate-700">Product Name</label>
                    <Select value={warehouseProduct} onValueChange={setWarehouseProduct}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select product" />
                      </SelectTrigger>
                      <SelectContent>
                        {formulationsData.map((f) => (
                          <SelectItem key={f.id} value={f.name}>{f.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex flex-col gap-2 min-w-[120px]">
                    <label className="text-sm font-medium text-slate-700">Opening</label>
                    <Input
                      type="number"
                      min="0"
                      step="1"
                      value={warehouseOpening}
                      onChange={(e) => setWarehouseOpening(e.target.value)}
                      className="text-right"
                      onWheel={(e) => e.currentTarget.blur()}
                    />
                  </div>

                  <div className="flex flex-col gap-2 min-w-[120px]">
                    <label className="text-sm font-medium text-slate-700">Production</label>
                    <Input
                      type="number"
                      min="0"
                      step="1"
                      value={warehouseProduction}
                      onChange={(e) => setWarehouseProduction(e.target.value)}
                      className="text-right"
                      onWheel={(e) => e.currentTarget.blur()}
                    />
                  </div>

                  <div className="flex flex-col gap-2 min-w-[120px]">
                    <label className="text-sm font-medium text-slate-700">Sales</label>
                    <Input
                      type="number"
                      min="0"
                      step="1"
                      value={warehouseSales}
                      onChange={(e) => setWarehouseSales(e.target.value)}
                      className="text-right"
                      onWheel={(e) => e.currentTarget.blur()}
                    />
                  </div>

                  <div className="flex flex-col gap-2 min-w-[120px]">
                    <label className="text-sm font-medium text-slate-700">Closing</label>
                    <Input
                      type="number"
                      value={warehouseClosing}
                      readOnly
                      className="text-right bg-slate-100"
                      onWheel={(e) => e.currentTarget.blur()}
                    />
                  </div>

                  <Button onClick={handleAddWarehouseEntry} className="gap-2">
                    <Plus className="h-4 w-4" />
                    Add
                  </Button>
                </div>
              </Card>

              {/* Warehouse Entries Table */}
              {warehouseEntries.length > 0 && (
                <Card className="p-6 shadow-lg">
                  <h3 className="text-xl font-semibold text-slate-800 mb-4">Warehouse Stock Entries - {format(selectedMonth, "MMMM yyyy")}</h3>
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Product Name</TableHead>
                          <TableHead className="text-right">Opening</TableHead>
                          <TableHead className="text-right">Production</TableHead>
                          <TableHead className="text-right">Sales</TableHead>
                          <TableHead className="text-right">Closing</TableHead>
                          <TableHead className="text-right">Amount (₹)</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {warehouseEntries.map((entry) => (
                          <TableRow key={entry.id}>
                            <TableCell className="font-medium">{entry.productName}</TableCell>
                            <TableCell className="text-right">{entry.opening.toFixed(0)}</TableCell>
                            <TableCell className="text-right">{entry.production.toFixed(0)}</TableCell>
                            <TableCell className="text-right">{entry.sales.toFixed(0)}</TableCell>
                            <TableCell className="text-right font-semibold">{entry.closing.toFixed(0)}</TableCell>
                            <TableCell className="text-right font-semibold text-primary">{entry.amount.toFixed(2)}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </Card>
              )}
            </TabsContent>

            {/* Distributor Tab */}
            <TabsContent value="distributor">
              <Card className="p-6 mb-6 shadow-lg">
                <h3 className="text-xl font-semibold text-slate-800 mb-4">Add Distributor Entry - {format(selectedMonth, "MMMM yyyy")}</h3>
                <div className="flex gap-4 items-end flex-wrap">

                  <div className="flex flex-col gap-2 min-w-[180px]">
                    <label className="text-sm font-medium text-slate-700">Product Name</label>
                    <Select value={distributorProduct} onValueChange={setDistributorProduct}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select product" />
                      </SelectTrigger>
                      <SelectContent>
                        {formulationsData.map((f) => (
                          <SelectItem key={f.id} value={f.name}>{f.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex flex-col gap-2 min-w-[120px]">
                    <label className="text-sm font-medium text-slate-700">Opening</label>
                    <Input
                      type="number"
                      min="0"
                      step="1"
                      value={distributorOpening}
                      onChange={(e) => setDistributorOpening(e.target.value)}
                      className="text-right"
                      onWheel={(e) => e.currentTarget.blur()}
                    />
                  </div>

                  <div className="flex flex-col gap-2 min-w-[120px]">
                    <label className="text-sm font-medium text-slate-700">Production</label>
                    <Input
                      type="number"
                      min="0"
                      step="1"
                      value={distributorProduction}
                      onChange={(e) => setDistributorProduction(e.target.value)}
                      className="text-right"
                      onWheel={(e) => e.currentTarget.blur()}
                    />
                  </div>

                  <div className="flex flex-col gap-2 min-w-[120px]">
                    <label className="text-sm font-medium text-slate-700">Sales</label>
                    <Input
                      type="number"
                      min="0"
                      step="1"
                      value={distributorSales}
                      onChange={(e) => setDistributorSales(e.target.value)}
                      className="text-right"
                      onWheel={(e) => e.currentTarget.blur()}
                    />
                  </div>

                  <div className="flex flex-col gap-2 min-w-[120px]">
                    <label className="text-sm font-medium text-slate-700">Closing</label>
                    <Input
                      type="number"
                      value={distributorClosing}
                      readOnly
                      className="text-right bg-slate-100"
                      onWheel={(e) => e.currentTarget.blur()}
                    />
                  </div>

                  <Button onClick={handleAddDistributorEntry} className="gap-2">
                    <Plus className="h-4 w-4" />
                    Add
                  </Button>
                </div>
              </Card>

              {/* Distributor Entries Table */}
              {distributorEntries.length > 0 && (
                <Card className="p-6 shadow-lg">
                  <h3 className="text-xl font-semibold text-slate-800 mb-4">Distributor Stock Entries - {format(selectedMonth, "MMMM yyyy")}</h3>
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Product Name</TableHead>
                          <TableHead className="text-right">Opening</TableHead>
                          <TableHead className="text-right">Production</TableHead>
                          <TableHead className="text-right">Sales</TableHead>
                          <TableHead className="text-right">Closing</TableHead>
                          <TableHead className="text-right">Amount (₹)</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {distributorEntries.map((entry) => (
                          <TableRow key={entry.id}>
                            <TableCell className="font-medium">{entry.productName}</TableCell>
                            <TableCell className="text-right">{entry.opening.toFixed(0)}</TableCell>
                            <TableCell className="text-right">{entry.production.toFixed(0)}</TableCell>
                            <TableCell className="text-right">{entry.sales.toFixed(0)}</TableCell>
                            <TableCell className="text-right font-semibold">{entry.closing.toFixed(0)}</TableCell>
                            <TableCell className="text-right font-semibold text-primary">{entry.amount.toFixed(2)}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </Card>
              )}
            </TabsContent>

            {/* Raw Materials Tab */}
            <TabsContent value="rawmaterials">
              <Card className="p-6 mb-6 shadow-lg">
                <h3 className="text-xl font-semibold text-slate-800 mb-4">Add Raw Material Entry - {format(selectedMonth, "MMMM yyyy")}</h3>
                <div className="flex gap-4 items-end flex-wrap">
                  <div className="flex flex-col gap-2 min-w-[200px]">
                    <label className="text-sm font-medium text-slate-700">Chemical Name</label>
                    <Select value={rawMaterialChemical} onValueChange={setRawMaterialChemical}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select chemical" />
                      </SelectTrigger>
                      <SelectContent>
                        {chemicalsList.map((chemical) => (
                          <SelectItem key={chemical} value={chemical}>{chemical}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex flex-col gap-2 min-w-[120px]">
                    <label className="text-sm font-medium text-slate-700">Opening</label>
                    <Input
                      type="number"
                      min="0"
                      step="1"
                      value={rawMaterialOpening}
                      onChange={(e) => setRawMaterialOpening(e.target.value)}
                      className="text-right"
                      onWheel={(e) => e.currentTarget.blur()}
                    />
                  </div>

                  <div className="flex flex-col gap-2 min-w-[120px]">
                    <label className="text-sm font-medium text-slate-700">Purchased</label>
                    <Input
                      type="number"
                      min="0"
                      step="1"
                      value={rawMaterialPurchased}
                      onChange={(e) => setRawMaterialPurchased(e.target.value)}
                      className="text-right"
                      onWheel={(e) => e.currentTarget.blur()}
                    />
                  </div>

                  <div className="flex flex-col gap-2 min-w-[120px]">
                    <label className="text-sm font-medium text-slate-700">Used</label>
                    <Input
                      type="number"
                      min="0"
                      step="1"
                      value={rawMaterialUsed}
                      onChange={(e) => setRawMaterialUsed(e.target.value)}
                      className="text-right"
                      onWheel={(e) => e.currentTarget.blur()}
                    />
                  </div>

                  <div className="flex flex-col gap-2 min-w-[120px]">
                    <label className="text-sm font-medium text-slate-700">Closing</label>
                    <Input
                      type="number"
                      value={rawMaterialClosing}
                      readOnly
                      className="text-right bg-slate-100"
                      onWheel={(e) => e.currentTarget.blur()}
                    />
                  </div>

                  <Button onClick={handleAddRawMaterialEntry} className="gap-2">
                    <Plus className="h-4 w-4" />
                    Add
                  </Button>
                </div>
              </Card>

              {/* Raw Material Entries Table */}
              {rawMaterialEntries.length > 0 && (
                <Card className="p-6 shadow-lg">
                  <h3 className="text-xl font-semibold text-slate-800 mb-4">Raw Material Stock Entries - {format(selectedMonth, "MMMM yyyy")}</h3>
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Chemical Name</TableHead>
                          <TableHead className="text-right">Opening</TableHead>
                          <TableHead className="text-right">Purchased</TableHead>
                          <TableHead className="text-right">Used</TableHead>
                          <TableHead className="text-right">Closing</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {rawMaterialEntries.map((entry) => (
                          <TableRow key={entry.id}>
                            <TableCell className="font-medium">{entry.chemicalName}</TableCell>
                            <TableCell className="text-right">{entry.opening.toFixed(0)}</TableCell>
                            <TableCell className="text-right">{entry.purchased.toFixed(0)}</TableCell>
                            <TableCell className="text-right">{entry.used.toFixed(0)}</TableCell>
                            <TableCell className="text-right font-semibold">{entry.closing.toFixed(0)}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </Card>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default StockRegister;
