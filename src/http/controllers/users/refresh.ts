import { FastifyRequest, FastifyReply } from 'fastify'

export async function refresh(
  request: FastifyRequest,
  reply: FastifyReply,
) {

  /* Verificar se ainda tem o refreshToken nos cookies */
  /* O jwtVerify também disponibiliza os dados do token (user.sub) */
  await request.jwtVerify({ onlyCookie: true })

  const token = await reply.jwtSign(
    {}, // payload
    {
      sign: {
        sub: request.user.sub,
      },
    },
  )

  const refreshToken = await reply.jwtSign(
    {}, // payload
    {
      sign: {
        sub: request.user.sub,
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
}
