// 实现静态 reaolve 和 reject 方法

const PENDING = 'PENDING',
      FULFILLED = 'FULFILLED',
      REJECTED = 'REJECTED'

class MyPromise4 {
  constructor (executor) {
    this.status = PENDING
    this.value = undefined
    this.reason = undefined

    // 收集成功回调函数，用于发布订阅（异步执行resolve/reject，多个promise.then）
    this.onFulfilledCallbacks = []
    // 收集失败回调函数，用于发布订阅（异步执行resolve/reject，多个promise.then）
    this.onRejectedCallbacks = []
    
    const resolve = value => {
      // 如果直接 resolve 一个 Promise 对象
      if (value instanceof MyPromise4) {
        // 这里只需要调用一次then
        // 传入的成功回调为 resolve，如果接下来还是 Promise 对象，会再次触发此段逻辑，相当于递归
        value.then(resolve, reject)
        
        return
      }
      // 只有 PENDING 时才能修改状态
      if (this.status === PENDING) {
        // 更改成功状态及赋值
        this.status = FULFILLED
        this.value = value
        // 统一执行成功回调（如果有的话），发布过程
        this.onFulfilledCallbacks.forEach(fn => fn())
      }
    }

    const reject = reason => {
      // 只有 PENDING 时才能修改状态
      if (this.status === PENDING) {
        // 更改失败状态及赋值
        this.status = REJECTED
        this.reason = reason
        // 统一执行失败回调（如果有的话），发布过程
        this.onRejectedCallbacks.forEach(fn => fn())
      }
    }

    // 运行执行器函数时，如果捕获到错误，直接reject
    try {
      executor(resolve, reject)
    } catch (e) {
      reject(e)
    }
  }

  then (onFulfilled, onRejected) {
    // 防止空调用，比如 then().then()....
    // 如果onFulfilled存在，就继续，如果不存在，就需要将value传递下去，给下一个then
    onFulfilled = typeof onFulfilled === 'function' ? onFulfilled : (value => value)
    // 如果onRejected存在，就继续，如果不存在，就需要将reason传递下去，注意，需要使用抛出错误的方式，给下一个then或catch
    onRejected = typeof onRejected === 'function' ? onRejected : (reason => { throw reason })
    // onFulfilled 和 onRejected 不存在的话，重写的 onFulfilled 和 onRejected 如下，这样就可以传递给下一个 then 了
    // then(value => {
    //   return value
    // }, reason => {
    //   throw reason
    // })
    let promise2 = new MyPromise4((resolve, reject) => {
      // 如果状态为FULFILLED，说明已经resolve了，直接执行成功回调
      if (this.status === FULFILLED) {
        // 需使用异步，resolvePromise 才能拿到 promise2，源码肯定使用的微任务，此处用宏任务代替
        setTimeout(() => {
          try {
            // x有可能是普通值或者promise对象
            let x = onFulfilled(this.value)
            resolvePromise(promise2, x, resolve, reject)
          } catch (e) {
            reject(e)
          }
        }, 0)
      }
      // 如果状态为REJECTED，说明已经reject了，直接执行失败回调
      if (this.status === REJECTED) {
        // 需使用异步，resolvePromise 才能拿到 promise2，源码肯定使用的微任务，此处用宏任务代替
        setTimeout(() => {
          try {
            // x有可能是普通值或者promise对象
            let x = onRejected(this.reason)
            resolvePromise(promise2, x, resolve, reject)
          } catch (e) {
            reject(e)
          }
        }, 0)
      }
      // 如果状态为PENDING, 说明现在是异步状态，resolve和reject都尚未执行
      if (this.status === PENDING) {
        // 收集成功回调，订阅过程
        this.onFulfilledCallbacks.push(() => {
          // 此处不需使用setTimeout，因为本身是pending状态，只有resolve时此处才会执行
          // 但是 PromiseA+规范里是要的，所以加上
          setTimeout(() => {
            try {
              // x有可能是普通值或者promise对象
              let x = onFulfilled(this.value)
              resolvePromise(promise2, x, resolve, reject)
            } catch (e) {
              reject(e)
            }
          }, 0)
        })
        // 收集失败回调，订阅过程
        this.onRejectedCallbacks.push(() => {
          // 此处不需使用setTimeout，因为本身是pending状态，只有rejecte时此处才会执行
          // 但是 PromiseA+规范里是要的，所以加上
          setTimeout(() => {
            try {
              // x有可能是普通值或者promise对象
              let x = onRejected(this.reason)
              resolvePromise(promise2, x, resolve, reject)
            } catch (e) {
              reject(e)
            }
          }, 0)
        })
      }
    })

    return promise2
  }

  catch (errorCallback) {
    // catch 其实本身就是 then 的一个语法糖
    return this.then(null, errorCallback)
  }

  static resolve (value) {
    return new MyPromise4((resolve, reject) => {
      resolve(value)
    })
  }

  static reject (reason) {
    return new MyPromise4((resolve, reject) => {
      reject(reason)
    })
  }
}

function resolvePromise(promise2, x, resolve, reject) {
  // 防止以下情况发生
  // const promise2 = promise.then((value) => {
  //   return promise2
  // })
  if (promise2 === x) {
    return reject(new TypeError('Chaining cycle detected for promise #<MyPromise>'))
  }

  let called = false

  // x为对象或者函数，都有可能是promise对象
  if ((typeof x === 'object' && x !== null) || typeof x === 'function') {
    // x.then有可能在get中被拦截并抛出错误(Object.defineProperty)，此时直接reject
    try {
      let then = x.then // 可能被拦截抛出错误
      // then为函数，就可以认为x是promise对象
      if (typeof then === 'function') {
        // 需要通过call改变this指向
        then.call(x, (y) => {
          // 防止重复执行，但是不知道什么情况下会发生重复执行，只是 PromiseA+规范里面这么写了
          if (called) return
          called = true
          // 需递归处理，因为resolve里面可能也是一个promise对象
          resolvePromise(promise2, y, resolve, reject)
        }, (r) => {
          // 防止重复执行，但是不知道什么情况下会发生重复执行，只是 PromiseA+规范里面这么写了
          if (called) return
          called = true
          // reject不需要递归处理，如果reject一个promise对象，那就直接返回一个promise对象，原版Promise也是这么做的
          reject(r)
        })
      } else {
        // x 如果为普通值，直接resolve
        resolve(x)
      }
    } catch (e) {
      // 防止重复执行，但是不知道什么情况下会发生重复执行，只是 PromiseA+规范里面这么写了
      if (called) return
      called = true
      reject(e)
    }
  } else {
    // x 如果为普通值，直接resolve
    resolve(x)
  }
}

module.exports = MyPromise4