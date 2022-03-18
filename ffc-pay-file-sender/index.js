const transferFile = require('./transfer-file')
const validateMessage = require('./validate-message')

module.exports = async function (context, mySbMsg) {
  context.log('JavaScript ServiceBus topic trigger function received message', mySbMsg)
  await validateMessage(context, mySbMsg)
  await transferFile(context, mySbMsg.filename, mySbMsg.ledger)
}
