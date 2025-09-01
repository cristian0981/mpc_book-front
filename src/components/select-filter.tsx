import { useSearchParams, useNavigate, useLocation } from "react-router-dom";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";

interface Option {
  value: string;
  label: string;
}

interface Props {
  filterKey: string;
  options: Option[];
  placeholder?: string;
  defaultLabel?: string;
  label?: string;
  className?: string;
}

export const SelectFilter = ({ 
  filterKey, 
  options, 
  placeholder = "Seleccionar...",
  defaultLabel = "Todos",
  label,
  className
}: Props) => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const location = useLocation();

  const handleValueChange = (value: string) => {
    const params = new URLSearchParams(searchParams);
    
    // Si el valor es "all" o vacío, eliminar el filtro
    if (value === "all" || !value) {
      params.delete(filterKey);
    } else {
      params.set(filterKey, value);
    }
    
    // Reset página cuando cambian filtros
    if (filterKey !== 'page') {
      params.delete('page');
    }
    
    navigate(`${location.pathname}?${params.toString()}`);
  };

  const currentValue = searchParams.get(filterKey) || "all";

  return (
    <div className={`space-y-2  ${className || ''}`}>
      {label && <Label htmlFor={filterKey}>{label}</Label>}
      <Select   value={currentValue} onValueChange={handleValueChange}>
        <SelectTrigger id={filterKey} className="w-full !h-10 bg-white pl-8 border rounded-md p-2 border-primary/45">
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">{defaultLabel}</SelectItem>
          {options.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};