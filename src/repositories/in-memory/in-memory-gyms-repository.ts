import { Gym, User } from '@prisma/client'
import { GymsRepository } from '../gyms-repository'

/* Representação do UsersRepository para testes feito em JS puro */
export class InMemoryGymsRepository implements GymsRepository {
  public items: Gym[] = []

  async findById(id: string): Promise<Gym | null> {
    const gym = this.items.find((item) => item.id === id)

    if (!gym) {
      return null
    }

    return gym
  }
}
