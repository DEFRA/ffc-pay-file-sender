const schema = require('./schema')

const validateMessage = async (context, message) => {
  const result = schema.validate(message, { abortEarly: false })
  if (result.error) {
    const errMessage = `The message schema is invalid. ${result.error.message}`
    context.log(errMessage)
    throw new Error(errMessage)
  }
}

module.exports = validateMessage
