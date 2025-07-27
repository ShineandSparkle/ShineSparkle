
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";
import { getPackingMaterials } from "@/data/formulations";
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

const PackingMaterials = () => {
  const navigate = useNavigate();
  const packingMaterials = getPackingMaterials();

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
              <h1 className="text-3xl font-bold text-slate-800">Packing Bottles Prices</h1>
            </div>
          </div>

          {/* Packing Materials Table */}
          <Card>
            <CardHeader>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow className="bg-purple-100">
                    <TableHead className="text-center font-bold border">SL NO</TableHead>
                    <TableHead className="text-center font-bold border">PRODUCT</TableHead>
                    <TableHead className="text-center font-bold border bg-blue-200">Minimum Order</TableHead>
                    <TableHead className="text-center font-bold border bg-green-200">RETAIL PRICE</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {packingMaterials.map((material) => (
                    <TableRow key={material.id}>
                      <TableCell className="text-center border font-medium">{material.id}</TableCell>
                      <TableCell className="border font-medium">{material.product}</TableCell>
                      <TableCell className="text-center border bg-blue-50 font-semibold">{material.minimumOrder}</TableCell>
                      <TableCell className="text-center border bg-green-50 font-semibold">{material.retailPrice}</TableCell>
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

export default PackingMaterials;
