
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
        <CardTitle className="text-center text-2xl font-bold">
          {name.toUpperCase()}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow className="bg-slate-100">
              <TableHead className="text-center font-bold border">SL.NO</TableHead>
              <TableHead className="text-center font-bold border">PARTICULARS</TableHead>
              <TableHead className="text-center font-bold border">UOM</TableHead>
              <TableHead className="text-center font-bold border">QTY</TableHead>
              <TableHead className="text-center font-bold border">RATE</TableHead>
              <TableHead className="text-center font-bold border">AMOUNT</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {ingredients.map((ingredient) => (
              <TableRow key={ingredient.slNo}>
                <TableCell className="text-center border font-medium">{ingredient.slNo}</TableCell>
                <TableCell className="border font-medium">{ingredient.particulars}</TableCell>
                <TableCell className="text-center border">{ingredient.uom}</TableCell>
                <TableCell className="text-center border">{ingredient.qty}</TableCell>
                <TableCell className="text-center border">{ingredient.rate}</TableCell>
                <TableCell className="text-center border">{ingredient.amount.toFixed(2)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default FormulationTable;
