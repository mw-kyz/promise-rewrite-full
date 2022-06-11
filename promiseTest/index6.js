// 实现 Promise.race 和 Promise.finally
const MyPromise6 = require('../MyPromise/promise6.js')

let p1 = new MyPromise6((resolve, reject) => {
  setTimeout(() => {
    resolve('success')
  }, 1000)
})

let p2 = new MyPromise6((resolve, reject) => {
  setTimeout(() => {
    reject('fail')
  }, 1500);
})

// race 方法的参数必须是可迭代对象，一般传入一个数组
// race 赛跑，谁先有结果，就拿谁的结果
// MyPromise6.race([p1, p2]).then(res => {
//   console.log(res)
// }).catch(err => {
//   console.log(err) // 参数类型错误可在此捕获，比如传入null、undefined等非迭代对象，就会报错
// })

// -----------------------------------
// finally 无论上一个 Promise 成功还是失败，都要走，并且回调无参数
// 正常走 finally 之后的 then或者catch
// 如果finally 内部有返回 promise 对象，且有延时处理，整个 finally 会等待
// 1、如果上一个和finally 里 return 的promise都是成功，取上一个promise的成功结果
// 2、如果上一个promise是成功，finally 里 return 的promise是失败，取失败的结果
// 3、如果上一个promise是失败，finally 里 return 的promise是成功，取失败的结果
// 4、如果上一个和finally 里 return 的promise都是失败，取finally 里 return 的promise的失败结果
// 总结，只要有失败，就取失败的结果，都失败，就取finally里失败的结果，都成功，就取上一个promise的成功的结果

// 1、如果上一个和finally 里 return 的promise都是成功，取上一个promise的成功结果
// MyPromise6.resolve('promise success').finally(() => {
//   console.log('finally')

//   return new MyPromise6((resolve, reject) => {
//     setTimeout(() => {
//       resolve('finally success')
//     }, 2000)
//   })
// }).then((res) => {
//   console.log('success: ' + res) // success: promise success
// }, err => {
//   console.log('error: ', err)
// })

// 2、如果上一个promise是成功，finally 里 return 的promise是失败，取失败的结果
// MyPromise6.resolve('promise success').finally(() => {
//   console.log('finally')

//   return new MyPromise6((resolve, reject) => {
//     setTimeout(() => {
//       reject('finally fail')
//     }, 2000)
//   })
// }).then((res) => {
//   console.log('success: ' + res)
// }, err => {
//   console.log('error: ', err) // error:  finally fail
// })

// 3、如果上一个promise是失败，finally 里 return 的promise是成功，取失败的结果
// MyPromise6.reject('promise fail').finally(() => {
//   console.log('finally')

//   return new MyPromise6((resolve, reject) => {
//     setTimeout(() => {
//       resolve('finally success')
//     }, 2000)
//   })
// }).then((res) => {
//   console.log('success: ' + res)
// }, err => {
//   console.log('error: ', err) // error:  promise fail
// })

// 4、如果上一个和finally 里 return 的promise都是失败，取finally 里 return 的promise的失败结果
MyPromise6.reject('promise fail').finally(() => {
  console.log('finally')

  return new MyPromise6((resolve, reject) => {
    setTimeout(() => {
      reject('finally fail')
    }, 2000)
  })
}).then((res) => {
  console.log('success: ' + res)
}, err => {
  console.log('error: ', err) // error:  finally fail
})

// 测试resolve里面传递一个返回 reject的Promise，会不会改变后面then的成功失败回调的执行，结论是会
// Promise.resolve(new Promise((resolve, reject) => {
//   reject(111)
// })).then((res) => {
//   console.log('success', res)
// }).catch(err => {
//   console.log('fail', err) // 走这里
// })