import path from 'path';

import {
  initializeEmployee,
  IEmployeeDocument,
  IEmployee,
} from '../model/employee';

export default function methods(filepath: string) {
  const db = initializeEmployee(path.join(filepath, 'employee.db'));

  const getEmployee = async (id: string): Promise<IEmployeeDocument> => {
    const employee = await db.asyncFindOne({ _id: id });
    return employee;
  };

  const getEmployees = async (): Promise<IEmployeeDocument[]> => {
    const employees = await db.asyncFind({});
    return employees as IEmployeeDocument[];
  };

  const createEmployee = async (
    data: IEmployee
  ): Promise<IEmployeeDocument> => {
    const employee = await db.asyncInsert({
      ...data,
      isEmployed: true,
      createdAt: new Date(),
    });
    return employee;
  };

  const updateEmployee = async (
    id: string,
    data: unknown
  ): Promise<IEmployeeDocument> => {
    await db.asyncUpdate({ _id: id }, { $set: data });
    const employee = await getEmployee(id);
    return employee;
  };

  const deleteEmployee = async (id: string): Promise<IEmployeeDocument> => {
    const employee = await db.asyncRemove({ _id: id });
    return employee as IEmployeeDocument;
  };

  return {
    getEmployee,
    getEmployees,
    createEmployee,
    updateEmployee,
    deleteEmployee,
  };
}
