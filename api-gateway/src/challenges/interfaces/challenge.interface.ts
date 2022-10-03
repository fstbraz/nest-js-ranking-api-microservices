import { Player } from 'src/players/interfaces/player.interface';
import { ChallengeStatus } from './challenge-status.enum';
import { Match } from './match.interface';

export interface Challenge {
  dateHourChallenge: Date;
  status: ChallengeStatus;
  dateHourRequest: Date;
  dateHourResponse: Date;
  solicitator: Player;
  category: string;
  players: Array<Player>;
  match: Match;
}
