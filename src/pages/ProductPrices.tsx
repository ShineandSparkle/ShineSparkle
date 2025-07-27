
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";
import { getProductPrices } from "@/data/formulations";
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

const ProductPrices = () => {
  const navigate = useNavigate();
  const productPrices = getProductPrices();

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
              <h1 className="text-3xl font-bold text-slate-800">Product Prices</h1>
            </div>
          </div>

          {/* Product Prices Table */}
          <Card>
            <CardHeader>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow className="bg-blue-100">
                    <TableHead className="text-center font-bold border">SL NO</TableHead>
                    <TableHead className="text-center font-bold border">PRODUCT</TableHead>
                    <TableHead className="text-center font-bold border">UOM</TableHead>
                    <TableHead className="text-center font-bold border bg-blue-200">RETAIL PRICE</TableHead>
                    <TableHead className="text-center font-bold border bg-green-100">5 Ltr Price Bulk</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {productPrices.map((product) => (
                    <TableRow key={product.id}>
                      <TableCell className="text-center border font-medium">{product.id}</TableCell>
                      <TableCell className="border font-medium">{product.product}</TableCell>
                      <TableCell className="text-center border">{product.uom}</TableCell>
                      <TableCell className="text-center border bg-blue-50 font-semibold">{product.retailPrice}</TableCell>
                      <TableCell className="text-center border bg-green-50 font-semibold">{product.bulkPrice5Ltr}</TableCell>
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

export default ProductPrices;
