import AsyncNedb from 'nedb-async';

export interface ISaleProduct {
  name: string;
  purchasePrice: number;
  sellingPrice: number;
  quantity: number;
}

export interface ISale {
  products: ISaleProduct[];
  buyer: {
    name: string;
    isMember: boolean;
    memberId?: string;
  };
  totalSellingPrice: number;
  totalPurchasePrice: number;
}

export interface ISaleDocument extends ISale {
  createdAt: Date;
  _id?: string;
}

export const initializeSale = (filename: string) =>
  new AsyncNedb<ISaleDocument>({ filename, autoload: true });
