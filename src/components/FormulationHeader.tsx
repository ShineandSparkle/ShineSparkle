
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

interface FormulationHeaderProps {
  name: string;
  description: string;
}

const FormulationHeader = ({ name, description }: FormulationHeaderProps) => {
  const navigate = useNavigate();

  return (
    <div className="flex items-center justify-between mb-8">
      <Button 
        variant="outline" 
        onClick={() => navigate('/')}
        className="flex items-center"
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back to Dashboard
      </Button>
      
      <div className="text-center">
        <h2 className="text-4xl font-bold text-slate-800 mb-2">{name}</h2>
        <p className="text-slate-600">{description}</p>
      </div>
      
      <div></div>
    </div>
  );
};

export default FormulationHeader;
