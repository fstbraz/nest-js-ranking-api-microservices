import { ChallengeStatus } from './challenge-status.enum';

export interface Challenge {
  _id: string;
  dateHourChallenge: Date;
  status: ChallengeStatus;
  dateHourRequest: Date;
  dateHourResponse?: Date;
  solicitator: string;
  category: string;
  players: string[];
  match?: string;
}
