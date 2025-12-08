import 'dotenv/config';
import { defineConfig, env } from "prisma/config";

export default defineConfig({
  schema: 'schema.prisma', // Caminho relativo ao prisma.config.ts
  migrations: {
    path: 'migrations', // Caminho relativo ao prisma.config.ts
  },
  datasource: {
    url: env('DATABASE_URL'),
  },
});
