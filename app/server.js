const hapi = require('@hapi/hapi')
const H2o2 = require('@hapi/h2o2')
const config = require('./config')
const storage = require('./storage')

const getCert = async () => {
  config.certificate = await storage.downloadFile('horizon-private.key')
  config.key = await storage.downloadFile('horizon-private.key')
  console.log('Certificate and key downloaded')
}

async function createServer () {
  await getCert()

  // Create the hapi server
  const server = hapi.server({
    port: config.port,
    routes: {
      validate: {
        options: {
          abortEarly: false
        }
      }
    },
    router: {
      stripTrailingSlash: true
    }
  })

  // Register the plugins
  await server.register(require('@hapi/inert'))
  await server.register(H2o2)
  await server.register(require('./plugins/router'))
  await server.register(require('blipp'))
  await server.register(require('./plugins/logging'))

  return server
}

module.exports = createServer
