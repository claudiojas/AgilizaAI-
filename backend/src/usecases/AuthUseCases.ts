import AuthRepository from "../repositories/AuthRepository";
import { ICreateUser } from "../interfaces/user.interface";
import * as bcrypt from 'bcryptjs';
import { z } from "zod";
import { FastifyInstance } from "fastify";

const createUserSchema = z.object({
  email: z.string().email("Email inválido."),
  name: z.string().min(3, "O nome é obrigatório."),
  password: z.string().min(6, "A senha deve ter no mínimo 6 caracteres."),
});

const loginSchema = z.object({
  email: z.string().email("Email inválido."),
  password: z.string(),
});

class AuthUseCases {
  constructor(private app: FastifyInstance) {}

  async registerUser(data: ICreateUser) {
    const validatedData = createUserSchema.parse(data);

    const userExists = await AuthRepository.findUserByEmail(validatedData.email);
    if (userExists) {
      throw new Error("Email já cadastrado.");
    }

    const hashedPassword = await bcrypt.hash(validatedData.password, 10);
    
    const newUser = await AuthRepository.createUser({
      ...validatedData,
      password: hashedPassword,
      role: 'ADMIN' // Por padrão, o primeiro usuário é admin
    });

    const { password, ...user } = newUser;
    return user;
  }

  async login(data: z.infer<typeof loginSchema>) {
    const validatedData = loginSchema.parse(data);

    const user = await AuthRepository.findUserByEmail(validatedData.email);
    if (!user) {
      throw new Error("Email ou senha inválidos.");
    }

    const isPasswordValid = await bcrypt.compare(validatedData.password, user.password);
    if (!isPasswordValid) {
      throw new Error("Email ou senha inválidos.");
    }

    const token = this.app.jwt.sign({
      name: user.name,
      email: user.email,
      role: user.role,
    }, {
      sub: user.id,
      expiresIn: '7d', // Token expira em 7 dias
    });

    return token;
  }
}

export default AuthUseCases;
