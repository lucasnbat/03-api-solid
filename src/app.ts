import fastify from 'fastify'
import { userRoutes } from './http/controllers/users/routes'
import { ZodError } from 'zod'
import { env } from './env'
import fastifyJwt from '@fastify/jwt'
import { gymsRoutes } from './http/controllers/gyms/routes'
import { checkInsRoutes } from './http/controllers/check-ins/routes'
import fastifyCookie from '@fastify/cookie'

export const app = fastify()

/*
 * esse register abaixo não é a função register, é o
 * termo 'register' usado pelo fastify para registar plugins
 * sim, o routes.ts com appRouter também é plugin do fastify)
 */

/* Config. JWT */
app.register(fastifyJwt, {
  secret: env.JWT_SECRET,
  cookie: {
    cookieName: 'refreshToken',
    signed: false,
  },
  sign: {
    expiresIn: '10m' // 10 min.
  }
})

app.register(fastifyCookie)
app.register(userRoutes)
app.register(gymsRoutes)
app.register(checkInsRoutes)

/* Usa _ quando não vai usar o parametro da função (no caso, request) */
app.setErrorHandler((error, _, reply) => {
  if (error instanceof ZodError) {
    return reply
      .status(400)
      .send({ message: 'Validation Error', issues: error.format() })
  }

  if (env.NODE_ENV !== 'production') {
    console.error(error)
  } else {
    // here we sould log to an external tool like datalogs
  }

  return reply.status(500).send({ message: 'Internal Server Error' })
})
