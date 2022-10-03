export interface RankingResponse {
  player?: string;
  position?: number;
  points?: number;
  matchHistory?: History;
}

export interface History {
  winnings?: number;
  defeats?: number;
}
