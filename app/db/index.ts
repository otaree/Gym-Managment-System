import staff from './method/staff';
import member from './method/member';
import {
  IMember,
  IMemberDocument,
  IWorkoutPlan,
  IPlanWorkout,
  IDiet,
  IMonthlyPayment,
  IMemberProduct,
} from './model/member';
import { IPrepaid, IPrepaidDocument } from './model/prepaid';
// eslint-disable-next-line import/no-cycle
import prepaid from './method/prepaid';
import { IProduct, IProductDocument } from './model/product';
import product, { IProductQuery } from './method/product';
import { ISaleProduct, ISale, ISaleDocument } from './model/sale';
import sale, { ISaleQuery } from './method/sale';

export {
  IMember,
  IMemberDocument,
  IWorkoutPlan,
  IPlanWorkout,
  IDiet,
  IMonthlyPayment,
  IMemberProduct,
  IPrepaid,
  IPrepaidDocument,
  IProduct,
  IProductDocument,
  IProductQuery,
  ISaleProduct,
  ISale,
  ISaleDocument,
  ISaleQuery,
};

export default (appPath: string) => {
  return {
    staff: staff(appPath),
    member: member(appPath),
    prepaid: prepaid(appPath),
    product: product(appPath),
    sale: sale(appPath),
  };
};
