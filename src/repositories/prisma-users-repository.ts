/**
 * Aqui teremos vários métodos que vão interceptar para
 * qualquer op. a ser feita no BD. Sempre a operação vai
 * passar por aqui
 */

import { prisma } from '@/lib/prisma';
import { Prisma } from '@prisma/client';

/*
 * UserCreateInput é um tipo do arquivo nativo
 * Prisma que foi criado ao dar npx prisma migrate
 * dev
 */
export class PrismaUsersRepository {
  async create(data: Prisma.UserCreateInput) {
    const user = await prisma.user.create({
      data,
    });

    return user;
  }
}
