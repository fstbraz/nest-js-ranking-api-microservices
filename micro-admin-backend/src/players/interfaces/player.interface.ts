import { Document } from 'mongoose';
import { Category } from './../../categories/interfaces/category';

export interface Player extends Document {
  readonly phoneNumber: string;
  readonly email: string;
  category: Category;
  name: string;
  ranking: string;
  rankingPosition: number;
  playerPhotoUrl: string;
}
