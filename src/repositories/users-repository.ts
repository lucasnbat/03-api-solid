import { Prisma, User } from '@prisma/client'

/*
 * isso é puramente para tipar o tipo de dependência
 * que minha instância RegisterUseCase recebe lá no
 * controller
 *
 * basicamente o que temos aqui é a tipagem da função
 * que tá em prisma-users-repository
 *
 * Portanto, é preciso que vc tipe o usersRepository no
 * arquivo de use-case E TAMBÉM tipe o prisma-users-repository.ts
 * usando o 'implements'
 */
export interface UsersRepository {
  findByEmail(email: string): Promise<User | null>
  create(data: Prisma.UserCreateInput): Promise<User>
}
