import jwt from "jsonwebtoken";

const SECRET = process.env.JWT_SECRET!;

export type JwtPayload = {
  userId: string;
  role: "BUYER" | "SELLER" | "ADMIN";
};

export function signToken(payload: JwtPayload) {
  return jwt.sign(payload, SECRET, { expiresIn: "7d" });
}

export function verifyToken(token: string): JwtPayload {
  return jwt.verify(token, SECRET) as JwtPayload;
}