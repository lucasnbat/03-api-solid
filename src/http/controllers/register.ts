import { z } from 'zod'
import { FastifyRequest, FastifyReply } from 'fastify'
import { RegisterUseCase } from '@/use-cases/register'
import { PrismaUsersRepository } from '@/repositories/prisma-users-repository'

export async function register(request: FastifyRequest, reply: FastifyReply) {
  const registerBodySchema = z.object({
    name: z.string(),
    email: z.string().email(),
    password: z.string().min(6),
  })

  const { name, email, password } = registerBodySchema.parse(request.body)

  try {
    /* Instancia a maquinaria que mexe com o banco */
    const prismaUsersRepository = new PrismaUsersRepository()

    /* Instancia a classe que possui a lógica para pegar a maquinaria separada
     * e acionar o método create dessa maquinaria passando os parâmetros;
     * O acionamento do create() é feito dentro da função execute()
     */
    const registerUseCase = new RegisterUseCase(prismaUsersRepository)

    await registerUseCase.execute({
      name,
      email,
      password,
    })
  } catch (err) {
    return reply.status(409).send()
  }

  return reply.status(201).send()
}
