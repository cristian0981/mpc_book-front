// ApiProvider.tsx
import { type ReactNode, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "@/api/axios";
import { useAuth } from "@/contexts/auth-context";
import { toast } from "sonner";

type Props = {
  children: ReactNode;
};

export const ApiProvider = ({ children }: Props) => {
  const navigate = useNavigate();
  const { logout } = useAuth();

  useEffect(() => {
    const interceptor = api.interceptors.response.use(
      (response: any) => {
        const { status, config } = response;
        const method = config.method?.toUpperCase();
      
        if (method && ['POST', 'PUT', 'PATCH', 'DELETE'].includes(method)) {
          switch (status) {
            case 200:
              if (method === 'PUT' || method === 'PATCH') {
                toast.success('Registro actualizado exitosamente');
              } else if (method === 'DELETE') {
                toast.success('Registro eliminado exitosamente');
              }
              break;
            case 201:
              toast.success('Registro creado exitosamente');
              break;
            case 204:
              if (method === 'DELETE') {
                toast.success('Registro eliminado exitosamente');
              }
              break;
          }
        }
        
        return response;
      },
      (error: { response: any; }) => {
        const { response } = error;
        console.log(response);
        
        switch (response?.status) {
          case 401:
            toast.error(response.data.error);
            logout('1');
            navigate("/login");
            localStorage.removeItem("auth_token");
            localStorage.removeItem("user_data");
            break;
          case 400:
            toast.error(response.data.error);
            break;
          default:  500
            toast.error(response.data.error);
            break;
        }

        return Promise.reject(error);
      }
    );

    return () => {
      api.interceptors.response.eject(interceptor);
    };
  }, [navigate, logout]);

  return <>{children}</>;
};
