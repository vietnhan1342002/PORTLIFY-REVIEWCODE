import ExistingError from "../errors/ExistingError.js";
import NotFoundError from "../errors/NotfoundError.js";
import * as userRepository from "../repositories/user.repository.js";
import * as tokenRepository from "../repositories/token.repository.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { generateRefreshToken } from "../repositories/token.repository.js";
import {
  createRefreshToken,
  getRefreshTokenExpiry,
} from "../utils/uuid.util.js";
import AppError from "../errors/AppError.js";
import { OAuth2Client } from "google-auth-library";
import User from "../models/user.model.js";

const JWT_SECRET = process.env.JWT_SECRET || "default_secret_key";
const EXPIRE_ACCESSTOKEN = process.env.EXPIRE_ACCESSTOKEN || "15m";
const client = new OAuth2Client(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.GOOGLE_REDIRECT_URI
);

export const register = async ({ email, password, fullName }) => {
  const existingUser = await userRepository.findUserByEmail(email);
  if (existingUser) throw new ExistingError("Email already registered");

  const hashed = await bcrypt.hash(password, 10);

  const user = await userRepository.createUser({
    email,
    password: hashed,
    fullName,
  });

  return user;
};

export const login = async ({ email, password }) => {
  const user = await userRepository.findUserByEmail(email);
  if (!user) throw new NotFoundError("Invalid credentials");

  const match = await bcrypt.compare(password, user.password);
  if (!match) throw new NotFoundError("Invalid credentials");
  const payload = { id: user.id, email: user.email };

  const accessToken = generateAccessToken(payload);
  const refreshToken = createRefreshToken();
  const expiry = getRefreshTokenExpiry();

  await tokenRepository.generateRefreshToken(user.id, refreshToken, expiry);

  return { accessToken, refreshToken, user };
};

export const refreshAccessToken = async (oldRefreshToken) => {
  const tokenData = await tokenRepository.findToken(oldRefreshToken);
  if (!tokenData) throw new AppError("Invalid refresh token", 403);

  if (new Date() > tokenData.expiryDate) {
    await tokenRepository.deleteToken(oldRefreshToken);
    throw new AppError("Refresh token expired", 403);
  }

  await tokenRepository.deleteToken(oldRefreshToken);

  const newAccessToken = generateAccessToken({ id: tokenData.UserId });
  const newRefreshToken = createRefreshToken();
  const expiry = getRefreshTokenExpiry();

  await tokenRepository.generateRefreshToken(
    tokenData.UserId,
    newRefreshToken,
    expiry
  );

  return { accessToken: newAccessToken, refreshToken: newRefreshToken };
};

export const logout = async (refreshToken) => {
  await tokenRepository.deleteToken(refreshToken);
};

export const googleLogin = async (code) => {
  if (!code) throw new Error('Missing code');

  const { tokens } = await client.getToken(code);
  if (!tokens?.id_token) throw new Error('No id_token received');

  const ticket = await client.verifyIdToken({
    idToken: tokens.id_token,
    audience: process.env.GOOGLE_CLIENT_ID,
  });

  const payload = ticket.getPayload();

  // Trả về payload và tokens cho controller xử lý tiếp
  return { payload, tokens };
};


export const generateGoogleAuthUrl = () => {
  return client.generateAuthUrl({
    access_type: "offline",
    scope: ["profile", "email"],
  });
};

const generateAccessToken = (payload) => {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: EXPIRE_ACCESSTOKEN });
};
