import AsyncNedb from 'nedb-async';

export interface IMemberPayment {
  memberId: string;
  member_id: string;
  date: Date;
  paid: boolean;
  amount: number;
}

export interface IMemberPaymentDocument extends IMemberPayment {
  _id?: string;
  createdAt: Date;
}

export const initializeMemberPayment = (filename: string) =>
  new AsyncNedb<IMemberPaymentDocument>({ filename, autoload: true });
