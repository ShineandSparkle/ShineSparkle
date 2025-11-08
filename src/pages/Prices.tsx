import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { formulationsData } from "@/data/formulations";

const Prices = () => {
  const [searchTerm, setSearchTerm] = useState("");

  // Filter formulations based on search term
  const filteredFormulations = formulationsData.filter(formulation =>
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
              View pricing for all our formulations
            </p>
          </div>

          <Card className="bg-white/80 backdrop-blur-sm">
            <CardHeader>
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <CardTitle className="text-2xl text-slate-800">Formulation Prices</CardTitle>
                <div className="relative w-full sm:w-64">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <Input
                    placeholder="Search formulations..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
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
                          {formulation.costPer500ML > 0 
                            ? formulation.costPer500ML.toFixed(2) 
                            : '-'}
                        </TableCell>
                        <TableCell className="text-right">
                          {formulation.costPer1L > 0 
                            ? formulation.costPer1L.toFixed(2) 
                            : '-'}
                        </TableCell>
                        <TableCell className="text-right">
                          {formulation.costPer5L > 0 
                            ? formulation.costPer5L.toFixed(2) 
                            : '-'}
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
