jest.mock('../ffc-pay-file-sender/config', () => ({ totalRetries: 1 }))
const mockContext = require('./mock-context')
const mockContent = 'content'
const mockGetContainerClient = jest.fn()
const mockBlob = {
  downloadToBuffer: jest.fn().mockResolvedValue(Buffer.from(mockContent)),
  beginCopyFromURL: jest.fn().mockResolvedValue({ pollUntilDone: jest.fn().mockResolvedValue({ copyStatus: 'success' }) }),
  delete: jest.fn(),
  url: 'url'
}
const mockContainer = {
  getBlockBlobClient: jest.fn().mockReturnValue(mockBlob)
}
const mockBlobServiceClient = {
  getContainerClient: mockGetContainerClient.mockReturnValue(mockContainer)
}
jest.mock('@azure/storage-blob', () => {
  return {
    BlobServiceClient: {
      fromConnectionString: jest.fn().mockReturnValue(mockBlobServiceClient)
    }
  }
})
const mockGetShareClient = jest.fn()
const mockFile = {
  create: jest.fn(),
  uploadRange: jest.fn()
}
const mockFolder = {
  getFileClient: jest.fn().mockReturnValue(mockFile)
}
const mockShare = {
  getDirectoryClient: jest.fn().mockReturnValue(mockFolder)
}
const mockShareServiceClient = {
  getShareClient: mockGetShareClient.mockReturnValue(mockShare)
}
jest.mock('@azure/storage-file-share', () => {
  return {
    ShareServiceClient: {
      fromConnectionString: jest.fn().mockReturnValue(mockShareServiceClient)
    }
  }
})

const sender = require('../ffc-pay-file-sender')
let message

describe('sender', () => {
  beforeEach(() => {
    message = { filename: 'my-file.dat', ledger: 'AP' }
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  test('should write file to share', async () => {
    await sender(mockContext, message)
    expect(mockFile.uploadRange).toHaveBeenCalledWith(mockContent, 0, mockContent.length)
  })

  test('should archive original blob', async () => {
    await sender(mockContext, message)
    expect(mockBlob.beginCopyFromURL).toHaveBeenCalledWith(mockBlob.url)
  })

  test('should delete original blob location', async () => {
    await sender(mockContext, message)
    expect(mockBlob.delete).toHaveBeenCalledTimes(1)
  })

  test('should throw error if message schema invalid', async () => {
    message = {}
    await expect(sender(mockContext, message)).rejects.toThrow()
  })

  test('should throw error if file missing', async () => {
    mockBlob.downloadToBuffer.mockImplementation(() => { throw new Error() })
    await expect(sender(mockContext, message)).rejects.toThrow()
  })
})
