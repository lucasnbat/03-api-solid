import { PrismaUsersRepository } from '@/repositories/prisma/prisma-users-repository'
import { RegisterUseCase } from '../register'

/* O papel dessa função é instanciar um registerUseCase para evitar
que mais para frente precisemos instanciar varios repositorios para 
montar um caso de uso e deixar isso sujando o código do controller */
export function makeRegisterUseCase() {
  const usersRepository = new PrismaUsersRepository()
  const registerUseCase = new RegisterUseCase(usersRepository)

  return registerUseCase
}
