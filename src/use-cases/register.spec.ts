import { expect, describe, it } from 'vitest'
import { RegisterUseCase } from './register';
import { compare } from 'bcryptjs';

/**
 * Isso é um teste unitário, que não depende de outras 
 * partes do sistema (não pode bater no BD, em outros módulos,
 * etc.). Simule os testes criando classes fictícias, métodos 
 * fictícios, apenas implemente de vdd a função, método ou parte
 * realmente que precisa ser testada, mas sem bater em NADA de 
 * outras dependências do sistema;
 */

describe('Register Use Case', () => {
  it('should hash user password upon registration', async () => {
    const registerUseCase = new RegisterUseCase({
      async findByEmail(email) {
        return null
      },

      async create(data){
        return {
          id: 'user-1',
          name: data.name,
          email: data.email,
          passord_hash: data.passord_hash,
          created_at: new Date(),
        }
      },
    });

    const { user } = await registerUseCase.execute({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: '123456'
    })

    console.log(user.passord_hash)

    const isPasswordCorrectlyHashed = await compare(
      '123456',
      user.passord_hash,
    )

    expect(isPasswordCorrectlyHashed).toBe(true)

  })
})