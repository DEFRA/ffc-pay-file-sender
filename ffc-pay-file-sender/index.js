const transferFile = require('./transfer-file')

module.exports = async function (context, mySbMsg) {
  context.log('JavaScript ServiceBus topic trigger function received message', mySbMsg)
  await transferFile(context, mySbMsg.filename, mySbMsg.ledger)
}
