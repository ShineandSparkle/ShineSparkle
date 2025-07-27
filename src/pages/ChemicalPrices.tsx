
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
  { id: 1, chemical: "Acid (Hydrochloric acid)", rate: 16, uom: "KG" },
  { id: 2, chemical: "Acid Slurry", rate: 180, uom: "KG" },
  { id: 3, chemical: "Alphox 200", rate: 240, uom: "LTR" },
  { id: 4, chemical: "AOS (Alpha Olefin Sulphonate)", rate: 100, uom: "KG" },
  { id: 5, chemical: "BKC (Benzalkonium Chloride)", rate: 180, uom: "KG" },
  { id: 6, chemical: "CAPB (Cocamidopropyl Betaine)", rate: 120, uom: "KG" },
  { id: 7, chemical: "Caustic Soda", rate: 80, uom: "KG" },
  { id: 8, chemical: "Citric Acid", rate: 150, uom: "KG" },
  { id: 9, chemical: "Colour", rate: 100, uom: "LTR" },
  { id: 10, chemical: "Cutting Oil", rate: 170, uom: "LTR" },
  { id: 11, chemical: "Glycerine", rate: 200, uom: "KG" },
  { id: 12, chemical: "Hand Wash Base", rate: 120, uom: "KG" },
  { id: 13, chemical: "IPA (Isopropyl Alcohol)", rate: 200, uom: "LTR" },
  { id: 14, chemical: "Perfume - Jasmine - Phenyl", rate: 500, uom: "LTR" },
  { id: 15, chemical: "Phenyl Compound", rate: 170, uom: "KG" },
  { id: 16, chemical: "Pine Oil", rate: 210, uom: "LTR" },
  { id: 17, chemical: "SLES (Sodium Lauryl Ether Sulfate)", rate: 100, uom: "KG" },
  { id: 18, chemical: "Soap Oil", rate: 40, uom: "LTR" },
  { id: 19, chemical: "Soda Ash (Sodium carbonate)", rate: 60, uom: "KG" },
  { id: 20, chemical: "SS (Sodium Sulphate) - Global Salt", rate: 30, uom: "KG" },
  { id: 21, chemical: "TRO (Turkey Red Oil)", rate: 180, uom: "LTR" },
  { id: 22, chemical: "TSP (Trisodium Phosphate)", rate: 30, uom: "KG" },
  { id: 23, chemical: "Urea", rate: 60, uom: "KG" }
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
