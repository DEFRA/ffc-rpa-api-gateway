// const wreck = require('@hapi/wreck')
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
      // https://hapi.dev/api/?v=21.3.0#response-object
      if (e) {
        console.log(`error is ${e}`)
        const response = h.response({ error: e.message }).type('application/json').code(500)
        return response
      } else {
        try {
          console.log(`Received response with status code ${res.statusCode} and content type ${res.headers['content-type']}.`)
          let body = ''
          res.on('data', chunk => {
            body += chunk.toString()
          })

          return res.on('end', () => {
            console.log(`Payload is ${body}.`)
            const response = h.response(body).type(res.headers['content-type']).code(res.statusCode)
            return response
          })
        } catch (e) {
          console.log(`Cannot parse response - ${e}`)
          const response = h.response({ error: e }).type('application/json').code(500)
          return response
        }
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
