import { Prisma, User } from "@prisma/client";
import { UsersRepository } from "../users-repository";

/* Representação do UsersRepository para testes feito em JS puro */
export class InMemoryUsersRepository implements UsersRepository {
  public items: User[] = []

  async findByEmail(email: string): Promise<User | null> {
    const user = this.items.find((item) => item.email === email)

    if (!user) {
      return null
    }

    return user
  }

  async create(data: Prisma.UserCreateInput): Promise<User> {
    const user = {
      id: 'user-1',
      name: data.name,
      email: data.email,
      passord_hash: data.passord_hash,
      created_at: new Date(),
    }

    this.items.push(user)

    return user
  }
}