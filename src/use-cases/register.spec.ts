import { expect, describe, it } from 'vitest'
import { RegisterUseCase } from './register'
import { compare } from 'bcryptjs'
import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository'
import { UserAlreadyExistsError } from './errors/user-already-exists-error'

/**
 * Isso é um teste unitário, que não depende de outras
 * partes do sistema (não pode bater no BD, em outros módulos,
 * etc.). Simule os testes criando classes fictícias, métodos
 * fictícios, apenas implemente de vdd a função, método ou parte
 * realmente que precisa ser testada, mas sem bater em NADA de
 * outras dependências do sistema;
 */

describe('Register Use Case', () => {
  it('should be able to register', async () => {
    const usersRepository = new InMemoryUsersRepository()
    const registerUseCase = new RegisterUseCase(usersRepository)

    const { user } = await registerUseCase.execute({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: '123456',
    })

    /* Espero que o id retornado seja igual a qualquer string */
    expect(user.id).toEqual(expect.any(String))
  })

  it('should hash user password upon registration', async () => {
    const usersRepository = new InMemoryUsersRepository()
    const registerUseCase = new RegisterUseCase(usersRepository)

    const { user } = await registerUseCase.execute({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: '123456',
    })

    console.log(user.passord_hash)

    const isPasswordCorrectlyHashed = await compare('123456', user.passord_hash)

    expect(isPasswordCorrectlyHashed).toBe(true)
  })

  it('should not be able to register with same email twice', async () => {
    const usersRepository = new InMemoryUsersRepository()
    const registerUseCase = new RegisterUseCase(usersRepository)

    const email = 'mario@example.com'

    await registerUseCase.execute({
      name: 'Mario',
      email,
      password: '123456',
    })

    /* Espero que essa promise rejeite e que o resultado seja
     * uma instancia da classe UserAlreadyExistsError
     * await deve ser usado antes do expect sempre que dentro dele tiver uma promise
     */
    await expect(() =>
      registerUseCase.execute({
        name: 'Mario',
        email,
        password: '123456',
      }),
    ).rejects.toBeInstanceOf(UserAlreadyExistsError)
  })
})
