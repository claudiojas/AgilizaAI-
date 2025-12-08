import { prisma } from "../BD/prisma.config";
import { ICreateUser } from "../interfaces/user.interface";
import { User } from "@prisma/client";

class AuthRepository {
  async findUserByEmail(email: string): Promise<User | null> {
    return prisma.user.findUnique({
      where: { email },
    });
  }

  async createUser(data: ICreateUser): Promise<User> {
    return prisma.user.create({
      data,
    });
  }
}

export default new AuthRepository();
