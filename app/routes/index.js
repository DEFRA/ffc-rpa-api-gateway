const wreck = require('@hapi/wreck')
const { rpaApi } = require('../config')

const proxyCall = () => {
  return {
    mapUri: (req) => {
      const query = req.url.search ? req.url.search : ''
      const authorization = req.headers.Authorization ? { callerid: req.headers.Authorization } : {}
      const uri = `${rpaApi}${req.url.pathname}${query}`
      console.log(`Proxying request to ${uri}`)
      return {
        uri,
        headers: {
          ...authorization
        }
      }
    },
    onResponse: async (e, res, req, h) => {
      const payload = await wreck.read(res, { json: true })
      const response = h.response(payload)
      console.log(`Proxying response from ${res.url}`)
      console.log(`Response status code: ${res.statusCode}`)
      console.log(`Response payload: ${JSON.stringify(payload)}`)
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
