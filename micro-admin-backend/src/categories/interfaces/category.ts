import { Document } from 'mongoose';

export interface Category extends Document {
  readonly category: string;
  description: string;
  events: Array<CatEvent>;
}

interface CatEvent {
  name: string;
  operation: string;
  value: number;
}
