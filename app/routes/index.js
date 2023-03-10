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
      if(e) {
        console.log(`error is ${e}`)
        const response = h.response({ error: e.message }).type('application/json').code(500)
        return response
      } else {
        const payload = await wreck.read(res)
        console.log(`res is ${payload}`)
        const response = h.response(payload).type(res.headers["content-type"]).code(res.statusCode)
        return response
      }
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
