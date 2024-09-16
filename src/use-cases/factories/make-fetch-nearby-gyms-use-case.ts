import { PrismaGymsRepository } from '@/repositories/prisma-gyms-repository'
import { SearchGymUseCase } from '../search-gyms'
import { FetchNearbyGymsUseCase } from '../fetch-nearby-gyms'

export function makeFetchNearbyGymsUseCase() {
  const gymsRepository = new PrismaGymsRepository()
  const useCase = new FetchNearbyGymsUseCase(gymsRepository)

  return useCase
}
