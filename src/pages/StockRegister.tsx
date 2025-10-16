import { useState, useMemo } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { Calendar as CalendarIcon, Printer, ArrowLeft, Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import { formulationsData } from "@/data/formulations";
import { useNavigate } from "react-router-dom";

interface StockEntry {
  id: string;
  date: Date;
  productName: string;
  opening: number;
  production: number;
  sales: number;
  closing: number;
}

const StockRegister = () => {
  const navigate = useNavigate();
  const [selectedMonth, setSelectedMonth] = useState<Date>(new Date(2025, 9)); // October 2025
  const [warehouseEntries, setWarehouseEntries] = useState<StockEntry[]>([]);
  const [distributorEntries, setDistributorEntries] = useState<StockEntry[]>([]);
  
  // Form states for Warehouse Register
  const [warehouseDate, setWarehouseDate] = useState<Date>(new Date());
  const [warehouseProduct, setWarehouseProduct] = useState<string>("");
  const [warehouseOpening, setWarehouseOpening] = useState<number>(0);
  const [warehouseProduction, setWarehouseProduction] = useState<number>(0);
  const [warehouseSales, setWarehouseSales] = useState<number>(0);
  
  // Form states for Distributor Inventory
  const [distributorDate, setDistributorDate] = useState<Date>(new Date());
  const [distributorProduct, setDistributorProduct] = useState<string>("");
  const [distributorOpening, setDistributorOpening] = useState<number>(0);
  const [distributorProduction, setDistributorProduction] = useState<number>(0);
  const [distributorSales, setDistributorSales] = useState<number>(0);

  const warehouseClosing = useMemo(() => warehouseOpening + warehouseProduction - warehouseSales, [warehouseOpening, warehouseProduction, warehouseSales]);
  const distributorClosing = useMemo(() => distributorOpening + distributorProduction - distributorSales, [distributorOpening, distributorProduction, distributorSales]);

  const handleAddWarehouseEntry = () => {
    if (!warehouseProduct) return;
    
    const newEntry: StockEntry = {
      id: Date.now().toString(),
      date: warehouseDate,
      productName: warehouseProduct,
      opening: warehouseOpening,
      production: warehouseProduction,
      sales: warehouseSales,
      closing: warehouseClosing
    };
    
    setWarehouseEntries([...warehouseEntries, newEntry]);
    // Reset form
    setWarehouseProduct("");
    setWarehouseOpening(0);
    setWarehouseProduction(0);
    setWarehouseSales(0);
  };

  const handleAddDistributorEntry = () => {
    if (!distributorProduct) return;
    
    const newEntry: StockEntry = {
      id: Date.now().toString(),
      date: distributorDate,
      productName: distributorProduct,
      opening: distributorOpening,
      production: distributorProduction,
      sales: distributorSales,
      closing: distributorClosing
    };
    
    setDistributorEntries([...distributorEntries, newEntry]);
    // Reset form
    setDistributorProduct("");
    setDistributorOpening(0);
    setDistributorProduction(0);
    setDistributorSales(0);
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
            <Popover>
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
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={selectedMonth}
                  onSelect={(date) => date && setSelectedMonth(date)}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </Card>

          {/* Tabs for Warehouse and Distributor */}
          <Tabs defaultValue="warehouse" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="warehouse" className="text-lg">Warehouse</TabsTrigger>
              <TabsTrigger value="distributor" className="text-lg">Distributor</TabsTrigger>
            </TabsList>

            {/* Warehouse Tab */}
            <TabsContent value="warehouse">
              <Card className="p-6 mb-6">
                <h3 className="text-xl font-semibold text-slate-800 mb-4">Add Warehouse Entry</h3>
                <div className="flex gap-4 items-end flex-wrap">
                  <div className="flex flex-col gap-2 min-w-[160px]">
                    <label className="text-sm font-medium text-slate-700">Date</label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={cn(
                            "justify-start text-left font-normal",
                            !warehouseDate && "text-muted-foreground"
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {format(warehouseDate, "dd/MM/yyyy")}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar
                          mode="single"
                          selected={warehouseDate}
                          onSelect={(date) => date && setWarehouseDate(date)}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </div>

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
                      value={warehouseOpening || ""}
                      onChange={(e) => setWarehouseOpening(parseFloat(e.target.value) || 0)}
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
                      value={warehouseProduction || ""}
                      onChange={(e) => setWarehouseProduction(parseFloat(e.target.value) || 0)}
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
                      value={warehouseSales || ""}
                      onChange={(e) => setWarehouseSales(parseFloat(e.target.value) || 0)}
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
                <Card className="p-6">
                  <h3 className="text-xl font-semibold text-slate-800 mb-4">Warehouse Stock Entries</h3>
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Date</TableHead>
                          <TableHead>Product Name</TableHead>
                          <TableHead className="text-right">Opening</TableHead>
                          <TableHead className="text-right">Production</TableHead>
                          <TableHead className="text-right">Sales</TableHead>
                          <TableHead className="text-right">Closing</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {warehouseEntries.map((entry) => (
                          <TableRow key={entry.id}>
                            <TableCell>{format(entry.date, "dd/MM/yyyy")}</TableCell>
                            <TableCell className="font-medium">{entry.productName}</TableCell>
                            <TableCell className="text-right">{entry.opening.toFixed(0)}</TableCell>
                            <TableCell className="text-right">{entry.production.toFixed(0)}</TableCell>
                            <TableCell className="text-right">{entry.sales.toFixed(0)}</TableCell>
                            <TableCell className="text-right font-semibold">{entry.closing.toFixed(0)}</TableCell>
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
              <Card className="p-6 mb-6">
                <h3 className="text-xl font-semibold text-slate-800 mb-4">Add Distributor Entry</h3>
                <div className="flex gap-4 items-end flex-wrap">
                  <div className="flex flex-col gap-2 min-w-[160px]">
                    <label className="text-sm font-medium text-slate-700">Date</label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={cn(
                            "justify-start text-left font-normal",
                            !distributorDate && "text-muted-foreground"
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {format(distributorDate, "dd/MM/yyyy")}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar
                          mode="single"
                          selected={distributorDate}
                          onSelect={(date) => date && setDistributorDate(date)}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </div>

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
                      value={distributorOpening || ""}
                      onChange={(e) => setDistributorOpening(parseFloat(e.target.value) || 0)}
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
                      value={distributorProduction || ""}
                      onChange={(e) => setDistributorProduction(parseFloat(e.target.value) || 0)}
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
                      value={distributorSales || ""}
                      onChange={(e) => setDistributorSales(parseFloat(e.target.value) || 0)}
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
                <Card className="p-6">
                  <h3 className="text-xl font-semibold text-slate-800 mb-4">Distributor Stock Entries</h3>
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Date</TableHead>
                          <TableHead>Product Name</TableHead>
                          <TableHead className="text-right">Opening</TableHead>
                          <TableHead className="text-right">Production</TableHead>
                          <TableHead className="text-right">Sales</TableHead>
                          <TableHead className="text-right">Closing</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {distributorEntries.map((entry) => (
                          <TableRow key={entry.id}>
                            <TableCell>{format(entry.date, "dd/MM/yyyy")}</TableCell>
                            <TableCell className="font-medium">{entry.productName}</TableCell>
                            <TableCell className="text-right">{entry.opening.toFixed(0)}</TableCell>
                            <TableCell className="text-right">{entry.production.toFixed(0)}</TableCell>
                            <TableCell className="text-right">{entry.sales.toFixed(0)}</TableCell>
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
