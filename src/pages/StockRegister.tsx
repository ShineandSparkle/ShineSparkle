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
  const [podiEntries, setPodiEntries] = useState<StockEntry[]>([]);
  const [rawMaterialEntries, setRawMaterialEntries] = useState<StockEntry[]>([]);
  
  // Form states for Podi's Register
  const [podiDate, setPodiDate] = useState<Date>(new Date());
  const [podiProduct, setPodiProduct] = useState<string>("");
  const [podiOpening, setPodiOpening] = useState<number>(0);
  const [podiProduction, setPodiProduction] = useState<number>(0);
  const [podiSales, setPodiSales] = useState<number>(0);
  
  // Form states for Raw Material Inventory
  const [rawDate, setRawDate] = useState<Date>(new Date());
  const [rawProduct, setRawProduct] = useState<string>("");
  const [rawOpening, setRawOpening] = useState<number>(0);
  const [rawProduction, setRawProduction] = useState<number>(0);
  const [rawSales, setRawSales] = useState<number>(0);

  const podiClosing = useMemo(() => podiOpening + podiProduction - podiSales, [podiOpening, podiProduction, podiSales]);
  const rawClosing = useMemo(() => rawOpening + rawProduction - rawSales, [rawOpening, rawProduction, rawSales]);

  const handleAddPodiEntry = () => {
    if (!podiProduct) return;
    
    const newEntry: StockEntry = {
      id: Date.now().toString(),
      date: podiDate,
      productName: podiProduct,
      opening: podiOpening,
      production: podiProduction,
      sales: podiSales,
      closing: podiClosing
    };
    
    setPodiEntries([...podiEntries, newEntry]);
    // Reset form
    setPodiProduct("");
    setPodiOpening(0);
    setPodiProduction(0);
    setPodiSales(0);
  };

  const handleAddRawEntry = () => {
    if (!rawProduct) return;
    
    const newEntry: StockEntry = {
      id: Date.now().toString(),
      date: rawDate,
      productName: rawProduct,
      opening: rawOpening,
      production: rawProduction,
      sales: rawSales,
      closing: rawClosing
    };
    
    setRawMaterialEntries([...rawMaterialEntries, newEntry]);
    // Reset form
    setRawProduct("");
    setRawOpening(0);
    setRawProduction(0);
    setRawSales(0);
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

          {/* Tabs for Podi's Register and Raw Material Inventory */}
          <Tabs defaultValue="podi" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="podi" className="text-lg">WareHouse</TabsTrigger>
              <TabsTrigger value="raw" className="text-lg">Distributor</TabsTrigger>
            </TabsList>

            {/* WareHouse Tab */}
            <TabsContent value="podi">
              <Card className="p-6 mb-6">
                <h3 className="text-xl font-semibold text-slate-800 mb-4">Add Podi Entry</h3>
                <div className="flex gap-4 items-end flex-wrap">
                  <div className="flex flex-col gap-2 min-w-[160px]">
                    <label className="text-sm font-medium text-slate-700">Date</label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={cn(
                            "justify-start text-left font-normal",
                            !podiDate && "text-muted-foreground"
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {format(podiDate, "dd/MM/yyyy")}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar
                          mode="single"
                          selected={podiDate}
                          onSelect={(date) => date && setPodiDate(date)}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </div>

                  <div className="flex flex-col gap-2 min-w-[180px]">
                    <label className="text-sm font-medium text-slate-700">Podi Name</label>
                    <Select value={podiProduct} onValueChange={setPodiProduct}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select podi" />
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
                      value={podiOpening || ""}
                      onChange={(e) => setPodiOpening(parseFloat(e.target.value) || 0)}
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
                      value={podiProduction || ""}
                      onChange={(e) => setPodiProduction(parseFloat(e.target.value) || 0)}
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
                      value={podiSales || ""}
                      onChange={(e) => setPodiSales(parseFloat(e.target.value) || 0)}
                      className="text-right"
                      onWheel={(e) => e.currentTarget.blur()}
                    />
                  </div>

                  <div className="flex flex-col gap-2 min-w-[120px]">
                    <label className="text-sm font-medium text-slate-700">Closing</label>
                    <Input
                      type="number"
                      value={podiClosing}
                      readOnly
                      className="text-right bg-slate-100"
                      onWheel={(e) => e.currentTarget.blur()}
                    />
                  </div>

                  <Button onClick={handleAddPodiEntry} className="gap-2">
                    <Plus className="h-4 w-4" />
                    Add
                  </Button>
                </div>
              </Card>

              {/* Podi Entries Table */}
              {podiEntries.length > 0 && (
                <Card className="p-6">
                  <h3 className="text-xl font-semibold text-slate-800 mb-4">Podi Stock Entries</h3>
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Date</TableHead>
                          <TableHead>Podi Name</TableHead>
                          <TableHead className="text-right">Opening</TableHead>
                          <TableHead className="text-right">Production</TableHead>
                          <TableHead className="text-right">Sales</TableHead>
                          <TableHead className="text-right">Closing</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {podiEntries.map((entry) => (
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
            <TabsContent value="raw">
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
                            !rawDate && "text-muted-foreground"
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {format(rawDate, "dd/MM/yyyy")}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar
                          mode="single"
                          selected={rawDate}
                          onSelect={(date) => date && setRawDate(date)}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </div>

                  <div className="flex flex-col gap-2 min-w-[180px]">
                    <label className="text-sm font-medium text-slate-700">Product Name</label>
                    <Select value={rawProduct} onValueChange={setRawProduct}>
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
                      value={rawOpening || ""}
                      onChange={(e) => setRawOpening(parseFloat(e.target.value) || 0)}
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
                      value={rawProduction || ""}
                      onChange={(e) => setRawProduction(parseFloat(e.target.value) || 0)}
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
                      value={rawSales || ""}
                      onChange={(e) => setRawSales(parseFloat(e.target.value) || 0)}
                      className="text-right"
                      onWheel={(e) => e.currentTarget.blur()}
                    />
                  </div>

                  <div className="flex flex-col gap-2 min-w-[120px]">
                    <label className="text-sm font-medium text-slate-700">Closing</label>
                    <Input
                      type="number"
                      value={rawClosing}
                      readOnly
                      className="text-right bg-slate-100"
                      onWheel={(e) => e.currentTarget.blur()}
                    />
                  </div>

                  <Button onClick={handleAddRawEntry} className="gap-2">
                    <Plus className="h-4 w-4" />
                    Add
                  </Button>
                </div>
              </Card>

              {/* Distributor Entries Table */}
              {rawMaterialEntries.length > 0 && (
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
                        {rawMaterialEntries.map((entry) => (
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
