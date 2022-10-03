export interface Category {
  readonly _id: string;
  readonly category: string;
  description: string;
  events: Array<CatEvent>;
}

export interface CatEvent {
  name: string;
  operation: string;
  value: number;
}
