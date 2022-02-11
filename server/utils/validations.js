const _ = require('lodash')

module.exports = {
  validateMockFaxForm,
}

function validateMockFaxForm(formFields) {
  let errors = []
  const phoneRegex = /^(\+1)([2-9]{1})([0-9]{2})([2-9]{1})([0-9]{6})$/
  const cuRegex = /\b(https?|ftp|file):\/\/[\-A-Za-z0-9+&@#\/%?=~_|!:,.;]*[\-A-Za-z0-9+&@#\/%=~_|]/

  const file = _.get(formFields, 'file', null)
  const fileName = _.get(file, 'originalFilename', null)
  const { name, to_phone, callback_url } = formFields.fields

  if (!file) errors.push('no file has been selected')

  const fnSplit = fileName.split('.')
  const fnsLen = fnSplit.length

  if (fileName && fnSplit[fnsLen - 1] !== 'pdf') errors.push('The file is not PDF')
  if (!name) errors.push('name cannot be empty')
  if (!phoneRegex.test(to_phone)) errors.push('Invalid number format')
  if (!cuRegex.test(callback_url)) errors.push('Invalid callback URL')

  return { errors, file, fileName, callback_url }
}
