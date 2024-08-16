import { z } from 'zod'
import { FastifyRequest, FastifyReply } from 'fastify'
import { makeCreateGymUseCase } from '@/use-cases/factories/make-create-gym-use-case'
import { makeSearchGymsUseCase } from '@/use-cases/factories/make-search-gyms-use-case'
import { makeFetchNearbyGymsUseCase } from '@/use-cases/factories/make-fetch-nearby-gyms-use-case'
import { makeFetchUserCheckInsHistoryUseCase } from '@/use-cases/factories/make-fetch-user-check-ins-history-use-case'

export async function history(request: FastifyRequest, reply: FastifyReply) {
  const searchHistoryQuerySchema = z.object({
    page: z.coerce.number().min(1).default(1)
  })

  const {
    page,
  } = searchHistoryQuerySchema.parse(request.query)

  const fetchUserCheckInHistoryUseCase = makeFetchUserCheckInsHistoryUseCase()

  const { checkIns } = await fetchUserCheckInHistoryUseCase.execute({
    userId: request.user.sub,
    page,
  })

  return reply.status(200).send({
    checkIns,
  })
}
