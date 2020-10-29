import AsyncNedb from 'nedb-async';

export interface IStaffDocument {
  name: string;
  password: string;
}

export const initializeStaff = (filename: string) =>
  new AsyncNedb<IStaffDocument>({ filename, autoload: true });
