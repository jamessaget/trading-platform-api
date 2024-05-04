import {z} from 'zod';
import {UserTypeEnum} from '../enums/user-type-enum';

export const createUserHttpSchema = z.object({
  name: z.string(),
  email: z.string(),
  password: z.string().max(255),
  user_type: z.array(z.enum([UserTypeEnum.BUYER, UserTypeEnum.SELLER]))
});