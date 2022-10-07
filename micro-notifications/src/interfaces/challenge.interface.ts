import { Document } from 'mongoose';
import { ChallengeStatus } from './challenge-status.enum';

export interface Challenge extends Document {
  dateHourChallenge: Date;
  status: ChallengeStatus;
  dateHourRequest: Date;
  dateHourResponse?: Date;
  solicitator: string;
  category: string;
  players: string[];
  match?: string;
}
