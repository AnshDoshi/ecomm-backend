import { NextFunction, Request, Response } from "express";
import { UnauthorizedException } from "../exceptions/unauthorized";
import { ErrorCode } from "../exceptions/root";
import jwt from "jsonwebtoken";
import { prismaClient } from "..";
import { BadRequestsException } from "../exceptions/bad-requests";
import { AuthRequest } from "types/AuthRequest";

const authMiddleware = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    next(new UnauthorizedException("Unauthorized", ErrorCode.UNAUTHORIZED));
    return;
  }
  try {
    let secret = process.env.JWT_SECRET;
    if (!secret) {
      next(
        new BadRequestsException("SECRET not found", ErrorCode.UNAUTHORIZED)
      );
      return;
    }

    const payload: { userId: number } = jwt.verify(token, secret) as {
      userId: number;
    };
    const user = await prismaClient.user.findFirst({
      where: { id: payload.userId },
    });
    if (!user) {
      next(new UnauthorizedException("Unauthorized", ErrorCode.UNAUTHORIZED));
      return;
    }
    req.user = user;
    next();
  } catch (error) {
    next(new UnauthorizedException("Unauthorized", ErrorCode.UNAUTHORIZED));
  }
};

export default authMiddleware;
