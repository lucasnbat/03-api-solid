import { verifyJWT } from '@/http/middlewares/verify-jwt'
import { FastifyInstance } from 'fastify'
import { create } from './create'

export async function checkInsRoutes(app: FastifyInstance) {
  /* Rotas daqui para baixo vão passar pelo middleware */
  app.addHook('onRequest', verifyJWT)

  app.post('/gyms/:gymId/check-ins', create)
}
