import path from 'path';

import { initializeSale, ISale, ISaleDocument } from '../model/sale';

export interface ISaleQuery {
  limit?: number;
  skip?: number;
  sort?: string;
  startDate?: Date;
  endDate?: Date;
}

export default function methods(filepath: string) {
  const db = initializeSale(path.join(filepath, 'sale.db'));

  const getSaleById = async (id: string): Promise<ISaleDocument> => {
    const sale = await db.asyncFindOne({ _id: id });
    return sale;
  };

  interface IQuery {
    createdAt?: {
      $gte: Date;
      $lte: Date;
    };
  }
  const getSales = ({
    limit = 10,
    skip = 0,
    sort = '-createdAt',
    startDate,
    endDate,
  }: ISaleQuery): Promise<{ sales: ISaleDocument[]; totalCount: number }> =>
    new Promise((resolve, reject) => {
      const parsedSort = sort
        .split(',')
        .map((el) => (el.startsWith('-') ? [el.substring(1), -1] : [el, 1]))
        .reduce((acc, curr) => ({ ...acc, [curr[0]]: curr[1] }), {});

      const query: IQuery = {};

      if (startDate && endDate) {
        const parsedStartDate = new Date(
          startDate.getFullYear(),
          startDate.getMonth(),
          startDate.getDate()
        );
        const parsedEndDate = new Date(
          endDate.getFullYear(),
          endDate.getMonth(),
          endDate.getDate(),
          23,
          59
        );
        query.createdAt = {
          $gte: parsedStartDate,
          $lte: parsedEndDate,
        };
      }

      db.find(query)
        .skip(skip * limit)
        .limit(limit)
        .sort(parsedSort)
        .exec(async (err, sales) => {
          if (err) return reject(err);
          const totalCount = await db.asyncCount(query);
          return resolve({ sales, totalCount: totalCount as number });
        });
    });

  const createSale = async (data: ISale): Promise<ISaleDocument> => {
    const sale = await db.asyncInsert({ ...data, createdAt: new Date() });
    return sale;
  };

  const updateSale = async (
    id: string,
    data: unknown
  ): Promise<ISaleDocument> => {
    await db.asyncUpdate({ id }, { $set: data });
    const sale = await getSaleById(id);
    return sale;
  };

  const deleteSale = async (id: string): Promise<ISaleDocument> => {
    const sale = await db.asyncRemove(id);
    return sale as ISaleDocument;
  };

  return {
    getSaleById,
    getSales,
    createSale,
    updateSale,
    deleteSale,
  };
}
