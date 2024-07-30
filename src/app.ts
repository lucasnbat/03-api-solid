import fastify from 'fastify'
import { appRoutes } from './http/routes'
import { ZodError } from 'zod'
import { env } from './env'

export const app = fastify()

/*
 * esse register abaixo não é a função register, é o
 * termo 'register' usado pelo fastify para registar plugins
 * sim, o routes.ts com appRouter também é plugin do fastify)
 */
app.register(appRoutes)

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
