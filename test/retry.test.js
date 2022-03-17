jest.mock('../ffc-pay-file-sender/config', () => ({ totalRetries: 1 }))
const retry = require('../ffc-pay-file-sender/retry')

describe('retry', () => {
  const mockFunction = jest.fn()

  beforeEach(() => {
    jest.clearAllMocks()
  })

  test('should retry as specified in config', async () => {
    await retry(mockFunction)
    expect(mockFunction).toHaveBeenCalledTimes(1)
  })
})
