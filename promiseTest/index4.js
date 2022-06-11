// 实现静态 resolve 和 reject 方法
const MyPromise4 = require('../MyPromise/promise4.js')

// 处理异步和多次调用的问题
MyPromise4.resolve(new MyPromise4((resolve, reject) => {
  setTimeout(() => {
    resolve('success')
  }, 1000)
})).then(res => {
  console.log(res)
})

MyPromise4.reject('fail').catch(err => {
  console.log('fail', err) // fail fail
})

MyPromise4.reject(new MyPromise4((resolve, reject) => {
  console.log(111)
  reject('fail') // 一个处于 REJECTED 状态的 Promise对象
  // setTimeout(() => {
  //   reject('fail') // 一个处于 PENDING 状态的 Promise对象
  // }, 10)
})).catch(err => {
  console.log('fail', err) // 一个处于 REJECTED 状态的 Promise对象，原生Promise还会报错，UnhandledPromiseRejectionWarning: fail
})