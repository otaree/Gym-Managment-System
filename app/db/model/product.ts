import AsyncNedb from 'nedb-async';

export interface IProduct {
  name: string;
  quantity: number;
  purchasePrice: number;
  sellingPrice: number;
}

export interface IProductDocument extends IProduct {
  createdAt: Date;
  _id?: string;
}

export const initializeProduct = (filename: string) =>
  new AsyncNedb<IProductDocument>({ filename, autoload: true });
