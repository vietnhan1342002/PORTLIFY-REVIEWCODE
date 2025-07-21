import jwt from "jsonwebtoken";
const JWT_SECRET = process.env.JWT_SECRET || "default_secret_key";
export const generateAccessToken = (payload) => {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: EXPIRE_ACCESSTOKEN });
};

export const verifyAccessToken = (token) => {
  return jwt.verify(token, JWT_SECRET);
};

