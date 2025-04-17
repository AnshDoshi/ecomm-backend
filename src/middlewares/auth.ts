import { NextFunction, Request, Response } from "express";
import { UnauthorizedException } from "../exceptions/unauthorized";
import { ErrorCode } from "../exceptions/root";
import * as jwt from "jsonwebtoken";
import { prismaClient } from "..";

const authMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const token = req.headers.authorization;

  if (!token) {
    return next(
      new UnauthorizedException("Unauthorized", ErrorCode.UNAUTHORIZED)
    );
  }
  try {
    const payload:{userId:number} = jwt.verify(token, process.env.JWT_SECRET) as any
    const user = await prismaClient.user.findFirst({
      where: { id: payload.userId },
    });
    if(!user){
            next(
              new UnauthorizedException("Unauthorized", ErrorCode.UNAUTHORIZED)
            );

    }
    req.user=user
    next()
  } catch (error) {
    next(new UnauthorizedException("Unauthorized", ErrorCode.UNAUTHORIZED));
  }
};

export default authMiddleware;
