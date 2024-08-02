import { expect, describe, it } from 'vitest'
import { RegisterUseCase } from './register';
import { compare, hash } from 'bcryptjs';
import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository';
import { UserAlreadyExistsError } from './errors/user-already-exists-error';
import { AuthenticateUseCase } from './authenticate';
import { InvalidCredentialsError } from './errors/invalid-credentials-error';

describe('Authenticate Use Case', () => {
  it('should be able to authenticate', async () => {
    const usersRepository = new InMemoryUsersRepository();
    // const authenticateUseCase = new AuthenticateUseCase(usersRepository);
    // sut = system under test (o authenticateUseCase)
    const sut = new AuthenticateUseCase(usersRepository)

    await usersRepository.create({
      name: 'John Doe',
      email: 'johndoe@example.com',
      passord_hash: await hash('123456', 6)
    })

    const { user } = await sut.execute({
      email: 'johndoe@example.com',
      password: '123456',
    })

    expect(user.id).toEqual(expect.any(String))
  })

  it('should not be able to authenticate with wrong email', async () => {
    /* 
     * instancia o rep. com a ferramenta a ser 
     * usada para manipular banco (no caso, JS puro) 
     */
    const usersRepository = new InMemoryUsersRepository();

    /* 
     * Instancia o caso de uso que vai utilizar a
     * ferramenta para cumprir a regra de negócio
     */
    const sut = new AuthenticateUseCase(usersRepository)

    expect(async () => {
      await sut.execute({
        email: 'johndoe@example.com',
        password: '123456'
      })
    }).rejects.toBeInstanceOf(InvalidCredentialsError)
  })

  it('should not be able to authenticate with wrong password', async () => {
    /* 
     * instancia o rep. com a ferramenta a ser 
     * usada para manipular banco (no caso, JS puro) 
     */
    const usersRepository = new InMemoryUsersRepository();

    /* 
     * Instancia o caso de uso que vai utilizar a
     * ferramenta para cumprir a regra de negócio
     */
    const sut = new AuthenticateUseCase(usersRepository)

    /* Acesso o usersRep pq ele que tem a função create(), o sut só tem a de authenticar
    Estou fazendo isso para não precisar chamar o register.ts (viraria teste de integração) */
    await usersRepository.create({
      name: 'John Doe',
      email: 'johndoe@example.com',
      passord_hash: await hash('123456', 6)
    })

    /* Testando entrar com uma senha diferente */
    expect(async () => {
      await sut.execute({
        email: 'johndoe@example.com',
        password: '123457'
      })
    }).rejects.toBeInstanceOf(InvalidCredentialsError)
  })
})