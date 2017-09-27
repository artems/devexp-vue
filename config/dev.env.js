var merge = require('webpack-merge')
var prodEnv = require('./prod.env')

module.exports = merge(prodEnv, {
  NODE_ENV: '"development"',
  MAIN_API: JSON.stringify({
    // prefix: 'http://localhost:8080/'
    prefix: 'https://codereview.qloud.yandex-team.ru/'
  })
})
