import path from 'path';

import {
  initializeMemberPayment,
  IMemberPayment,
  IMemberPaymentDocument,
} from '../model/memberPayment';

export interface IMemberPaymentQuery {
  limit?: number;
  skip?: number;
  sort?: string;
  startDate?: Date;
  endDate?: Date;
  memberId?: string;
  member_id?: string;
}

export default function methods(filepath: string) {
  const db = initializeMemberPayment(path.join(filepath, 'member_payment.db'));

  const getMemberPaymentById = async (id: string) => {
    const memberPayment = await db.asyncFindOne({ _id: id });
    return memberPayment;
  };

  interface IQuery {
    createdAt?: {
      $gte: Date;
      $lte: Date;
    };
    memberId?: string;
    member_id?: string;
  }
  const getMemberPayments = ({
    limit = 10,
    skip = 0,
    sort = '-createdAt',
    startDate,
    endDate,
    memberId,
    member_id,
  }: IMemberPaymentQuery): Promise<{
    memberPayments: IMemberPaymentDocument[];
    totalCount: number;
  }> =>
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

      if (memberId) {
        query.memberId = memberId;
      }

      if (member_id) {
        query.member_id = member_id;
      }

      db.find(query)
        .skip(skip * limit)
        .limit(limit)
        .sort(parsedSort)
        .exec(async (err, memberPayments) => {
          if (err) return reject(err);
          const totalCount = await db.asyncCount(query);
          return resolve({ memberPayments, totalCount: totalCount as number });
        });
    });

  const createMemberPayment = async (data: IMemberPayment) => {
    const memberPayment = await db.asyncInsert({
      ...data,
      createdAt: new Date(),
    });
    return memberPayment;
  };

  const updateMemberPayment = async (id: string, data: unknown) => {
    await db.asyncUpdate({ _id: id }, { $set: data });
    const memberPayment = await getMemberPaymentById(id);
    return memberPayment;
  };

  const deleteMemberPayment = async (id: string) => {
    const memberPayment = await db.asyncRemove({ _id: id });
    return memberPayment;
  };

  return {
    getMemberPaymentById,
    getMemberPayments,
    createMemberPayment,
    updateMemberPayment,
    deleteMemberPayment,
  };
}
