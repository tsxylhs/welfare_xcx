import crud from './builder'
import fly from './request'

var API = {}

API.user = crud('/v1/user')
API.address = crud('/v1/address')
API.lotteryStation = crud('/v1/lotteryStation')

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
