import { User } from '../../users/entities/user.entity';

export interface Category {
  id: string;
  category: string;
  users: User[];
}
