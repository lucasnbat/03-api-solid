import { defineConfig } from 'vitest/config'
import tsconfigPahs from 'vitest-tsconfig-paths'

export default defineConfig({
  plugins: [tsconfigPahs()],
  test:{
    environmentMatchGlobs: [
      ['src/http/controllers/**', 'prisma']
    ]
  }
})
