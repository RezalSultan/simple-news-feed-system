import { LoginRequest, RegisterRequest } from 'src/type-model/auth.model';
import { PostRequest } from 'src/type-model/post.model';
import { z, ZodType } from 'zod';

export class PostValidation {
  static readonly ADD_POST: ZodType<PostRequest> = z.object({
    content: z.string().min(1),
  });
}
