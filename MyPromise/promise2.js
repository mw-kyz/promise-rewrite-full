// 处理异步和多次调用的问题（多次调用不等于链式调用）

const PENDING = 'PENDING',
      FULFILLED = 'FULFILLED',
      REJECTED = 'REJECTED'

class MyPromise2 {
  constructor (executor) {
    this.status = PENDING
    this.value = undefined
    this.reason = undefined

    // 收集成功回调函数，用于发布订阅（异步执行resolve/reject，多个promise.then）
    this.onFulfilledCallbacks = []
    // 收集失败回调函数，用于发布订阅（异步执行resolve/reject，多个promise.then）
    this.onRejectedCallbacks = []
    
    const resolve = value => {
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
    // 如果状态为FULFILLED，说明已经resolve了，直接执行成功回调
    if (this.status === FULFILLED) {
      onFulfilled(this.value)
    }
    // 如果状态为REJECTED，说明已经reject了，直接执行失败回调
    if (this.status === REJECTED) {
      onRejected(this.reason)
    }
    // 如果状态为PENDING, 说明现在是异步状态，resolve和reject都尚未执行
    if (this.status === PENDING) {
      // 收集成功回调，订阅过程
      this.onFulfilledCallbacks.push(() => {
        onFulfilled(this.value)
      })
      // 收集失败回调，订阅过程
      this.onRejectedCallbacks.push(() => {
        onRejected(this.reason)
      })
    }
  }
}

module.exports = MyPromise2