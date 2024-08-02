import { InMemoryCheckInsRepository } from '@/repositories/in-memory/in-memory-checkins-repository'
import { CheckInUseCase } from './check-in'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { InMemoryGymsRepository } from '@/repositories/in-memory/in-memory-gyms-repository'
import { Decimal } from '@prisma/client/runtime/library'

let checkInRepository: InMemoryCheckInsRepository
let gymsRepository: InMemoryGymsRepository
let sut: CheckInUseCase

describe('CheckIn Use Case', () => {
  beforeEach(() => {
    checkInRepository = new InMemoryCheckInsRepository()
    gymsRepository = new InMemoryGymsRepository()
    sut = new CheckInUseCase(checkInRepository, gymsRepository)

    gymsRepository.items.push({
      id: 'gym-01',
      title: 'academia js',
      description: 'js',
      phone: '',
      latitude: new Decimal(-12.5566976),
      longitude: new Decimal(-55.7187072),
    })

    /* Usar datas falsas para testes */
    vi.useFakeTimers()
  })

  afterEach(() => {
    /* Depois de cada teste, resetar para usar datas reais */
    vi.useRealTimers()
  })

  it('should be able to check in', async () => {
    /* Ano, mês, dia, hora, minuto, segundo */
    /* Isso serve para sempre setar a mesma data e evitar surpresas */
    vi.setSystemTime(new Date(2022, 0, 20, 8, 0, 0))

    const { checkIn } = await sut.execute({
      gymId: 'gym-01',
      userId: 'user-01',
      userLatitude: -12.5566976,
      userLongitude: -55.7187072,
    })

    expect(checkIn.id).toEqual(expect.any(String))
  })

  it('should not be able to check in twice in the same day', async () => {
    vi.setSystemTime(new Date(2022, 0, 20, 8, 0, 0))

    await sut.execute({
      gymId: 'gym-01',
      userId: 'user-01',
      userLatitude: -12.5566976,
      userLongitude: -55.7187072,
    })

    /* Agora o usuário vai tentar fazer checkin no mesmo dia e deve rejeitar */
    await expect(
      async () =>
        await sut.execute({
          gymId: 'gym-01',
          userId: 'user-01',
          userLatitude: -12.5566976,
          userLongitude: -55.7187072,
        }),
    ).rejects.toBeInstanceOf(Error)
  })

  it('should be able to check in twice but in different days', async () => {
    /* Fez check-in num dia */
    vi.setSystemTime(new Date(2022, 0, 20, 8, 0, 0))
    await sut.execute({
      gymId: 'gym-01',
      userId: 'user-01',
      userLatitude: -12.5566976,
      userLongitude: -55.7187072,
    })

    /* Agora vai fazer checkin em outro: precisa resolver a promise */
    vi.setSystemTime(new Date(2022, 0, 21, 8, 0, 0))

    const { checkIn } = await sut.execute({
      gymId: 'gym-01',
      userId: 'user-01',
      userLatitude: -12.5566976,
      userLongitude: -55.7187072,
    })

    expect(checkIn.id).toEqual(expect.any(String))
  })

  it('should not be able to check in on distant gym', async () => {
    /* Cadastro academia distante mais que 100 metros */
    gymsRepository.items.push({
      id: 'gym-02',
      title: 'academia ts',
      description: '',
      phone: '',
      latitude: new Decimal(-12.4518704),
      longitude: new Decimal(55.8152667),
    })

    /* Tentando fazer checkin nessa academia estando distante mais de 100m */
    await expect(async () => {
      await sut.execute({
        gymId: 'gym-02',
        userId: 'user-01',
        userLatitude: -12.5566976,
        userLongitude: -55.7187072,
      })
    }).rejects.toBeInstanceOf(Error)
  })
})

// @-12.4518704,-55.8152667,14z?entry=ttu
