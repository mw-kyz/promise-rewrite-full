// 实现最基本的 promise
const MyPromise1 = require('../MyPromise/promise1.js')

let promise = new MyPromise1((resolve, reject) => {
  // resolve('success')
  // reject('fail')
  throw new Error('出错了')
})

promise.then(value => {
  console.log('FulFilled: ', value) // FulFilled  success
}, reason => {
  console.log('Rejected', reason) // Rejected fail
})