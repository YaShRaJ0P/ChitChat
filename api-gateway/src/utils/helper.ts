import { randomBytes } from "crypto";

export const generateUsername = (name: string) => {
  const customPrefix = name[0];
  const randomPart = randomBytes(5).toString('hex');
  const timestamp = Date.now().toString().slice(-5);
  return `${customPrefix}${randomPart}${timestamp}`.slice(0, 10);
};

export const setCookie = (refreshToken: string, res: any) => {
  res.cookie("refreshToken", refreshToken, { httpOnly: true, secure: true });
};

export const clearCookie = (res: any) => {
  res.clearCookie("refreshToken", { httpOnly: true, secure: true });
}

