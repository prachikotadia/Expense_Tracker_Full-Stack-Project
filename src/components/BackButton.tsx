
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

interface BackButtonProps {
  to?: string;
  className?: string;
  label?: string;
}

const BackButton = ({ to = "/dashboard", className = "", label = "Back" }: BackButtonProps) => {
  const navigate = useNavigate();

  return (
    <Button
      variant="ghost"
      className={`flex items-center space-x-1 hover:bg-primary/10 hover:text-primary transition-all duration-300 rounded-full px-2 py-1 h-auto ${className}`}
      onClick={() => (to ? navigate(to) : navigate(-1))}
    >
      <ArrowLeft className="h-4 w-4 mr-1" />
      <span className="text-sm font-medium">{label}</span>
    </Button>
  );
};

export default BackButton;
