
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Ingredient } from "@/data/types";

interface FormulationTableProps {
  name: string;
  ingredients: Ingredient[];
}

const FormulationTable = ({ name, ingredients }: FormulationTableProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-center text-lg sm:text-xl lg:text-2xl font-bold">
          {name.toUpperCase()}
        </CardTitle>
      </CardHeader>
      <CardContent className="p-2 sm:p-6">
        <div className="overflow-x-auto -mx-2 sm:mx-0">
          <Table className="min-w-full">
            <TableHeader>
              <TableRow className="bg-slate-100">
                <TableHead className="text-center font-bold border text-xs sm:text-sm whitespace-nowrap">SL.NO</TableHead>
                <TableHead className="text-center font-bold border text-xs sm:text-sm">PARTICULARS</TableHead>
                <TableHead className="text-center font-bold border text-xs sm:text-sm whitespace-nowrap">UOM</TableHead>
                <TableHead className="text-center font-bold border text-xs sm:text-sm whitespace-nowrap">QTY</TableHead>
                <TableHead className="text-center font-bold border text-xs sm:text-sm whitespace-nowrap">RATE</TableHead>
                <TableHead className="text-center font-bold border text-xs sm:text-sm whitespace-nowrap">AMOUNT</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {ingredients.map((ingredient) => (
                <TableRow key={ingredient.slNo}>
                  <TableCell className="text-center border font-medium text-xs sm:text-sm">{ingredient.slNo}</TableCell>
                  <TableCell className="border font-medium text-xs sm:text-sm">{ingredient.particulars}</TableCell>
                  <TableCell className="text-center border text-xs sm:text-sm">{ingredient.uom}</TableCell>
                  <TableCell className="text-center border text-xs sm:text-sm">{ingredient.qty}</TableCell>
                  <TableCell className="text-center border text-xs sm:text-sm">{ingredient.rate}</TableCell>
                  <TableCell className="text-center border text-xs sm:text-sm">{ingredient.amount.toFixed(2)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};

export default FormulationTable;
