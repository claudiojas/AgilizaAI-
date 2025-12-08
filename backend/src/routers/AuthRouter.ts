import { FastifyInstance } from "fastify";
import AuthUseCases from "../usecases/AuthUseCases";

export async function authRoutes(app: FastifyInstance) {
  const authUseCases = new AuthUseCases(app);

  app.post('/auth/login', async (request, reply) => {
    try {
      const token = await authUseCases.login(request.body as any);
      return reply
        .setCookie('access_token', token, {
          path: '/',
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'lax',
          maxAge: 60 * 60 * 24 * 7, // 7 dias
        })
        .status(200)
        .send({ message: "Login bem-sucedido!" });
    } catch (error: any) {
      return reply.status(401).send({ error: error.message });
    }
  });

  app.post('/auth/register', async (request, reply) => {
    try {
      const user = await authUseCases.registerUser(request.body as any);
      return reply.status(201).send(user);
    } catch (error: any) {
      return reply.status(400).send({ error: error.message });
    }
  });

  app.get('/auth/me', { onRequest: [async (request) => request.jwtVerify({ cookie: true })] }, async (request, reply) => {
    return reply.send(request.user);
  });

  app.post('/auth/logout', async (request, reply) => {
    return reply
      .clearCookie('access_token')
      .status(200)
      .send({ message: 'Logout bem-sucedido!' });
  });
}
