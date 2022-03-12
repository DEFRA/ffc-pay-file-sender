module.exports = {
  blobConnectionString: process.env.BATCH_STORAGE,
  shareConnectionString: process.env.DAX_STORAGE,
  containerName: 'dax',
  outboundFolder: 'outbound',
  shareName: process.env.DAX_SHARE_NAME,
  apFolder: process.env.AP_FOLDER,
  arFolder: process.env.AR_FOLDER,
  totalRetries: 10
}
