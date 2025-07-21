import { v4 as uuidv4 } from 'uuid';
import dayjs from 'dayjs';
const EXPIRE_REFRESHTOKEN = process.env.EXPIRE_REFRESHTOKEN || 7;

export const createRefreshToken = () => uuidv4();

export const getRefreshTokenExpiry = () => {
  return dayjs().add(EXPIRE_REFRESHTOKEN, 'day').toDate();
};