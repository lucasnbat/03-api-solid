/* eslint-disable prettier/prettier */
import { Environment } from 'vitest'

export default <Environment><unknown>{
  name: 'prisma',
  transformMode: 'ssr',
  async setup() {
    console.log('Executou')

    return {
      async teardown() {
        console.log('Teardown')
      },
    }
  },
}
