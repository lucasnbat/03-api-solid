import { env } from '@/env';
import { PrismaClient } from '@prisma/client';

/* Se você habilitar o log, ele mostra as operações feitas
 * no banco, as querys
 * No caso, habilitamos apenas para ambiente 'dev'
 */
export const prisma = new PrismaClient({
  log: env.NODE_ENV === 'dev' ? ['query'] : [],
});
