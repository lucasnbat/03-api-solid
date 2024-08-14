import { verifyJWT } from '@/http/middlewares/verify-jwt'
import { FastifyInstance } from 'fastify'


export async function gymsRoutes(app: FastifyInstance) {
  /* Rotas daqui para baixo vão passar pelo middleware */
  app.addHook('onRequest', verifyJWT)
}
