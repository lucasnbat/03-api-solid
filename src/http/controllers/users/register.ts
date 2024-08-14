import { z } from 'zod'
import { FastifyRequest, FastifyReply } from 'fastify'
import { UserAlreadyExistsError } from '@/use-cases/errors/user-already-exists-error'
import { makeRegisterUseCase } from '@/use-cases/factories/make-register-use-case'

export async function register(request: FastifyRequest, reply: FastifyReply) {
  const registerBodySchema = z.object({
    name: z.string(),
    email: z.string().email(),
    password: z.string().min(6),
  })

  const { name, email, password } = registerBodySchema.parse(request.body)

  try {
    /* Instancia a maquinaria que mexe com o banco. Ele que envia as dep. do Prisma */
    // const prismaUsersRepository = new PrismaUsersRepository()

    /* Instancia a classe que possui a lógica para pegar a maquinaria separada
     * e acionar o método create dessa maquinaria passando os parâmetros;
     * O acionamento do create() é feito dentro da função execute()
     */
    // const registerUseCase = new RegisterUseCase(prismaUsersRepository)

    /* Chamando função factory para instanciar meu caso de uso */
    const registerUseCase = makeRegisterUseCase()

    await registerUseCase.execute({
      name,
      email,
      password,
    })
  } catch (err) {
    if (err instanceof UserAlreadyExistsError) {
      return reply.status(409).send({ message: err.message }) // conflict error code
    }

    throw err
  }

  return reply.status(201).send()
}
