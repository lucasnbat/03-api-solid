import { Prisma } from "@prisma/client";

/*
 * UserCreateInput é um tipo do arquivo nativo
 * Prisma que foi criado ao dar npx prisma migrate
 * dev
 */
export class inMemoryUserRepository {
  public users: any[] = [];

  async create(data: Prisma.UserCreateInput) {
    this.users.push(data);
  }
}
