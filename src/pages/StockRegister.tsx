// src/pages/StockRegister.tsx
import React, { useEffect, useMemo, useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format, startOfMonth } from "date-fns";
import {
  Calendar as CalendarIcon,
  Printer,
  ArrowLeft,
  Plus,
  ChevronLeft,
  ChevronRight,
  Trash,
  Edit,
  FileText,
  Download,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { formulationsData } from "@/data/formulations";
import { productPricesData, chemicalPrices } from "@/data/pricingData";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

// external libs for export — ensure installed: xlsx, jspdf, jspdf-autotable
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import "jspdf-autotable";

interface StockEntry {
  id: string;
  productName: string;
  opening: number;
  production: number;
  sales: number;
  closing: number;
  soldAmount: number;
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


const getProductPrice = (productName: string): number => {
  const priceData = productPricesData.find((p) => p.product === productName);
  return priceData?.retailPrice || 0;
};

const MONTHS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

const StockRegister: React.FC = () => {
  const navigate = useNavigate();

  // month state
  const [selectedMonth, setSelectedMonth] = useState<Date>(new Date(2025, 9)); // keep same default as original (Oct 2025)
  const [showMonthPicker, setShowMonthPicker] = useState(false);

  // tabs
  const [activeTab, setActiveTab] = useState<"warehouse" | "distributor" | "rawmaterials">(
    "warehouse"
  );

  // lists loaded from DB
  const [warehouseEntries, setWarehouseEntries] = useState<StockEntry[]>([]);
  const [distributorEntries, setDistributorEntries] = useState<StockEntry[]>([]);
  const [rawMaterialEntries, setRawMaterialEntries] = useState<RawMaterialEntry[]>([]);

  // Warehouse form states (original fields & order)
  const [warehouseProduct, setWarehouseProduct] = useState<string>("");
  const [warehouseOpening, setWarehouseOpening] = useState<string>("");
  const [warehouseProduction, setWarehouseProduction] = useState<string>("");
  const [warehouseSales, setWarehouseSales] = useState<string>("");

  // Distributor form states
  const [distributorProduct, setDistributorProduct] = useState<string>("");
  const [distributorOpening, setDistributorOpening] = useState<string>("");
  const [distributorProduction, setDistributorProduction] = useState<string>("");
  const [distributorSales, setDistributorSales] = useState<string>("");

  // Raw materials form states
  const [rawMaterialChemical, setRawMaterialChemical] = useState<string>("");
  const [rawMaterialOpening, setRawMaterialOpening] = useState<string>("");
  const [rawMaterialPurchased, setRawMaterialPurchased] = useState<string>("");
  const [rawMaterialUsed, setRawMaterialUsed] = useState<string>("");

  // Edit modal state
  const [editing, setEditing] = useState<{
    type: "warehouse" | "distributor" | "rawmaterials" | null;
    id: string | null;
    payload?: any;
  }>({ type: null, id: null });

  // Deleting state (simple confirm)
  const [deleting, setDeleting] = useState<{ type: string | null; id: string | null }>({
    type: null,
    id: null,
  });

  // computed closings using your original arithmetic logic
  const warehouseClosing = useMemo(() => {
    const opening = parseFloat(warehouseOpening) || 0;
    const production = parseFloat(warehouseProduction) || 0;
    const sales = parseFloat(warehouseSales) || 0;
    // carefully compute: closing = opening + production - sales
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

  // auto load data when month changes
  useEffect(() => {
    loadWarehouseEntries();
    loadDistributorEntries();
    loadRawMaterialEntries();
  }, [selectedMonth]);

  // auto-populate opening from previous month - warehouse
  useEffect(() => {
    if (!warehouseProduct || editing.type === "warehouse") return;
    
    const previousMonth = new Date(selectedMonth.getFullYear(), selectedMonth.getMonth() - 1);
    const prevMonthStart = startOfMonth(previousMonth);
    
    supabase
      .from("warehouse_stock")
      .select("closing")
      .eq("month", format(prevMonthStart, "yyyy-MM-dd"))
      .eq("product_name", warehouseProduct)
      .maybeSingle()
      .then(({ data, error }) => {
        if (error) {
          console.error("Prev month fetch error:", error);
          return;
        }
        if (data) {
          setWarehouseOpening(data.closing?.toString() ?? "0");
        } else {
          setWarehouseOpening("0");
        }
      });
  }, [warehouseProduct, selectedMonth]);

  // distributor previous closing auto-populate
  useEffect(() => {
    if (!distributorProduct || editing.type === "distributor") return;
    
    const previousMonth = new Date(selectedMonth.getFullYear(), selectedMonth.getMonth() - 1);
    const prevMonthStart = startOfMonth(previousMonth);
    
    supabase
      .from("distributor_stock")
      .select("closing")
      .eq("month", format(prevMonthStart, "yyyy-MM-dd"))
      .eq("product_name", distributorProduct)
      .maybeSingle()
      .then(({ data, error }) => {
        if (error) {
          console.error("Prev month distributor fetch error:", error);
          return;
        }
        if (data) {
          setDistributorOpening(data.closing?.toString() ?? "0");
        } else {
          setDistributorOpening("0");
        }
      });
  }, [distributorProduct, selectedMonth]);

  // raw materials previous closing auto-populate
  useEffect(() => {
    if (!rawMaterialChemical || editing.type === "rawmaterials") return;
    
    const previousMonth = new Date(selectedMonth.getFullYear(), selectedMonth.getMonth() - 1);
    const prevMonthStart = startOfMonth(previousMonth);
    
    supabase
      .from("raw_materials_stock")
      .select("closing")
      .eq("month", format(prevMonthStart, "yyyy-MM-dd"))
      .eq("chemical_name", rawMaterialChemical)
      .maybeSingle()
      .then(({ data, error }) => {
        if (error) {
          console.error("Prev month raw material fetch error:", error);
          return;
        }
        if (data) {
          setRawMaterialOpening(data.closing?.toString() ?? "0");
        } else {
          setRawMaterialOpening("0");
        }
      });
  }, [rawMaterialChemical, selectedMonth]);

  // -------------------------
  // Loaders (same fields & structure)
  // -------------------------
  const loadWarehouseEntries = async () => {
    try {
      const monthStart = startOfMonth(selectedMonth);
      const res = await supabase
        .from("warehouse_stock")
        .select("*")
        .eq("month", format(monthStart, "yyyy-MM-dd"));

      if (res.error) {
        console.error("Error loading warehouse entries:", res.error);
        toast.error("Failed to load warehouse entries");
        return;
      }
      if (res.data) {
        const entries: StockEntry[] = res.data.map((entry: any) => {
          const closing = Number(entry.closing);
          const sales = Number(entry.sales);
          // price lookup
          const price = getProductPrice(entry.product_name);
          const soldAmount = sales * price;
          const amount = closing * price;
          return {
            id: entry.id,
            productName: entry.product_name,
            opening: Number(entry.opening),
            production: Number(entry.production),
            sales: sales,
            closing: closing,
            soldAmount: soldAmount,
            amount: amount,
          };
        });
        setWarehouseEntries(entries);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const loadDistributorEntries = async () => {
    try {
      const monthStart = startOfMonth(selectedMonth);
      const res = await supabase
        .from("distributor_stock")
        .select("*")
        .eq("month", format(monthStart, "yyyy-MM-dd"));

      if (res.error) {
        console.error("Error loading distributor entries:", res.error);
        toast.error("Failed to load distributor entries");
        return;
      }
      if (res.data) {
        const entries: StockEntry[] = res.data.map((entry: any) => {
          const closing = Number(entry.closing);
          const sales = Number(entry.sales);
          const price = getProductPrice(entry.product_name);
          const soldAmount = sales * price;
          return {
            id: entry.id,
            productName: entry.product_name,
            opening: Number(entry.opening),
            production: Number(entry.production),
            sales: sales,
            closing: closing,
            soldAmount: soldAmount,
            amount: closing * price,
          };
        });
        setDistributorEntries(entries);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const loadRawMaterialEntries = async () => {
    try {
      const monthStart = startOfMonth(selectedMonth);
      const res = await supabase
        .from("raw_materials_stock")
        .select("*")
        .eq("month", format(monthStart, "yyyy-MM-dd"));

      if (res.error) {
        console.error("Error loading raw material entries:", res.error);
        toast.error("Failed to load raw material entries");
        return;
      }
      if (res.data) {
        const entries: RawMaterialEntry[] = res.data.map((entry: any) => ({
          id: entry.id,
          chemicalName: entry.chemical_name,
          opening: Number(entry.opening),
          purchased: Number(entry.purchased),
          used: Number(entry.used),
          closing: Number(entry.closing),
        }));
        setRawMaterialEntries(entries);
      }
    } catch (err) {
      console.error(err);
    }
  };

  // -------------------------
  // Add handlers (keeps same logic & DB fields)
  // -------------------------
  const handleAddWarehouseEntry = async () => {
    if (!warehouseProduct) {
      toast.error("Please select a product");
      return;
    }

    const monthStart = startOfMonth(selectedMonth);
    const opening = parseFloat(warehouseOpening) || 0;
    const production = parseFloat(warehouseProduction) || 0;
    const sales = parseFloat(warehouseSales) || 0;
    const closing = warehouseClosing;

    // Check existing (same pattern as original)
    const { data: existing } = await supabase
      .from("warehouse_stock")
      .select("id")
      .eq("month", format(monthStart, "yyyy-MM-dd"))
      .eq("product_name", warehouseProduct)
      .maybeSingle();

    if (existing) {
      toast.error("Entry already exists for this product in this month");
      return;
    }

    const { data, error } = await supabase
      .from("warehouse_stock")
      .insert({
        month: format(monthStart, "yyyy-MM-dd"),
        product_name: warehouseProduct,
        opening: opening,
        production: production,
        sales: sales,
        closing: closing,
      })
      .select()
      .single();

    if (error) {
      toast.error("Failed to add warehouse entry");
      console.error("Error adding warehouse entry:", error);
      return;
    }

    if (data) {
      const price = getProductPrice(data.product_name);
      const sales = Number(data.sales);
      const closing = Number(data.closing);
      const newEntry: StockEntry = {
        id: data.id,
        productName: data.product_name,
        opening: Number(data.opening),
        production: Number(data.production),
        sales: sales,
        closing: closing,
        soldAmount: sales * price,
        amount: closing * price,
      };
      setWarehouseEntries((prev) => [...prev, newEntry]);
      toast.success("Warehouse entry added successfully");
      // reset form
      setWarehouseProduct("");
      setWarehouseOpening("");
      setWarehouseProduction("");
      setWarehouseSales("");
    }
  };

  const handleAddDistributorEntry = async () => {
    if (!distributorProduct) {
      toast.error("Please select a product");
      return;
    }

    const monthStart = startOfMonth(selectedMonth);
    const opening = parseFloat(distributorOpening) || 0;
    const production = parseFloat(distributorProduction) || 0;
    const sales = parseFloat(distributorSales) || 0;
    const closing = distributorClosing;

    const { data: existing } = await supabase
      .from("distributor_stock")
      .select("id")
      .eq("month", format(monthStart, "yyyy-MM-dd"))
      .eq("product_name", distributorProduct)
      .maybeSingle();

    if (existing) {
      toast.error("Entry already exists for this product in this month");
      return;
    }

    const { data, error } = await supabase
      .from("distributor_stock")
      .insert({
        month: format(monthStart, "yyyy-MM-dd"),
        product_name: distributorProduct,
        opening: opening,
        production: production,
        sales: sales,
        closing: closing,
      })
      .select()
      .single();

    if (error) {
      toast.error("Failed to add distributor entry");
      console.error("Error adding distributor entry:", error);
      return;
    }

    if (data) {
      const price = getProductPrice(data.product_name);
      const sales = Number(data.sales);
      const closing = Number(data.closing);
      const newEntry: StockEntry = {
        id: data.id,
        productName: data.product_name,
        opening: Number(data.opening),
        production: Number(data.production),
        sales: sales,
        closing: closing,
        soldAmount: sales * price,
        amount: closing * price,
      };
      setDistributorEntries((prev) => [...prev, newEntry]);
      toast.success("Distributor entry added successfully");
      setDistributorProduct("");
      setDistributorOpening("");
      setDistributorProduction("");
      setDistributorSales("");
    }
  };

  const handleAddRawMaterialEntry = async () => {
    if (!rawMaterialChemical) {
      toast.error("Please select a chemical");
      return;
    }

    const monthStart = startOfMonth(selectedMonth);
    const opening = parseFloat(rawMaterialOpening) || 0;
    const purchased = parseFloat(rawMaterialPurchased) || 0;
    const used = parseFloat(rawMaterialUsed) || 0;
    const closing = rawMaterialClosing;

    const { data: existing } = await supabase
      .from("raw_materials_stock")
      .select("id")
      .eq("month", format(monthStart, "yyyy-MM-dd"))
      .eq("chemical_name", rawMaterialChemical)
      .maybeSingle();

    if (existing) {
      toast.error("Entry already exists for this chemical in this month");
      return;
    }

    const { data, error } = await supabase
      .from("raw_materials_stock")
      .insert({
        month: format(monthStart, "yyyy-MM-dd"),
        chemical_name: rawMaterialChemical,
        opening: opening,
        purchased: purchased,
        used: used,
        closing: closing,
      })
      .select()
      .single();

    if (error) {
      toast.error("Failed to add raw material entry");
      console.error("Error adding raw material entry:", error);
      return;
    }

    if (data) {
      const newEntry: RawMaterialEntry = {
        id: data.id,
        chemicalName: data.chemical_name,
        opening: Number(data.opening),
        purchased: Number(data.purchased),
        used: Number(data.used),
        closing: Number(data.closing),
      };
      setRawMaterialEntries((prev) => [...prev, newEntry]);
      toast.success("Raw material entry added successfully");
      setRawMaterialChemical("");
      setRawMaterialOpening("");
      setRawMaterialPurchased("");
      setRawMaterialUsed("");
    }
  };

  // -------------------------
  // Edit handlers (update same fields)
  // -------------------------
  const beginEdit = (type: "warehouse" | "distributor" | "rawmaterials", entry: any) => {
    setEditing({
      type,
      id: entry.id,
      payload: entry,
    });

    // populate form fields with the entry's values for in-place edit UX
    if (type === "warehouse") {
      setWarehouseProduct(entry.productName);
      setWarehouseOpening(entry.opening.toString());
      setWarehouseProduction(entry.production.toString());
      setWarehouseSales(entry.sales.toString());
    } else if (type === "distributor") {
      setDistributorProduct(entry.productName);
      setDistributorOpening(entry.opening.toString());
      setDistributorProduction(entry.production.toString());
      setDistributorSales(entry.sales.toString());
    } else if (type === "rawmaterials") {
      setRawMaterialChemical(entry.chemicalName);
      setRawMaterialOpening(entry.opening.toString());
      setRawMaterialPurchased(entry.purchased.toString());
      setRawMaterialUsed(entry.used.toString());
    }
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSaveEdit = async () => {
    if (!editing.type || !editing.id) return;
    const monthStart = startOfMonth(selectedMonth);

    if (editing.type === "warehouse") {
      const opening = parseFloat(warehouseOpening) || 0;
      const production = parseFloat(warehouseProduction) || 0;
      const sales = parseFloat(warehouseSales) || 0;
      const closing = opening + production - sales;

      const { error, data } = await supabase
        .from("warehouse_stock")
        .update({
          product_name: warehouseProduct,
          opening,
          production,
          sales,
          closing,
        })
        .eq("id", editing.id)
        .select()
        .single();

      if (error) {
        toast.error("Failed to update warehouse entry");
        console.error("Warehouse update error:", error);
        return;
      }

      // update local state (same representation)
      const price = getProductPrice(data.product_name);
      const salesNum = Number(data.sales);
      const closingNum = Number(data.closing);
      setWarehouseEntries((prev) =>
        prev.map((e) =>
          e.id === editing.id
            ? {
                ...e,
                productName: data.product_name,
                opening: Number(data.opening),
                production: Number(data.production),
                sales: salesNum,
                closing: closingNum,
                soldAmount: salesNum * price,
                amount: closingNum * price,
              }
            : e
        )
      );

      toast.success("Warehouse entry updated");
    } else if (editing.type === "distributor") {
      const opening = parseFloat(distributorOpening) || 0;
      const production = parseFloat(distributorProduction) || 0;
      const sales = parseFloat(distributorSales) || 0;
      const closing = opening + production - sales;

      const { error, data } = await supabase
        .from("distributor_stock")
        .update({
          product_name: distributorProduct,
          opening,
          production,
          sales,
          closing,
        })
        .eq("id", editing.id)
        .select()
        .single();

      if (error) {
        toast.error("Failed to update distributor entry");
        console.error("Distributor update error:", error);
        return;
      }

      const price = getProductPrice(data.product_name);
      const salesNum = Number(data.sales);
      const closingNum = Number(data.closing);
      setDistributorEntries((prev) =>
        prev.map((e) =>
          e.id === editing.id
            ? {
                ...e,
                productName: data.product_name,
                opening: Number(data.opening),
                production: Number(data.production),
                sales: salesNum,
                closing: closingNum,
                soldAmount: salesNum * price,
                amount: closingNum * price,
              }
            : e
        )
      );

      toast.success("Distributor entry updated");
    } else if (editing.type === "rawmaterials") {
      const opening = parseFloat(rawMaterialOpening) || 0;
      const purchased = parseFloat(rawMaterialPurchased) || 0;
      const used = parseFloat(rawMaterialUsed) || 0;
      const closing = opening + purchased - used;

      const { error, data } = await supabase
        .from("raw_materials_stock")
        .update({
          chemical_name: rawMaterialChemical,
          opening,
          purchased,
          used,
          closing,
        })
        .eq("id", editing.id)
        .select()
        .single();

      if (error) {
        toast.error("Failed to update raw material entry");
        console.error("Raw material update error:", error);
        return;
      }

      setRawMaterialEntries((prev) =>
        prev.map((e) =>
          e.id === editing.id
            ? {
                ...e,
                chemicalName: data.chemical_name,
                opening: Number(data.opening),
                purchased: Number(data.purchased),
                used: Number(data.used),
                closing: Number(data.closing),
              }
            : e
        )
      );

      toast.success("Raw material entry updated");
    }

    // clear editing & reset forms (keep your original UX)
    setEditing({ type: null, id: null });
    setWarehouseProduct("");
    setWarehouseOpening("");
    setWarehouseProduction("");
    setWarehouseSales("");

    setDistributorProduct("");
    setDistributorOpening("");
    setDistributorProduction("");
    setDistributorSales("");

    setRawMaterialChemical("");
    setRawMaterialOpening("");
    setRawMaterialPurchased("");
    setRawMaterialUsed("");
  };

  // -------------------------
  // Delete handlers
  // -------------------------
  const beginDelete = (type: string, id: string) => {
    setDeleting({ type, id });
  };

  const confirmDelete = async () => {
    if (!deleting.type || !deleting.id) return;
    try {
      let tableName: "warehouse_stock" | "distributor_stock" | "raw_materials_stock" = "warehouse_stock";
      if (deleting.type === "warehouse") tableName = "warehouse_stock";
      if (deleting.type === "distributor") tableName = "distributor_stock";
      if (deleting.type === "rawmaterials") tableName = "raw_materials_stock";

      const { error } = await supabase.from(tableName).delete().eq("id", deleting.id);
      if (error) {
        toast.error("Failed to delete entry");
        console.error("Delete error:", error);
        return;
      }

      // remove from local state
      if (deleting.type === "warehouse") {
        setWarehouseEntries((prev) => prev.filter((e) => e.id !== deleting.id));
      } else if (deleting.type === "distributor") {
        setDistributorEntries((prev) => prev.filter((e) => e.id !== deleting.id));
      } else if (deleting.type === "rawmaterials") {
        setRawMaterialEntries((prev) => prev.filter((e) => e.id !== deleting.id));
      }

      toast.success("Entry deleted");
      setDeleting({ type: null, id: null });
    } catch (err) {
      console.error(err);
      toast.error("Delete failed");
    }
  };

  // -------------------------
  // Totals & summary calculations
  // -------------------------
  const warehouseTotals = useMemo(() => {
    // sum closing, sold amount, and amount
    let totalClosing = 0;
    let totalSoldAmount = 0;
    let totalAmount = 0;
    for (const e of warehouseEntries) {
      // careful numeric addition
      totalClosing = totalClosing + Number(e.closing || 0);
      totalSoldAmount = totalSoldAmount + Number(e.soldAmount || 0);
      totalAmount = totalAmount + Number(e.amount || 0);
    }
    return { totalClosing, totalSoldAmount, totalAmount };
  }, [warehouseEntries]);

  const distributorTotals = useMemo(() => {
    let totalClosing = 0;
    let totalSoldAmount = 0;
    let totalAmount = 0;
    for (const e of distributorEntries) {
      totalClosing = totalClosing + Number(e.closing || 0);
      totalSoldAmount = totalSoldAmount + Number(e.soldAmount || 0);
      totalAmount = totalAmount + Number(e.amount || 0);
    }
    return { totalClosing, totalSoldAmount, totalAmount };
  }, [distributorEntries]);

  const rawMaterialTotals = useMemo(() => {
    let totalClosing = 0;
    for (const e of rawMaterialEntries) {
      totalClosing = totalClosing + Number(e.closing || 0);
    }
    return { totalClosing };
  }, [rawMaterialEntries]);

  // -------------------------
  // Exports
  // -------------------------
  const exportWarehouseToExcel = () => {
    const wsData = [
      ["Product Name", "Opening", "Production", "Sales", "Closing", "Sold Amount (₹)", "Amount (₹)"],
      ...warehouseEntries.map((e) => [
        e.productName,
        e.opening,
        e.production,
        e.sales,
        e.closing,
        e.soldAmount,
        e.amount,
      ]),
      ["Totals", "", "", "", warehouseTotals.totalClosing, warehouseTotals.totalSoldAmount, warehouseTotals.totalAmount],
    ];
    const ws = XLSX.utils.aoa_to_sheet(wsData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Warehouse");
    XLSX.writeFile(wb, `warehouse_${format(startOfMonth(selectedMonth), "yyyy-MM")}.xlsx`);
  };

  const exportDistributorToExcel = () => {
    const wsData = [
      ["Product Name", "Opening", "Production", "Sales", "Closing", "Sold Amount (₹)", "Amount (₹)"],
      ...distributorEntries.map((e) => [
        e.productName,
        e.opening,
        e.production,
        e.sales,
        e.closing,
        e.soldAmount,
        e.amount,
      ]),
      ["Totals", "", "", "", distributorTotals.totalClosing, distributorTotals.totalSoldAmount, distributorTotals.totalAmount],
    ];
    const ws = XLSX.utils.aoa_to_sheet(wsData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Distributor");
    XLSX.writeFile(wb, `distributor_${format(startOfMonth(selectedMonth), "yyyy-MM")}.xlsx`);
  };

  const exportRawMaterialsToExcel = () => {
    const wsData = [
      ["Chemical Name", "Opening", "Purchased", "Used", "Closing"],
      ...rawMaterialEntries.map((e) => [
        e.chemicalName,
        e.opening,
        e.purchased,
        e.used,
        e.closing,
      ]),
      ["Totals", "", "", "", rawMaterialTotals.totalClosing],
    ];
    const ws = XLSX.utils.aoa_to_sheet(wsData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "RawMaterials");
    XLSX.writeFile(wb, `rawmaterials_${format(startOfMonth(selectedMonth), "yyyy-MM")}.xlsx`);
  };

  const exportAllToPDF = () => {
    const doc = new jsPDF({ orientation: "landscape" });
    const title = `Stock Report - ${format(startOfMonth(selectedMonth), "MMMM yyyy")}`;
    doc.setFontSize(14);
    doc.text(title, 14, 16);

    // Warehouse
    doc.setFontSize(12);
    doc.text("Warehouse", 14, 26);
    (doc as any).autoTable({
      startY: 28,
      head: [["Product", "Opening", "Production", "Sales", "Closing", "Sold Amt (₹)", "Amount (₹)"]],
      body: warehouseEntries.map((e) => [
        e.productName,
        e.opening,
        e.production,
        e.sales,
        e.closing,
        e.soldAmount.toFixed(2),
        e.amount.toFixed(2),
      ]),
      foot: [["Totals", "", "", "", warehouseTotals.totalClosing, warehouseTotals.totalSoldAmount.toFixed(2), warehouseTotals.totalAmount.toFixed(2)]],
      theme: "grid",
    });

    // Distributor
    const afterWarehouseY = (doc as any).lastAutoTable.finalY + 8;
    doc.text("Distributor", 14, afterWarehouseY);
    (doc as any).autoTable({
      startY: afterWarehouseY + 2,
      head: [["Product", "Opening", "Production", "Sales", "Closing", "Sold Amt (₹)", "Amount (₹)"]],
      body: distributorEntries.map((e) => [
        e.productName,
        e.opening,
        e.production,
        e.sales,
        e.closing,
        e.soldAmount.toFixed(2),
        e.amount.toFixed(2),
      ]),
      foot: [["Totals", "", "", "", distributorTotals.totalClosing, distributorTotals.totalSoldAmount.toFixed(2), distributorTotals.totalAmount.toFixed(2)]],
      theme: "grid",
    });

    // Raw materials (on next page if needed)
    const afterDistY = (doc as any).lastAutoTable.finalY + 8;
    doc.addPage();
    doc.text("Raw Materials", 14, 16);
    (doc as any).autoTable({
      startY: 18,
      head: [["Chemical", "Opening", "Purchased", "Used", "Closing"]],
      body: rawMaterialEntries.map((e) => [
        e.chemicalName,
        e.opening,
        e.purchased,
        e.used,
        e.closing,
      ]),
      foot: [["Totals", "", "", "", rawMaterialTotals.totalClosing]],
      theme: "grid",
    });

    doc.save(`stock_report_${format(startOfMonth(selectedMonth), "yyyy-MM")}.pdf`);
  };

  const handlePrintReport = () => {
    window.print();
  };

  // -------------------------
  // Helpers (formatting)
  // -------------------------
  const formatNumber = (n: number) => {
    // simple format — no locale change
    return Number(n).toLocaleString(undefined, { maximumFractionDigits: 2 });
  };

  // -------------------------
  // UI return (single-file)
  // -------------------------
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
                variant="outline"
                className="gap-2"
              >
                <Printer className="h-4 w-4" />
                Print Monthly Report
              </Button>

              <Button
                onClick={() => {
                  exportWarehouseToExcel();
                  exportDistributorToExcel();
                  exportRawMaterialsToExcel();
                }}
                variant="outline"
                className="gap-2"
              >
                <Download className="h-4 w-4" />
                Export Excel
              </Button>

              <Button onClick={() => navigate("/")} variant="outline" className="gap-2">
                <ArrowLeft className="h-4 w-4" />
                Back to Dashboard
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
{/* Month Selector Card */}
<Card className="p-6 text-center flex flex-col">
  <div className="text-2xl font-semibold text-black mb-6">Select Month</div>

  <div className="flex justify-center">
    <Popover open={showMonthPicker} onOpenChange={setShowMonthPicker}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            "w-56 justify-start text-left font-normal",
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
              onClick={() =>
                setSelectedMonth(
                  new Date(selectedMonth.getFullYear() - 1, selectedMonth.getMonth())
                )
              }
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>

            <div className="font-semibold">{selectedMonth.getFullYear()}</div>

            <Button
              variant="outline"
              size="icon"
              onClick={() =>
                setSelectedMonth(
                  new Date(selectedMonth.getFullYear() + 1, selectedMonth.getMonth())
                )
              }
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>

          <div className="grid grid-cols-3 gap-2">
            {MONTHS.map((month, index) => (
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
  </div>
</Card>




            {/* Warehouse Summary Card */}
              <Card className="p-4">
                <div className="text-center">
                  <div className="text-2xl font-semibold text-black">Warehouse</div>
                </div>

                <Card className="p-4 mt-4">
                  {/* Total Closing Qty */}
                  <div className="flex flex-col items-center text-sm text-muted-foreground mt-1">
                    <div>Total Closing Qty</div>
                    <div className="text-2xl font-semibold text-black mt-1">
                      {formatNumber(warehouseTotals.totalClosing)}
                    </div>
                  </div>

                  {/* Total Value and Sold Amount */}
                  <div className="flex justify-between mt-6">
                    <div className="flex flex-col items-center">
                      <div className="text-sm text-muted-foreground">Total Value ₹</div>
                      <div className="text-2xl font-semibold text-black mt-1">
                        {formatNumber(warehouseTotals.totalAmount)}
                      </div>
                    </div>
                    <div className="flex flex-col items-center">
                      <div className="text-sm text-muted-foreground">Sold Amount ₹</div>
                      <div className="text-2xl font-semibold text-black mt-1">
                        {formatNumber(warehouseTotals.totalSoldAmount)}
                      </div>
                    </div>
                  </div>
                </Card>
              </Card>

              {/* Distributor Summary Card */}
              <Card className="p-4">
                <div className="text-center">
                  <div className="text-2xl font-semibold text-black">Distributor</div>
                </div>

                <Card className="p-4 mt-4">
                  {/* Total Closing Qty */}
                  <div className="flex flex-col items-center text-sm text-muted-foreground mt-1">
                    <div>Total Closing Qty</div>
                    <div className="text-2xl font-semibold text-black mt-1">
                      {formatNumber(distributorTotals.totalClosing)}
                    </div>
                  </div>

                  {/* Total Value and Sold Amount */}
                  <div className="flex justify-between mt-6">
                    <div className="flex flex-col items-center">
                      <div className="text-sm text-muted-foreground">Total Value ₹</div>
                      <div className="text-2xl font-semibold text-black mt-1">
                        {formatNumber(distributorTotals.totalAmount)}
                      </div>
                    </div>
                    <div className="flex flex-col items-center">
                      <div className="text-sm text-muted-foreground">Sold Amount ₹</div>
                      <div className="text-2xl font-semibold text-black mt-1">
                        {formatNumber(distributorTotals.totalSoldAmount)}
                      </div>
                    </div>
                  </div>
                </Card>
              </Card>

              {/* Raw Materials Summary Card */}
              <Card className="p-4">
                <div className="text-center">
                  <div className="text-2xl font-semibold text-black">Raw Materials</div>
                </div>

                <Card className="p-4 mt-4 flex flex-col items-center justify-center min-h-[150px]">
  {/* Total Closing Qty */}
  <div className="flex flex-col items-center justify-center text-sm text-muted-foreground">
    <div>Total Closing Qty</div>
    <div className="text-2xl font-semibold text-black mt-1">
      {formatNumber(rawMaterialTotals.totalClosing)}
    </div>
  </div>
</Card>

              </Card>


          </div>


          {/* Tabs */}
          <Tabs defaultValue="warehouse" className="w-full">
            <TabsList className="grid w-full grid-cols-3 mb-6">
              <TabsTrigger
                value="warehouse"
                className="text-lg data-[state=active]:bg-blue-600 data-[state=active]:text-white bg-white text-black"
              >
                Warehouse
              </TabsTrigger>
              <TabsTrigger
                value="distributor"
                className="text-lg data-[state=active]:bg-blue-600 data-[state=active]:text-white bg-white text-black"
              >
                Distributor
              </TabsTrigger>
              <TabsTrigger
                value="rawmaterials"
                className="text-lg data-[state=active]:bg-blue-600 data-[state=active]:text-white bg-white text-black"
              >
                Raw Materials
              </TabsTrigger>
            </TabsList>

            {/* Warehouse Tab */}
            <TabsContent value="warehouse">
              <Card className="p-6 mb-6 shadow-lg">
                <h3 className="text-xl font-semibold text-slate-800 mb-4">Add / Edit Warehouse Entrries - {format(selectedMonth, "MMMM yyyy")}</h3>
                <div className="flex gap-4 items-end flex-wrap">
                  <div className="flex flex-col gap-2 min-w-[180px]">
                    <label className="text-sm font-medium text-slate-700">Product Name</label>
                    <Select value={warehouseProduct} onValueChange={setWarehouseProduct}>
                      <SelectTrigger><SelectValue placeholder="Select product" /></SelectTrigger>
                      <SelectContent>
                        {formulationsData.map((f) => (
                          <SelectItem key={f.id} value={f.name}>{f.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex flex-col gap-2 min-w-[120px]">
                    <label className="text-sm font-medium text-slate-700">Opening</label>
                    <Input type="number" min="0" step="1" value={warehouseOpening} onChange={(e) => setWarehouseOpening(e.target.value)} className="text-right" onWheel={(e) => e.currentTarget.blur()} />
                  </div>

                  <div className="flex flex-col gap-2 min-w-[120px]">
                    <label className="text-sm font-medium text-slate-700">Production</label>
                    <Input type="number" min="0" step="1" value={warehouseProduction} onChange={(e) => setWarehouseProduction(e.target.value)} className="text-right" onWheel={(e) => e.currentTarget.blur()} />
                  </div>

                  <div className="flex flex-col gap-2 min-w-[120px]">
                    <label className="text-sm font-medium text-slate-700">Sales</label>
                    <Input type="number" min="0" step="1" value={warehouseSales} onChange={(e) => setWarehouseSales(e.target.value)} className="text-right" onWheel={(e) => e.currentTarget.blur()} />
                  </div>

                  <div className="flex flex-col gap-2 min-w-[120px]">
                    <label className="text-sm font-medium text-slate-700">Closing</label>
                    <Input type="number" value={warehouseClosing} readOnly className="text-right bg-slate-100" onWheel={(e) => e.currentTarget.blur()} />
                  </div>

                  <div className="flex gap-2">
                    <Button onClick={handleAddWarehouseEntry} className="gap-2"><Plus className="h-4 w-4"/> Add</Button>
                    {editing.type === "warehouse" && editing.id && (
                      <Button variant="secondary" onClick={handleSaveEdit} className="gap-2"><Edit className="h-4 w-4"/> Save Edit</Button>
                    )}
                  </div>
                </div>
              </Card>

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
                          <TableHead className="text-right">Sold Amount (₹)</TableHead>
                          <TableHead className="text-right">Amount (₹)</TableHead>
                          <TableHead className="text-right">Actions</TableHead>
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
                            <TableCell className="text-right font-semibold text-primary">{entry.soldAmount.toFixed(2)}</TableCell>
                            <TableCell className="text-right font-semibold text-primary">{entry.amount.toFixed(2)}</TableCell>
                            <TableCell className="text-right">
                              <div className="flex justify-end gap-2">
                                <Button size="icon" variant="ghost" onClick={() => beginEdit("warehouse", entry)}><Edit className="h-4 w-4"/></Button>
                                <Button size="icon" variant="destructive" onClick={() => beginDelete("warehouse", entry.id)}><Trash className="h-4 w-4"/></Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}

                        {/* Totals row */}
                        <TableRow>
                          <TableCell className="font-semibold">Totals</TableCell>
                          <TableCell />
                          <TableCell />
                          <TableCell />
                          <TableCell className="text-right font-semibold">{warehouseTotals.totalClosing.toFixed(0)}</TableCell>
                          <TableCell className="text-right font-semibold text-primary">{warehouseTotals.totalSoldAmount.toFixed(2)}</TableCell>
                          <TableCell className="text-right font-semibold text-primary">{warehouseTotals.totalAmount.toFixed(2)}</TableCell>
                          <TableCell />
                        </TableRow>
                      </TableBody>
                    </Table>
                  </div>
                </Card>
              )}
            </TabsContent>

            {/* Distributor Tab */}
            <TabsContent value="distributor">
              <Card className="p-6 mb-6 shadow-lg">
                <h3 className="text-xl font-semibold text-slate-800 mb-4">Add / Edit Distributor Entries - {format(selectedMonth, "MMMM yyyy")}</h3>
                <div className="flex gap-4 items-end flex-wrap">
                  <div className="flex flex-col gap-2 min-w-[180px]">
                    <label className="text-sm font-medium text-slate-700">Product Name</label>
                    <Select value={distributorProduct} onValueChange={setDistributorProduct}>
                      <SelectTrigger><SelectValue placeholder="Select product" /></SelectTrigger>
                      <SelectContent>
                        {formulationsData.map((f) => (
                          <SelectItem key={f.id} value={f.name}>{f.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex flex-col gap-2 min-w-[120px]">
                    <label className="text-sm font-medium text-slate-700">Opening</label>
                    <Input type="number" min="0" step="1" value={distributorOpening} onChange={(e) => setDistributorOpening(e.target.value)} className="text-right" onWheel={(e) => e.currentTarget.blur()} />
                  </div>

                  <div className="flex flex-col gap-2 min-w-[120px]">
                    <label className="text-sm font-medium text-slate-700">Production</label>
                    <Input type="number" min="0" step="1" value={distributorProduction} onChange={(e) => setDistributorProduction(e.target.value)} className="text-right" onWheel={(e) => e.currentTarget.blur()} />
                  </div>

                  <div className="flex flex-col gap-2 min-w-[120px]">
                    <label className="text-sm font-medium text-slate-700">Sales</label>
                    <Input type="number" min="0" step="1" value={distributorSales} onChange={(e) => setDistributorSales(e.target.value)} className="text-right" onWheel={(e) => e.currentTarget.blur()} />
                  </div>

                  <div className="flex flex-col gap-2 min-w-[120px]">
                    <label className="text-sm font-medium text-slate-700">Closing</label>
                    <Input type="number" value={distributorClosing} readOnly className="text-right bg-slate-100" onWheel={(e) => e.currentTarget.blur()} />
                  </div>

                  <div className="flex gap-2">
                    <Button onClick={handleAddDistributorEntry} className="gap-2"><Plus className="h-4 w-4"/> Add</Button>
                    {editing.type === "distributor" && editing.id && (
                      <Button variant="secondary" onClick={handleSaveEdit} className="gap-2"><Edit className="h-4 w-4"/> Save Edit</Button>
                    )}
                  </div>
                </div>
              </Card>

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
                          <TableHead className="text-right">Sold Amount (₹)</TableHead>
                          <TableHead className="text-right">Amount (₹)</TableHead>
                          <TableHead className="text-right">Actions</TableHead>
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
                            <TableCell className="text-right font-semibold text-primary">{entry.soldAmount.toFixed(2)}</TableCell>
                            <TableCell className="text-right font-semibold text-primary">{entry.amount.toFixed(2)}</TableCell>
                            <TableCell className="text-right">
                              <div className="flex justify-end gap-2">
                                <Button size="icon" variant="ghost" onClick={() => beginEdit("distributor", entry)}><Edit className="h-4 w-4"/></Button>
                                <Button size="icon" variant="destructive" onClick={() => beginDelete("distributor", entry.id)}><Trash className="h-4 w-4"/></Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}

                        {/* Totals row */}
                        <TableRow>
                          <TableCell className="font-semibold">Totals</TableCell>
                          <TableCell />
                          <TableCell />
                          <TableCell />
                          <TableCell className="text-right font-semibold">{distributorTotals.totalClosing.toFixed(0)}</TableCell>
                          <TableCell className="text-right font-semibold text-primary">{distributorTotals.totalSoldAmount.toFixed(2)}</TableCell>
                          <TableCell className="text-right font-semibold text-primary">{distributorTotals.totalAmount.toFixed(2)}</TableCell>
                          <TableCell />
                        </TableRow>
                      </TableBody>
                    </Table>
                  </div>
                </Card>
              )}
            </TabsContent>

            {/* Raw Materials Tab */}
            <TabsContent value="rawmaterials">
              <Card className="p-6 mb-6 shadow-lg">
                <h3 className="text-xl font-semibold text-slate-800 mb-4">Add / Edit Raw Material Entries - {format(selectedMonth, "MMMM yyyy")}</h3>
                <div className="flex gap-4 items-end flex-wrap">
                  <div className="flex flex-col gap-2 min-w-[200px]">
                    <label className="text-sm font-medium text-slate-700">Chemical Name</label>
                    <Select value={rawMaterialChemical} onValueChange={setRawMaterialChemical}>
                      <SelectTrigger><SelectValue placeholder="Select chemical" /></SelectTrigger>
                      <SelectContent>
                        {chemicalPrices.map((chemical) => (
                          <SelectItem key={chemical.chemical} value={chemical.chemical}>{chemical.chemical}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex flex-col gap-2 min-w-[120px]">
                    <label className="text-sm font-medium text-slate-700">Opening</label>
                    <Input type="number" min="0" step="1" value={rawMaterialOpening} onChange={(e) => setRawMaterialOpening(e.target.value)} className="text-right" onWheel={(e) => e.currentTarget.blur()} />
                  </div>

                  <div className="flex flex-col gap-2 min-w-[120px]">
                    <label className="text-sm font-medium text-slate-700">Purchased</label>
                    <Input type="number" min="0" step="1" value={rawMaterialPurchased} onChange={(e) => setRawMaterialPurchased(e.target.value)} className="text-right" onWheel={(e) => e.currentTarget.blur()} />
                  </div>

                  <div className="flex flex-col gap-2 min-w-[120px]">
                    <label className="text-sm font-medium text-slate-700">Used</label>
                    <Input type="number" min="0" step="1" value={rawMaterialUsed} onChange={(e) => setRawMaterialUsed(e.target.value)} className="text-right" onWheel={(e) => e.currentTarget.blur()} />
                  </div>

                  <div className="flex flex-col gap-2 min-w-[120px]">
                    <label className="text-sm font-medium text-slate-700">Closing</label>
                    <Input type="number" value={rawMaterialClosing} readOnly className="text-right bg-slate-100" onWheel={(e) => e.currentTarget.blur()} />
                  </div>

                  <div className="flex gap-2">
                    <Button onClick={handleAddRawMaterialEntry} className="gap-2"><Plus className="h-4 w-4"/> Add</Button>
                    {editing.type === "rawmaterials" && editing.id && (
                      <Button variant="secondary" onClick={handleSaveEdit} className="gap-2"><Edit className="h-4 w-4"/> Save Edit</Button>
                    )}
                  </div>
                </div>
              </Card>

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
                          <TableHead className="text-right">Actions</TableHead>
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
                            <TableCell className="text-right">
                              <div className="flex justify-end gap-2">
                                <Button size="icon" variant="ghost" onClick={() => beginEdit("rawmaterials", entry)}><Edit className="h-4 w-4"/></Button>
                                <Button size="icon" variant="destructive" onClick={() => beginDelete("rawmaterials", entry.id)}><Trash className="h-4 w-4"/></Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}

                        {/* Totals row */}
                        <TableRow>
                          <TableCell className="font-semibold">Totals</TableCell>
                          <TableCell />
                          <TableCell />
                          <TableCell />
                          <TableCell className="text-right font-semibold">{rawMaterialTotals.totalClosing.toFixed(0)}</TableCell>
                          <TableCell />
                        </TableRow>
                      </TableBody>
                    </Table>
                  </div>
                </Card>
              )}
            </TabsContent>
          </Tabs>
        </div>

        {/* Delete confirmation modal (simple inline) */}
        {deleting.id && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
            <div className="bg-white rounded-lg p-6 w-96 shadow-lg">
              <h3 className="text-lg font-semibold mb-2">Confirm Delete</h3>
              <p className="text-sm text-muted-foreground mb-4">Are you sure you want to delete this entry? This action cannot be undone.</p>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setDeleting({ type: null, id: null })}>Cancel</Button>
                <Button variant="destructive" onClick={confirmDelete}>Delete</Button>
              </div>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default StockRegister;
