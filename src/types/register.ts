import type { ValidRoles } from './roles';

export interface Register {
  email: string;
  password: string;
  name?: string;
  roles?: ValidRoles[];
}

// export interface RegisterRequest {
//   email: string;
//   password: string;
//   name?: string;
//   roles?: ValidRoles[];
// }