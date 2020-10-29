import path from 'path';
import bcrypt from 'bcryptjs';

import { initializeStaff } from '../model/staff';

export default function methods(filepath: string) {
  const db = initializeStaff(path.join(filepath, 'staff.db'));

  const createStaff = async (name: string, password: string) => {
    const salt = bcrypt.genSaltSync(12);
    const passwordHash = bcrypt.hashSync(password, salt);
    const staff = await db.asyncInsert({
      name,
      password: passwordHash,
    });
    return staff;
  };

  const verifyStaff = async (name: string, password: string) => {
    const staff = await db.asyncFindOne({ name });
    if (!staff) return false;
    return bcrypt.compareSync(password, staff.password);
  };

  return {
    createStaff,
    verifyStaff,
  };
}
