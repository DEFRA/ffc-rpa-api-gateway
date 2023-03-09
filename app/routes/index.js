const wreck = require('@hapi/wreck')
const https = require('https')
const { rpaApi, certificate, key, passphrase } = require('../config')

console.log('certificate', certificate)
console.log('key', key)
console.log('rpaApi', rpaApi)

const proxyCall = () => {
  return {
    passThrough: true,
    rejectUnauthorized: false,
    agent: new https.Agent({
      cert: certificate,
      key,
      passphrase
    }),
    mapUri: (req) => {
      const query = req.url.search ? req.url.search : ''
      const uri = `${rpaApi}${req.url.pathname}${query}`
      console.log(`Proxying to ${uri}`)
      return {
        uri
      }
    },
    onResponse: async (e, res, req, h) => {
      console.log(`type is ${typeof e}`)
      console.log(`error is ${e}`)
      console.log(`error json is ${JSON.stringify(e)}`)
      const payload = await wreck.read(res, { json: true })
      console.log(`Payload is ${JSON.stringify(payload)}`)
      const response = h.response(payload)
      return response
    }
  }
}

module.exports = [
  {
    method: 'GET',
    path: '/{path*}',
    options: {
      description: 'Get calls on RPA endpoints',
      notes: 'Returns data from RPA endpoint',
      tags: ['api']
    },
    handler: {
      proxy: proxyCall()
    }
  },
  {
    method: 'POST',
    path: '/{path*}',
    options: {
      description: 'Post calls on RPA endpoints',
      notes: 'Returns data from RPA endpoint',
      tags: ['api'],
      payload: { parse: false }
    },
    handler: {
      proxy: proxyCall()
    }
  },
  {
    method: 'PUT',
    path: '/{path*}',
    options: {
      description: 'Put calls on RPA endpoints',
      notes: 'Returns data from RPA endpoint',
      tags: ['api'],
      payload: { parse: false }
    },
    handler: {
      proxy: proxyCall()
    }
  }
]
