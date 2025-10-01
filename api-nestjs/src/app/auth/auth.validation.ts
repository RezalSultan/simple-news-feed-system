import { LoginRequest, RegisterRequest } from 'src/type-model/auth.model';
import { z, ZodType } from 'zod';

export class AuthValidation {
  static readonly LOGIN: ZodType<LoginRequest> = z.object({
    username: z.string().min(1),
    password: z.string().min(1),
  });

  static readonly REGISTER: ZodType<RegisterRequest> = z.object({
    username: z.string().min(1),
    password: z.string().min(6),
    confirm_password: z.string().min(6),
  });
}
