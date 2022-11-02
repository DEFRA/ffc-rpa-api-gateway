module.exports = {
  port: process.env.PORT || 3000,
  env: process.env.NODE_ENV || 'development',
  rpaApi: process.env.CH_API,
  isDev: process.env.NODE_ENV === 'development'
}
