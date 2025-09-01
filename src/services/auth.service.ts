import api from "@/api/axios";
import type { Login } from "@/types/login";
import type { Register } from "@/types/register";
import type { AuthResponse } from "@/types/response-auth";

export const LoginRequest = async (login: Login): Promise<AuthResponse> => {
  const response = await api.post<AuthResponse>("/auth/login", login);
  return response.data;
};

export const RegisterRequest = async (register: Register): Promise<AuthResponse> => {
  const response = await api.post<AuthResponse>("/auth/register", register);
  return response.data;
};

export const LogoutRequest = async (userId: string): Promise<{ message: string }> => {
  const response = await api.post<{ message: string }>("/auth/logout", { userId });
  return response.data;
};

