const { blobConnectionString, shareConnectionString } = require('./config')
const getFile = require('./get-file')
const storage = require('./storage')

const transferFile = async (context, filename, ledger) => {
  await storage.connect(blobConnectionString, shareConnectionString)
  const { blob, content } = await getFile(context, filename)
  await storage.writeFile(filename, ledger, content)
  await storage.archiveFile(filename, blob)
  context.log(`Successfully transferred ${filename} to ${ledger}`)
}

module.exports = transferFile
