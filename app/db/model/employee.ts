import AsyncNedb from 'nedb-async';

export interface IEmployee {
  img: string;
  firstName: string;
  lastName: string;
  dob: Date;
  address: string;
  mobile: string;
}

export interface IEmployeeDocument extends IEmployee {
  _id?: string;
  createdAt: Date;
  leavingDate?: Date;
}

export const initializeEmployee = (filename: string) =>
  new AsyncNedb<IEmployeeDocument>({ filename, autoload: true });
