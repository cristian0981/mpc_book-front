import { useSearchParams, useNavigate, useLocation } from "react-router-dom";
import { useDebouncedCallback } from "use-debounce";
import { Search } from "lucide-react";
import { useState, useEffect } from "react";

interface Props {
  placeholder?: string;
  filterKey?: string; 
  debounceMs?: number;
}

export const FilterInput = ({ 
  placeholder = "Buscar...", 
  filterKey = "search",
  debounceMs = 500 
}: Props) => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const location = useLocation();
  
  // Estado local para controlar el valor del input
  const [inputValue, setInputValue] = useState(searchParams.get(filterKey) || "");
  
  // Sincronizar el estado local con los parámetros de la URL
  useEffect(() => {
    setInputValue(searchParams.get(filterKey) || "");
  }, [searchParams, filterKey]);

  const handleFilter = useDebouncedCallback((value: string) => {
    const params = new URLSearchParams(searchParams);
    if (value) {
      params.set(filterKey, value);
    } else {
      params.delete(filterKey);
    }
    
    if (filterKey !== 'page') {
      params.delete('page');
    }
    
    navigate(`${location.pathname}?${params.toString()}`);
  }, debounceMs);
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInputValue(value);
    handleFilter(value);
  };

  return (
    <div className="relative flex gap-6">
      <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
      <input
        placeholder={placeholder}
        value={inputValue}
        onChange={handleInputChange}
        className="pl-8 border rounded-md p-2 w-full bg-white h-10 border-primary/45"
      />
    </div>
  );
};
