import type { ValidRoles } from "./roles";
import type { User } from "./user";


export interface AuthResponse {
  access_token: string;
  refresh_token: string;
  user:User
}