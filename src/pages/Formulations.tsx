import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Beaker, 
  Droplets, 
  Sparkles, 
  SprayCanIcon, 
  Car, 
  Home, 
  Utensils, 
  Shirt, 
  Bath, 
  Shield, 
  Zap, 
  Leaf, 
  FlaskConical, 
  Truck, 
  Building,
  DollarSign,
  Package,
  Calculator,
  Upload,
  Download,
  FileSpreadsheet,
  FileText
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { getFormulationBySlug } from "@/data/formulations";
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx';

const Formulations = () => {
  const navigate = useNavigate();

  const formulations = [
    { id: 1, name: "Phenyl", slug: "phenyl", icon: Droplets, color: "bg-blue-500", description: "Disinfecting floor cleaner" },
    { id: 2, name: "Dish Wash Liquid", slug: "dish-wash-liquid", icon: Utensils, color: "bg-green-500", description: "Grease cutting formula" },
    { id: 3, name: "Copper/Brass Liquid", slug: "brass-cleaning-liquid", icon: Sparkles, color: "bg-amber-500", description: "Metal surface cleaner" },
    { id: 4, name: "Toilet Cleaner", slug: "toilet-cleaner", icon: Bath, color: "bg-cyan-500", description: "Bathroom disinfectant" },
    { id: 5, name: "Acid", slug: "acid", icon: FlaskConical, color: "bg-red-500", description: "Industrial strength acid" },
    { id: 6, name: "Hand Wash Liquid", slug: "hand-wash-liquid", icon: SprayCanIcon, color: "bg-purple-500", description: "Gentle hand cleanser" },
    { id: 7, name: "Liquid Detergent", slug: "liquid-detergent", icon: Droplets, color: "bg-teal-500", description: "Liquid laundry formula" },
    { id: 8, name: "Floor Cleaning Liquid", slug: "floor-cleaning-liquid", icon: Home, color: "bg-slate-600", description: "All floor types cleaner" },
    { id: 9, name: "Detergent Powder", slug: "detergent-powder", icon: Shirt, color: "bg-indigo-500", description: "Laundry washing powder" },    
    { id: 10, name: "Rose Water", slug: "rose-water", icon: Leaf, color: "bg-pink-500", description: "Natural rose essence" },
    { id: 11, name: "Pain Relief Balm", slug: "pain-relief-balm", icon: Shield, color: "bg-orange-500", description: "Zandu Balm formula" },
    { id: 12, name: "White Petroleum Jelly", slug: "white-petroleum-jelly", icon: Beaker, color: "bg-gray-500", description: "Vaseline formula" },
    { id: 13, name: "Product Prices", slug: "product-prices", icon: DollarSign, color: "bg-emerald-600", description: "View all product prices" },
    { id: 14, name: "Packing Materials Cost", slug: "packing-materials", icon: Package, color: "bg-violet-600", description: "Bottle and packaging costs" },
    { id: 15, name: "Chemical Prices", slug: "chemical-prices", icon: Calculator, color: "bg-lime-600", description: "Raw material pricing" }
  ];

  const handleFormulationClick = (formulation: typeof formulations[0]) => {
    console.log(`Navigating to ${formulation.name} formulation`);
    
    // Handle special pages
    if (formulation.id === 13) {
      navigate('/product-prices');
      return;
    }
    if (formulation.id === 14) {
      navigate('/packing-materials');
      return;
    }
    if (formulation.id === 15) {
      navigate('/chemical-prices');
      return;
    }
    
    // Regular formulation pages - now using slug instead of ID
    navigate(`/formulation/${formulation.slug}`);
  };

  const exportToPDF = () => {
    const doc = new jsPDF();
    
    // Company header
    doc.setFontSize(16);
    doc.setFont(undefined, 'bold');
    doc.text('SPARKLE & SHINE', 105, 20, { align: 'center' });
    
    doc.setFontSize(10);
    doc.setFont(undefined, 'normal');
    doc.text('FLAT NO - 202, RK RESIDENCY, HARITHA ROYAL CITY COLONY, RAVALKOLE, MEDCHAL - 501401', 105, 30, { align: 'center' });
    
    // Get all formulations data
    const allFormulationsData = formulations
      .filter(f => f.id <= 12) // Only actual formulations, not pricing pages
      .map(f => {
        const formData = getFormulationBySlug(f.slug);
        return formData ? { ...f, ...formData } : null;
      })
      .filter(Boolean);

    let yPosition = 50;
    
    allFormulationsData.forEach((formulation, index) => {
      if (index > 0) {
        doc.addPage();
        yPosition = 20;
      }
      
      // Formulation name
      doc.setFontSize(14);
      doc.setFont(undefined, 'bold');
      doc.text(formulation.name, 105, yPosition, { align: 'center' });
      yPosition += 15;
      
      // Calculate total cost from ingredients
      const totalCost = formulation.ingredients?.reduce((sum, ing) => sum + parseFloat(ing.amount.toFixed(2)), 0) || 0;
      const baseYield = formulation.baseYield || 10; // Default to 10 liters if not specified
      
      // Calculate costs per different volumes
      const costPerLiter = totalCost / baseYield;
      const costPer500ML = (costPerLiter * 0.5);
      const costPer1L = costPerLiter;
      const costPer5L = (costPerLiter * 5);
      
      // Bottle costs (assuming bottle costs from formulation data or default)
      const bottle500MLCost = formulation.costPer500MLBottle || 10.55;
      const bottle1LCost = formulation.costPer1LBottle || 0;
      
      const totalCostPer500MLBottle = costPer500ML + bottle500MLCost;
      const totalCostPer1LBottle = costPer1L + bottle1LCost;
      
      // Ingredients table with properly formatted amounts
      const tableData = formulation.ingredients?.map(ing => [
        ing.slNo,
        ing.particulars,
        ing.uom,
        parseFloat(ing.qty.toFixed(2)),
        parseFloat(ing.rate.toFixed(2)),
        parseFloat(ing.amount.toFixed(2))
      ]) || [];
      
      // Add empty rows to match the format (up to 10 rows)
      while (tableData.length < 10) {
        tableData.push(['', '', '', '', '', 0]);
      }
      
      autoTable(doc, {
        startY: yPosition,
        head: [['SL.NO', 'PARTICULARS', 'UOM', 'QTY', 'RATE', 'AMOUNT']],
        body: tableData,
        theme: 'grid',
        styles: { fontSize: 9, cellPadding: 2 },
        headStyles: { fillColor: [100, 100, 100], textColor: 255, fontStyle: 'bold' },
        columnStyles: {
          0: { halign: 'center', cellWidth: 15 },
          1: { cellWidth: 50 },
          2: { halign: 'center', cellWidth: 20 },
          3: { halign: 'center', cellWidth: 20 },
          4: { halign: 'right', cellWidth: 25 },
          5: { halign: 'right', cellWidth: 30 }
        }
      });
      
      yPosition = (doc as any).lastAutoTable.finalY + 5;
      
      // Cost summary with proper currency symbol and formatting
      doc.setFontSize(10);
      doc.setFont(undefined, 'bold');
      
      // Cost per bottle row
      autoTable(doc, {
        startY: yPosition,
        body: [
          ['Cost / Per 500 ML Bottle', `Rs ${totalCostPer500MLBottle.toFixed(2)}`, bottle500MLCost.toFixed(2), totalCost.toFixed(2)]
        ],
        theme: 'grid',
        styles: { fontSize: 10, cellPadding: 2 },
        columnStyles: {
          0: { cellWidth: 80, fontStyle: 'bold' },
          1: { cellWidth: 40, halign: 'center', fontStyle: 'bold' },
          2: { cellWidth: 30, halign: 'center' },
          3: { cellWidth: 30, halign: 'right' }
        }
      });
      
      yPosition = (doc as any).lastAutoTable.finalY + 2;
      
      // Cost per 1L bottle and cost per liter row
      autoTable(doc, {
        startY: yPosition,
        body: [
          ['Cost / Per 1 Ltr Bottle', `Rs ${totalCostPer1LBottle.toFixed(2)}`, 'Cost / Ltr', costPerLiter.toFixed(2)]
        ],
        theme: 'grid',
        styles: { fontSize: 10, cellPadding: 2 },
        columnStyles: {
          0: { cellWidth: 80, fontStyle: 'bold' },
          1: { cellWidth: 40, halign: 'center', fontStyle: 'bold' },
          2: { cellWidth: 30, halign: 'center', fontStyle: 'bold' },
          3: { cellWidth: 30, halign: 'right' }
        }
      });
      
      yPosition = (doc as any).lastAutoTable.finalY + 15;
      
      // Method of preparation
      if (formulation.methodOfPreparation?.length > 0) {
        doc.setFontSize(12);
        doc.setFont(undefined, 'bold');
        doc.text('METHOD OF PREPARATION', 105, yPosition, { align: 'center' });
        yPosition += 10;
        
        doc.setFontSize(9);
        doc.setFont(undefined, 'normal');
        formulation.methodOfPreparation.forEach((step, i) => {
          const wrappedText = doc.splitTextToSize(`${i + 1}. ${step}`, 170);
          doc.text(wrappedText, 20, yPosition);
          yPosition += wrappedText.length * 5 + 2;
        });
      }
    });
    
    doc.save('Formulations.pdf');
  };

  const exportToExcel = () => {
    const workbook = XLSX.utils.book_new();
    
    // Get all formulations data
    const allFormulationsData = formulations
      .filter(f => f.id <= 12) // Only actual formulations, not pricing pages
      .map(f => {
        const formData = getFormulationBySlug(f.slug);
        return formData ? { ...f, ...formData } : null;
      })
      .filter(Boolean);

    allFormulationsData.forEach(formulation => {
      // Calculate costs from ingredients
      const totalCost = formulation.ingredients?.reduce((sum, ing) => sum + parseFloat(ing.amount.toFixed(2)), 0) || 0;
      const baseYield = formulation.baseYield || 10;
      const costPerLiter = totalCost / baseYield;
      const costPer500ML = (costPerLiter * 0.5);
      const costPer1L = costPerLiter;
      
      const bottle500MLCost = formulation.costPer500MLBottle || 10.55;
      const bottle1LCost = formulation.costPer1LBottle || 0;
      
      const totalCostPer500MLBottle = costPer500ML + bottle500MLCost;
      const totalCostPer1LBottle = costPer1L + bottle1LCost;
      
      const worksheetData = [
        ['SPARKLE & SHINE'],
        ['FLAT NO - 202, RK RESIDENCY, HARITHA ROYAL CITY COLONY, RAVALKOLE, MEDCHAL - 501401'],
        [''],
        [formulation.name],
        [''],
        ['SL.NO', 'PARTICULARS', 'UOM', 'QTY', 'RATE', 'AMOUNT'],
        ...(formulation.ingredients?.map(ing => [
          ing.slNo,
          ing.particulars,
          ing.uom,
          parseFloat(ing.qty.toFixed(2)),
          parseFloat(ing.rate.toFixed(2)),
          parseFloat(ing.amount.toFixed(2))
        ]) || []),
        // Add empty rows to reach 10 total
        ...Array(Math.max(0, 10 - (formulation.ingredients?.length || 0))).fill(['', '', '', '', '', 0]),
        [''],
        ['Cost / Per 500 ML Bottle', `Rs ${totalCostPer500MLBottle.toFixed(2)}`, bottle500MLCost.toFixed(2), totalCost.toFixed(2)],
        ['Cost / Per 1 Ltr Bottle', `Rs ${totalCostPer1LBottle.toFixed(2)}`, 'Cost / Ltr', costPerLiter.toFixed(2)],
        [''],
        ['METHOD OF PREPARATION'],
        ...(formulation.methodOfPreparation?.map((step, i) => [`${i + 1}`, step]) || [])
      ];
      
      const worksheet = XLSX.utils.aoa_to_sheet(worksheetData);
      XLSX.utils.book_append_sheet(workbook, worksheet, formulation.name.substring(0, 30));
    });
    
    XLSX.writeFile(workbook, 'Formulations.xlsx');
  };

  const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: 'array' });
        
        // Process imported data here
        console.log('Imported workbook:', workbook);
        // You can implement the import logic based on your requirements
        
      } catch (error) {
        console.error('Error importing file:', error);
      }
    };
    reader.readAsArrayBuffer(file);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <Header />
      
      <main className="py-12 px-6">
        <div className="max-w-7xl mx-auto">
          {/* Hero Section */}
          <div className="text-center mb-12">
            <div className="flex justify-between items-center mb-8">
              <div></div>
              <div className="text-center">
                <h2 className="text-4xl font-bold text-slate-800 mb-4">
                  Professional Cleaning Formulations
                </h2>
                <p className="text-xl text-slate-600 max-w-3xl mx-auto">
                  Comprehensive cleaning formulation management system with detailed 
                  recipes, cost analysis, and manufacturing instructions
                </p>
              </div>
              <div className="flex gap-2">
                <input
                  type="file"
                  accept=".xlsx,.xls,.csv"
                  onChange={handleImport}
                  className="hidden"
                  id="import-file"
                />
                <label htmlFor="import-file">
                  <Button variant="outline" className="cursor-pointer" asChild>
                    <div>
                      <Upload className="h-4 w-4 mr-2" />
                      Import
                    </div>
                  </Button>
                </label>
                <Button variant="outline" onClick={exportToPDF}>
                  <FileText className="h-4 w-4 mr-2" />
                  Export PDF
                </Button>
                <Button variant="outline" onClick={exportToExcel}>
                  <FileSpreadsheet className="h-4 w-4 mr-2" />
                  Export Excel
                </Button>
              </div>
            </div>
          </div>

          {/* Dashboard Grid - Changed from 5x3 to 3x5 */}
          <div id="formulations" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
            {formulations.map((formulation) => {
              const IconComponent = formulation.icon;
              return (
                <Card 
                  key={formulation.id} 
                  className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-2 cursor-pointer border-2 hover:border-blue-300"
                  onClick={() => handleFormulationClick(formulation)}
                >
                  <CardContent className="p-6 text-center">
                    <div className={`${formulation.color} w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300`}>
                      <IconComponent className="h-8 w-8 text-white" />
                    </div>
                    <h3 className="font-semibold text-slate-800 mb-2 group-hover:text-blue-600 transition-colors">
                      {formulation.name}
                    </h3>
                    <p className="text-sm text-slate-500 group-hover:text-slate-600 transition-colors">
                      {formulation.description}
                    </p>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="mt-4 w-full group-hover:bg-blue-50 group-hover:border-blue-300 transition-colors"
                    >
                      {formulation.id > 12 ? 'View Pricing' : 'View Formulation'}
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Stats Section */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="text-center p-6 bg-white/70 backdrop-blur-sm">
              <h3 className="text-3xl font-bold text-blue-600 mb-2">12+</h3>
              <p className="text-slate-600">Product Formulations</p>
            </Card>
            <Card className="text-center p-6 bg-white/70 backdrop-blur-sm">
              <h3 className="text-3xl font-bold text-green-600 mb-2">15</h3>
              <p className="text-slate-600">Dashboard Categories</p>
            </Card>
            <Card className="text-center p-6 bg-white/70 backdrop-blur-sm">
              <h3 className="text-3xl font-bold text-purple-600 mb-2">99.9%</h3>
              <p className="text-slate-600">Efficacy Rate</p>
            </Card>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Formulations;