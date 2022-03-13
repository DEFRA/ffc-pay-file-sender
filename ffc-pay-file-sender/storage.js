const { BlobServiceClient } = require('@azure/storage-blob')
const { ShareServiceClient } = require('@azure/storage-file-share')
const { containerName, outboundFolder, archiveFolder, shareName, apFolder, arFolder } = require('./config')
const { AP } = require('./ledgers')

let blobServiceClient
let shareServiceClient
let container
let share

const connect = (blobConnectionString, shareConnectionString) => {
  blobServiceClient = BlobServiceClient.fromConnectionString(blobConnectionString)
  container = blobServiceClient.getContainerClient(containerName)
  shareServiceClient = ShareServiceClient.fromConnectionString(shareConnectionString)
  share = shareServiceClient.getShareClient(shareName)
}

const getBlob = async (folder, filename) => {
  return container.getBlockBlobClient(`${folder}/${filename}`)
}

const getFile = async (context, filename) => {
  context.log(`Searching for ${filename} in ${outboundFolder}`)
  const blob = await getBlob(outboundFolder, filename)
  const downloaded = await blob.downloadToBuffer()
  context.log(`Found ${filename}`)
  return { blob, content: downloaded.toString() }
}

const writeFile = async (filename, ledger, content) => {
  const folderName = getFolderName(ledger)
  const folder = share.getDirectoryClient(folderName)

  const file = folder.getFileClient(filename)
  await file.create(content.length)
  await file.uploadRange(content, 0, content.length)
}

const archiveFile = async (filename, blob) => {
  const destinationBlob = await getBlob(archiveFolder, filename)
  const copyResult = await (await destinationBlob.beginCopyFromURL(blob.url)).pollUntilDone()

  if (copyResult.copyStatus === 'success') {
    await blob.delete()
  }
}

const getFolderName = (ledger) => {
  return ledger === AP ? apFolder : arFolder
}

module.exports = {
  connect,
  getFile,
  writeFile,
  archiveFile
}
