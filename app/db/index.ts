import staff from './method/staff';
import member from './method/member';
import {
  IMember,
  IMemberDocument,
  IWorkoutPlan,
  IPlanWorkout,
  IDiet,
  IDietPlan,
  IMonthlyPayment,
  IMemberProduct,
  DayOfWeek,
  TypeOfMeal,
} from './model/member';
import { IPrepaid, IPrepaidDocument } from './model/prepaid';
// eslint-disable-next-line import/no-cycle
import prepaid from './method/prepaid';
import { IProduct, IProductDocument } from './model/product';
import product, { IProductQuery } from './method/product';
import { ISaleProduct, ISale, ISaleDocument } from './model/sale';
import sale, { ISaleQuery } from './method/sale';
import { IEmployee, IEmployeeDocument } from './model/employee';
import employee from './method/employee';

export {
  IMember,
  IMemberDocument,
  IWorkoutPlan,
  IPlanWorkout,
  IDiet,
  IDietPlan,
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
  DayOfWeek,
  TypeOfMeal,
  IEmployee,
  IEmployeeDocument,
};

export default (appPath: string) => {
  return {
    staff: staff(appPath),
    member: member(appPath),
    prepaid: prepaid(appPath),
    product: product(appPath),
    sale: sale(appPath),
    employee: employee(appPath),
  };
};
