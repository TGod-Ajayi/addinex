export interface IEvent {
  name: string;
  dateCreated: Date | string;
  error?: boolean;
}

export interface IInterval {
  interval: number;
}
