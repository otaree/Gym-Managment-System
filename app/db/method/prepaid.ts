import path from 'path';

import {
  initializePrepaid,
  IPrepaid,
  IPrepaidDocument,
} from '../model/prepaid';
// eslint-disable-next-line import/no-cycle
import { IPrepaidQuery } from '../../main.dev';

export default function methods(filepath: string) {
  const db = initializePrepaid(path.join(filepath, 'prepaid.db'));

  const getPrepaid = async (id: string) => {
    const prepaid = await db.asyncFindOne({ _id: id });
    return prepaid;
  };

  interface IQuery {
    $or?: [{ firstName: { $regex: RegExp } }, { lastName: { $regex: RegExp } }];
    firstName?: { $regex: RegExp };
    lastName?: { $regex: RegExp };
  }
  const getAllPrepaid = ({
    limit = 10,
    skip = 0,
    sort = '-createdAt',
    search,
  }: IPrepaidQuery): Promise<{
    allPrepaid: IPrepaidDocument[];
    totalCount: number;
  }> =>
    new Promise((resolve, reject) => {
      const parsedSort = sort
        .split(',')
        .map((el) => (el.startsWith('-') ? [el.substring(1), -1] : [el, 1]))
        .reduce((acc, curr) => ({ ...acc, [curr[0]]: curr[1] }), {});
      const query: IQuery = {};
      if (search) {
        const [firstName, lastName] = search.trim().split(' ');
        if (!lastName) {
          query.$or = [
            { firstName: { $regex: new RegExp(firstName, 'i') } },
            { lastName: { $regex: new RegExp(firstName, 'i') } },
          ];
        } else {
          query.firstName = { $regex: new RegExp(firstName, 'i') };
          query.lastName = { $regex: new RegExp(lastName, 'i') };
        }
      }

      db.find(query)
        .skip(skip * limit)
        .limit(limit)
        .sort(parsedSort)
        .exec(async (err, allPrepaid) => {
          if (err) return reject(err);
          const totalCount = await db.asyncCount(query);
          return resolve({ allPrepaid, totalCount: totalCount as number });
        });
    });

  const createPrepaid = async (data: IPrepaid) => {
    const prepaid = await db.asyncInsert({ ...data, createdAt: new Date() });
    return prepaid;
  };

  const updatePrepaid = async (id: string, data: unknown) => {
    await db.asyncUpdate({ _id: id }, { $set: data });
    const prepaid = await getPrepaid(id);
    return prepaid;
  };

  const deletePrepaid = async (id: string) => {
    const prepaid = await db.asyncRemove({ _id: id });
    return prepaid;
  };

  return {
    getPrepaid,
    getAllPrepaid,
    createPrepaid,
    updatePrepaid,
    deletePrepaid,
  };
}
