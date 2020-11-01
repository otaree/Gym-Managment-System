import path from 'path';

import { IMember, IMemberDocument, initializeMember } from '../model/member';
import config from '../../constants/config.json';

export default function methods(filepath: string) {
  const db = initializeMember(path.join(filepath, 'member.db'));

  function pad(number: number, length: number) {
    let str = String(number);
    while (str.length < length) {
      str = `0${str}`;
    }

    return str;
  }

  const generateMemberId = (): Promise<string> =>
    new Promise((resolve, reject) => {
      const year = String(new Date().getFullYear());
      const name = `GV${year.substring(year.length - 2)}`;
      db.find({ memberId: { $regex: new RegExp(name) } })
        .limit(1)
        .sort({ createdAt: -1 })
        .exec((err, [member]) => {
          if (err) reject(err);
          if (member) {
            const { memberId } = member;
            const seq = Number(memberId.substring(memberId.length - 6));
            resolve(`${name}${pad(seq + 1, 6)}`);
          } else {
            resolve(`${name}${pad(1, 6)}`);
          }
        });
    });

  const getMember = async (id: string) => {
    const member = await db.asyncFindOne({ _id: id });
    return member;
  };

  interface IQuery {
    isMember?: boolean;
    memberId?: string;
    $or?: [{ firstName: { $regex: RegExp } }, { lastName: { $regex: RegExp } }];
    firstName?: { $regex: RegExp };
    lastName?: { $regex: RegExp };
    monthlyPayments?: { $elemMatch: { paid: boolean } };
  }
  const getMembers = ({
    limit = 10,
    skip = 0,
    sort = '-createdAt',
    isMember,
    paymentDue,
    search,
  }: {
    limit?: number;
    skip?: number;
    isMember?: boolean;
    sort?: string;
    search?: string;
    paymentDue?: boolean;
  }): Promise<{ members: IMemberDocument[]; totalCount: number }> =>
    new Promise((resolve, reject) => {
      const parsedSort = sort
        .split(',')
        .map((el) => (el.startsWith('-') ? [el.substring(1), -1] : [el, 1]))
        .reduce((acc, curr) => ({ ...acc, [curr[0]]: curr[1] }), {});
      const query: IQuery = {};
      if (search) {
        if (search.startsWith(config.gymAB)) {
          query.memberId = search.trim().toUpperCase();
        } else {
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
      }

      if (typeof isMember === 'boolean') {
        query.isMember = isMember;
      }

      if (typeof paymentDue === 'boolean') {
        query.monthlyPayments = {
          $elemMatch: { paid: paymentDue },
        };
      }

      db.find(query)
        .skip(skip * limit)
        .limit(limit)
        .sort(parsedSort)
        .exec(async (err, members) => {
          if (err) return reject(err);
          const totalCount = await db.asyncCount(query);
          return resolve({
            members,
            totalCount: totalCount as number,
          });
        });
    });

  const getMembersCount = async (): Promise<number> => {
    const count = await db.asyncCount({});
    return count as number;
  };

  const createMember = async (data: IMember) => {
    const memberId = await generateMemberId();
    const isIdPresent = await db.asyncFindOne({ memberId });
    if (isIdPresent) throw new Error('Member Id already present');
    const member = await db.asyncInsert({
      ...data,
      workoutPlane: {},
      dietPlan: {},
      monthlyPayments: [],
      products: [],
      isMember: true,
      memberId,
      createdAt: new Date(),
    });
    return member;
  };

  const updateMember = async (id: string, data: unknown) => {
    await db.asyncUpdate({ _id: id }, { $set: data });
    const member = await getMember(id);
    return member;
  };

  const deleteMember = async (id: string) => {
    const member = await db.asyncRemove({ _id: id });
    return member;
  };

  return {
    getMember,
    getMembers,
    getMembersCount,
    createMember,
    updateMember,
    deleteMember,
  };
}
