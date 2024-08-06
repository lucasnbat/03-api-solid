import { InMemoryCheckInsRepository } from '@/repositories/in-memory/in-memory-checkins-repository'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { FetchUserCheckInsHistoryUseCase } from './fetch-user-check-ins-history'
import { SearchGymUseCase } from './search-gyms'
import { InMemoryGymsRepository } from '@/repositories/in-memory/in-memory-gyms-repository'
import { title } from 'process'
import { FetchNearbyGymsUseCase } from './fetch-nearby-gyms'

let gymsRepository: InMemoryGymsRepository
let sut: FetchNearbyGymsUseCase

describe('Fetch Nearby Gyms Use Case', () => {
  beforeEach(async () => {
    gymsRepository = new InMemoryGymsRepository()
    sut = new FetchNearbyGymsUseCase(gymsRepository)
  })

  it('should be able to fetch nearby gyms', async () => {
    await gymsRepository.create({
      title: 'Academia Distante',
      description: null,
      latitude: -12.4518704,
      longitude: -55.8152667,
      phone: null,
    })

    await gymsRepository.create({
      title: 'Academia Pertinho',
      description: null,
      latitude: -12.5566976,
      longitude: -55.7187072,
      phone: null,
    })

    const { gyms } = await sut.execute({
      userLatitude: -12.5566976,
      userLongitude: -55.7187072,
    })

    expect(gyms).toHaveLength(1)
    expect(gyms).toEqual([
      expect.objectContaining({ title: 'Academia Pertinho' }),
    ])
  })
})
