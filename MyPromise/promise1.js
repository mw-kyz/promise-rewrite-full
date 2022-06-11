// 实现最基础的promise

const PENDING = 'PENDING',
      FULFILLED = 'FULFILLED',
      REJECTED = 'REJECTED'

class MyPromise1 {
  constructor (executor) {
    this.status = PENDING
    this.value = undefined
    this.reason = undefined
    
    const resolve = value => {
      // 只有 PENDING 时才能修改状态
      if (this.status === PENDING) {
        // 更改成功状态及赋值
        this.status = FULFILLED
        this.value = value
      }
    }

    const reject = reason => {
      // 只有 PENDING 时才能修改状态
      if (this.status === PENDING) {
        // 更改失败状态及赋值
        this.status = REJECTED
        this.reason = reason
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
  }
}

module.exports = MyPromise1