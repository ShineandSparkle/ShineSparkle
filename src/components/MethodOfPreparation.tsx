
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText } from "lucide-react";

interface MethodOfPreparationProps {
  steps: string[];
}

const MethodOfPreparation = ({ steps }: MethodOfPreparationProps) => {
  return (
    <Card className="mt-8">
      <CardHeader>
        <CardTitle className="flex items-center">
          <FileText className="h-5 w-5 mr-2" />
          METHOD OF PREPARATION
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-6">
          {[0, 1].map((col) => (
            <ol key={col} className="space-y-3">
              {steps
                .filter((_, i) => i % 2 === col)
                .map((step, index) => (
                  <li key={index} className="flex items-start">
                    <span className="flex-shrink-0 w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-semibold mr-4 mt-0.5">
                      {col + 1 + index * 2}
                    </span>
                    <span className="text-slate-700 leading-relaxed">{step}</span>
                  </li>
                ))}
            </ol>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default MethodOfPreparation;
