import AsyncNedb from 'nedb-async';

export enum DayOfWeek {
  Monday,
  Tuesday,
  Wednesday,
  Thursday,
  Friday,
  Saturday,
  Sunday,
}

export enum TypeOfMeal {
  Breakfast,
  Lunch,
  Dinner,
}

export interface IPlanWorkout {
  name: string;
  sets: number;
  rep: number;
  minutes?: number;
}

export interface IWorkoutPlan {
  [key: string]: IPlanWorkout[];
}

export interface IDiet {
  name: string;
  quantity: number;
  unit: string;
}

export interface IDietPlan {
  [key: string]: IDiet[];
}

// export interface IWorkoutPlan {
//   monday?: IPlanWorkout[];
//   tuesday?: IPlanWorkout[];
//   wednesday?: IPlanWorkout[];
//   thursday?: IPlanWorkout[];
//   friday?: IPlanWorkout[];
//   saturday?: IPlanWorkout[];
//   sunday?: IPlanWorkout[];
// }

export interface IMonthlyPayment {
  date: Date;
  paid: boolean;
  amount: number;
}

export interface IMemberProduct {
  date: Date;
  products: {
    name: string;
    price: number;
    quantity: number;
  }[];
  grossTotal: number;
}

export interface IMember {
  img: string;
  firstName: string;
  lastName: string;
  dob: Date;
  sex: string;
  occupation: string;
  email: string;
  phoneNo: string;
  address: string;
  regularExercise: string;
  injuries: string;
  goal: string;
  heardAboutClub: string;
  prescribedMedication: string;
  pregnant?: {
    isPregnant: boolean;
    dueDate?: Date;
  };
  givenBirth6Month?: boolean;
  dieting: boolean;
  hospitalisedRecently: boolean;
  highBloodPressure: boolean;
  membershipFee?: number;
}

export interface IMemberDocument extends IMember {
  _id?: string;
  workoutPlane: IWorkoutPlan;
  dietPlan: IDietPlan;
  monthlyPayments: IMonthlyPayment[];
  products: IMemberProduct[];
  memberShipExpirationDate: Date;
  leavingDate?: Date;
  isMember: boolean;
  memberId: string;
  hasPaymentDue: boolean;
  createdAt: Date;
}

export const initializeMember = (filename: string) => {
  const member = new AsyncNedb<IMemberDocument>({ filename, autoload: true });
  member.ensureIndex({ fieldName: 'memberId' });
  return member;
};
