import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/auth-context';

export const useApiErrorHandler = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();

  const handleApiError = (error: any) => {
    const { response } = error;
    
    if (response?.status === 401) {
      logout(); // Limpia el contexto de auth
      navigate('/', { replace: true });
    }
  };

  return { handleApiError };
};