import AsyncNedb from 'nedb-async';

export interface IEmployee {
  img: string;
  firstName: string;
  lastName: string;
  dob: Date;
  sex: string;
  address: string;
  mobile: string;
}

export interface IEmployeeDocument extends IEmployee {
  _id?: string;
  isEmployed: boolean;
  createdAt: Date;
  leavingDate?: Date;
}

export const initializeEmployee = (filename: string) =>
  new AsyncNedb<IEmployeeDocument>({ filename, autoload: true });
