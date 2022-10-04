import { Document } from 'mongoose';

export interface Match extends Document {
  category: string;
  challenge: string;
  players: string[];
  def: string;
  result: Array<Resultado>;
}

export interface Resultado {
  set: string;
}
