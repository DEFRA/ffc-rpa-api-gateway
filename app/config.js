const Joi = require('joi')

const schema = Joi.object({
  port: Joi.number().default(3000),
  env: Joi.string().default('development'),
  rpaApi: Joi.string().required(),
  isDev: Joi.boolean().default(false)
})

const config = {
  port: process.env.PORT || 3000,
  env: process.env.NODE_ENV || 'development',
  rpaApi: process.env.RPA_API,
  isDev: process.env.NODE_ENV === 'development'
}

const result = schema.validate(config, {
  abortEarly: false
})

if (result.error) {
  throw new Error(`The server config is invalid. ${result.error.message}`)
}

module.exports = result.value
