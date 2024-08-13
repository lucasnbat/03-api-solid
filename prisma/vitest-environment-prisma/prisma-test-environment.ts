/* eslint-disable prettier/prettier */
import { Environment } from 'vitest'

export default <Environment><unknown>{
  name: 'prisma',
  async setup() {
    console.log('Executou')

    return {
      teardown() { },
    }
  },
}
