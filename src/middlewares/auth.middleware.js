import { verifyAccessToken } from "../utils/jwt.util.js";

export const authMiddleware = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token || !verifyAccessToken(token)) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  next();
};
