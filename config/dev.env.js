var merge = require('webpack-merge')
var prodEnv = require('./prod.env')

module.exports = merge(prodEnv, {
  NODE_ENV: '"development"',
  baseURI: '"http://localhost:3001/api"',
  checkVersion: "'2.9.0'",
 // baseURI: '"https://lib.muchcharm.com/api"',
  // baseURI: '"https://mtms.letsit.vip/api"'
})
