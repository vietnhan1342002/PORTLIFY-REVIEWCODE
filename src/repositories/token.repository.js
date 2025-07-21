import RefreshToken from "../models/refreshToken.model.js";

export const generateRefreshToken = async (userId, token, expiry) => {
  return await RefreshToken.create({
    UserId: userId,
    token,
    expiryDate: expiry,
  });
};

export const findToken = async (token) => {
  return await RefreshToken.findOne({ where: { token } });
};

export const deleteToken = async (token) => {
  return await RefreshToken.destroy({ where: { token } });
};

export const deleteTokensByUser = async (userId) => {
  return await RefreshToken.destroy({ where: { UserId: userId } });
};