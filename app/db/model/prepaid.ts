import AsyncNedb from 'nedb-async';

export interface IPrepaid {
  firstName: string;
  lastName: string;
  phone: string;
  amount: number;
  paid: boolean;
  startAt: Date;
  endAt: Date;
}

export interface IPrepaidDocument extends IPrepaid {
  createdAt: Date;
  _id?: string;
}

export const initializePrepaid = (filename: string) =>
  new AsyncNedb<IPrepaidDocument>({ filename, autoload: true });
