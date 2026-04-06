import { identityFunc } from '@src-lib/utils'
import { describe, expect, test } from 'vitest'

// Vitest functionality test
describe('Vitest Functionality', () => {
    test('This should work!', async () => {
        const myVal = Math.random()

        expect(identityFunc(myVal)).toBe(myVal)
    })
})
