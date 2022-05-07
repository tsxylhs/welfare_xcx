import crud from './builder'
import fly from './request'

var API = {}

API.user = crud('/v1/user')
API.address = crud('/v1/address')
API.lotteryStation = crud('/v1/lotteryStation')
API.awarding=crud('/v1/awarding')
API.lucky = crud('/v1/lucky')
API.lucky.generateLuckyData = function (param) {
  return fly.get('/v1/generateLuckyData', param)
}
API.lucky.checkLucky=function(param){
  return fly.post("/v1/lucky/check",param)
}
API.login = function (param) {
  return fly.post('/v1/user/login', param)
}
// API.books.updatebooks = function (param) {
//   return fly.post('/v1/book/update', param)
// }
// API.books.applylibrary = function (id) {
//   return fly.get('/v1/applylibrary/' + id)
// }

API.user.update = function (params) {
  return fly.put('/v1/user', params)
}

API.address.checked = function (params) {
  return fly.put('/v1/address/:id/checked', params)
}

export default API
