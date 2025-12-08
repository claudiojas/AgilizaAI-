import { User as UserModel } from "@prisma/client";

export type ICreateUser = Omit<UserModel, "id" | "createdAt" | "updatedAt">;

export type IUser = Omit<UserModel, "password">;
