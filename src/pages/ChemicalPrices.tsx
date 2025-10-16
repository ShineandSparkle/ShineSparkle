
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const ChemicalPrices = () => {
  const navigate = useNavigate();

const chemicalPrices = [
  { id: 1, chemical: "Acid Slurry", rate: 180, uom: "KG" },
  { id: 2, chemical: "Acid Thickener", rate: 400, uom: "KG" },
  { id: 3, chemical: "Alphox 200", rate: 240, uom: "LTR" },
  { id: 4, chemical: "AOS (Alpha Olefin Sulphonate)", rate: 250, uom: "KG" },
  { id: 5, chemical: "Balm Pack", rate: 880, uom: "NOS" },
  { id: 6, chemical: "BKC (Benzalkonium Chloride)", rate: 150, uom: "LTR" },
  { id: 7, chemical: "Caustic Soda", rate: 80, uom: "KG" },
  { id: 8, chemical: "Citric Acid", rate: 150, uom: "KG" },
  { id: 9, chemical: "Colour", rate: 400, uom: "LTR" },
  { id: 10, chemical: "Crystals", rate: 80, uom: "KG" },
  { id: 11, chemical: "Glycerin", rate: 200, uom: "LTR" },
  { id: 12, chemical: "Handwash Base - Pearl", rate: 200, uom: "KG" },
  { id: 13, chemical: "Hydrochloric Acid", rate: 20, uom: "LTR" },
  { id: 14, chemical: "Jasmine Perfume", rate: 1000, uom: "LTR" },
  { id: 15, chemical: "Perfume", rate: 1000, uom: "LTR" },
  { id: 16, chemical: "Phenyl Concentrate", rate: 180, uom: "LTR" },
  { id: 17, chemical: "Robin Blue", rate: 400, uom: "KG" },
  { id: 18, chemical: "RO Water", rate: 0.5, uom: "LTR" },
  { id: 19, chemical: "Rose Extract", rate: 1000, uom: "LTR" },
  { id: 20, chemical: "Salt", rate: 30, uom: "KG" },
  { id: 21, chemical: "SLES (Sodium Lauryl Ether Sulfate)", rate: 100, uom: "KG" },
  { id: 22, chemical: "Slurry", rate: 180, uom: "KG" },
  { id: 23, chemical: "Soda Ash (Sodium Carbonate)", rate: 60, uom: "KG" },
  { id: 24, chemical: "Sodium Benzoate", rate: 280, uom: "KG" },
  { id: 25, chemical: "SS (Sodium Sulphate) - Global Salt", rate: 35, uom: "KG" },
  { id: 26, chemical: "Tinopal", rate: 220, uom: "KG" },
  { id: 27, chemical: "TSP (Trisodium Phosphate)", rate: 30, uom: "KG" },
  { id: 28, chemical: "White Petroleum Jelly Base", rate: 320, uom: "KG" }
];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <Header />
      
      <main className="py-8 px-6">
        <div className="max-w-6xl mx-auto">
          {/* Header Section */}
          <div className="flex items-center justify-between mb-8">
            <Button 
              variant="outline" 
              onClick={() => navigate('/')}
              className="flex items-center"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Button>
            
            <div className="text-center flex-1">
              <h1 className="text-3xl font-bold text-slate-800">Chemical Prices</h1>
            </div>
          </div>

          {/* Chemical Prices Table */}
          <Card>
            <CardHeader>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow className="bg-lime-100">
                    <TableHead className="text-center font-bold border">SL NO</TableHead>
                    <TableHead className="text-center font-bold border">CHEMICAL NAME</TableHead>
                    <TableHead className="text-center font-bold border">UOM</TableHead>
                    <TableHead className="text-center font-bold border bg-yellow-200">RATE (₹)</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {chemicalPrices.map((chemical) => (
                    <TableRow key={chemical.id}>
                      <TableCell className="text-center border font-medium">{chemical.id}</TableCell>
                      <TableCell className="border font-medium">{chemical.chemical}</TableCell>
                      <TableCell className="text-center border">{chemical.uom}</TableCell>
                      <TableCell className="text-center border bg-yellow-50 font-semibold">₹ {chemical.rate}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default ChemicalPrices;
