import { InMemoryCheckInsRepository } from '@/repositories/in-memory/in-memory-checkins-repository'
import { CheckInUseCase } from './check-in'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

let checkInRepository: InMemoryCheckInsRepository
let sut: CheckInUseCase

describe('Register Use Case', () => {
  beforeEach(() => {
    checkInRepository = new InMemoryCheckInsRepository()
    sut = new CheckInUseCase(checkInRepository)

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
    })

    console.log('VEJA= ', checkIn)

    expect(checkIn.id).toEqual(expect.any(String))
  })

  it('should not be able to check in twice in the same day', async () => {
    vi.setSystemTime(new Date(2022, 0, 20, 8, 0, 0))

    await sut.execute({
      gymId: 'gym-01',
      userId: 'user-01',
    })

    /* Agora o usuário vai tentar fazer checkin no mesmo dia e deve rejeitar */
    await expect(
      async () =>
        await sut.execute({
          gymId: 'gym-01',
          userId: 'user-01',
        }),
    ).rejects.toBeInstanceOf(Error)
  })

  it('should be able to check in twice but in different days', async () => {
    /* Fez check-in num dia */
    vi.setSystemTime(new Date(2022, 0, 20, 8, 0, 0))
    await sut.execute({
      gymId: 'gym-01',
      userId: 'user-01',
    })

    /* Agora vai fazer checkin em outro: precisa resolver a promise */
    vi.setSystemTime(new Date(2022, 0, 21, 8, 0, 0))

    const { checkIn } = await sut.execute({
      gymId: 'gym-01',
      userId: 'user-01',
    })

    expect(checkIn.id).toEqual(expect.any(String))
  })
})
