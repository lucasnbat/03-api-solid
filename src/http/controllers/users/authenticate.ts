import { z } from 'zod'
import { FastifyRequest, FastifyReply } from 'fastify'
import { PrismaUsersRepository } from '@/repositories/prisma/prisma-users-repository'
import { UserAlreadyExistsError } from '@/use-cases/errors/user-already-exists-error'
import { AuthenticateUseCase } from '@/use-cases/authenticate'
import { InvalidCredentialsError } from '@/use-cases/errors/invalid-credentials-error'
import { makeAuthenticateUseCase } from '@/use-cases/factories/make-authenticate-use-case'

export async function authenticate(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const authenticateBodySchema = z.object({
    email: z.string().email(),
    password: z.string().min(6),
  })

  const { email, password } = authenticateBodySchema.parse(request.body)

  try {
    /* Instancia a maquinaria que mexe com o banco. Ele que envia as dep. do Prisma */
    // const usersRepository = new PrismaUsersRepository()

    /* Instancia a classe que possui a lógica para pegar a maquinaria separada
     * e acionar o método create dessa maquinaria passando os parâmetros;
     * O acionamento do create() é feito dentro da função execute()
     */
    // const authenticateUseCase = new AuthenticateUseCase(usersRepository)

    const authenticateUseCase = makeAuthenticateUseCase()

    const { user } = await authenticateUseCase.execute({
      email,
      password,
    })

    /*
     * jwtSign: criar jwt
     * não coloque info. sensíveis do user no payload
     */
    const token = await reply.jwtSign(
      {}, // payload
      {
        sign: {
          sub: user.id,
        },
      },
    )

    const refreshToken = await reply.jwtSign(
      {}, // payload
      {
        sign: {
          sub: user.id,
          expiresIn: '7d'
        },
      },
    )

    return reply
      .setCookie('refreshToken', refreshToken, {
        path: '/',
        secure: true, // Usa HTTPS para cifrar
        sameSite: true, // Acessível somente no site
        httpOnly: true, // Acessível somente para o backend
      })
      .status(200)
      .send({
        token
      })
  } catch (err) {
    if (err instanceof InvalidCredentialsError) {
      return reply.status(400).send({ message: err.message }) // conflict error code
    }

    throw err
  }
}
