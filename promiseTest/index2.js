// 处理异步和多次调用的问题
const MyPromise2 = require('../MyPromise/promise2.js')

let promise = new MyPromise2((resolve, reject) => {
  // 异步
  setTimeout(() => {
    resolve('success')
    // reject('fail')
    // 异步错误无法捕获，就算是原版Promise也捕获不了
    // throw new Error('出错了')
  }, 1000)
})

promise.then(value => {
  console.log('FulFilled1: ', value) // FulFilled1:  success
}, reason => {
  console.log('Rejected1: ', reason) // Rejected1:  fail
})
// 多次调用（多次调用不等于链式调用）
promise.then(value => {
  console.log('FulFilled2: ', value) // FulFilled2:  success
}, reason => {
  console.log('Rejected2: ', reason) // Rejected2:  fail
})