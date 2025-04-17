import express, { Express, NextFunction, Request, Response } from "express";
import rootRouter from "./routes";
import { PrismaClient } from "@prisma/client";
import { errorMiddleware } from "./middlewares/errors";
import { SignUpSchema } from "./schema/users";

const app: Express = express();

app.use(express.json());

app.get("/", (req: Request, res: Response,next:NextFunction) => {
  res.send("API is running...");
});

app.use("/api", rootRouter);

export const prismaClient = new PrismaClient({
  log: ["query"],
})
// .$extends({
//   query: {
//     user: {
//       create({ args, query }) {
//         args.data = SignUpSchema.parse(args.data);
//         return query(args);
//       },
//     },
//   },
// });

app.use(errorMiddleware);

app.listen(process.env.PORT || 8080, () => {
  console.log("SERVER is runnning on 8080");
});
