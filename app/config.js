const Joi = require('joi')

const schema = Joi.object({
  port: Joi.number().default(3000),
  env: Joi.string().default('development'),
  rpaApi: Joi.string().required(),
  certificate: Joi.string().allow(null, '').default(''),
  key: Joi.string().allow(null, '').default(''),
  passphrase: Joi.string().allow(null, '').default(''),
  isDev: Joi.boolean().default(false),
  connectionStr: Joi.string().when('useConnectionStr', { is: true, then: Joi.required(), otherwise: Joi.allow('').optional() }),
  storageAccount: Joi.string().required(),
  container: Joi.string().required(),
  certFolder: Joi.string().required(),
  useConnectionStr: Joi.boolean().default(false),
  createContainers: Joi.boolean().default(false)
})

const config = {
  port: process.env.PORT || 3000,
  env: process.env.NODE_ENV || 'development',
  rpaApi: process.env.RPA_API,
  certificate: process.env.CERTIFICATE || '',
  key: process.env.KEY || '',
  passphrase: process.env.PASSPHRASE || '',
  isDev: process.env.NODE_ENV === 'development',
  connectionStr: process.env.AZURE_STORAGE_CONNECTION_STRING,
  storageAccount: process.env.AZURE_STORAGE_ACCOUNT_NAME,
  container: 'store',
  certFolder: 'cert',
  useConnectionStr: process.env.AZURE_STORAGE_USE_CONNECTION_STRING,
  createContainers: process.env.AZURE_STORAGE_CREATE_CONTAINERS
}

const result = schema.validate(config, {
  abortEarly: false
})

if (result.error) {
  throw new Error(`The server config is invalid. ${result.error.message}`)
}

module.exports = result.value
