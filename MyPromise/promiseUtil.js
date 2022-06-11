// 实现promisify和promisifyAll工具方法

const MyPromise6 = require('./promise6.js')

// 对单个方法进行 promise 化
function promisify (fn) {

  return function (...args) {

    return new MyPromise6((resolve, reject) => {
      fn(...args, (error, data) => {
        if (error) {
          reject(error)

          return
        }

        resolve(data)
      })
    })
  }
}

// 对一个对象上的所有方法进行 promise 化
function promisifyAll(fns) {
  if (!fns || typeof fns !== 'object') {
    return
  }

  // Object.keys 只会遍历对象本身属性，不遍历原型
  Object.keys(fns).map(fnName => {
    // 只改造方法
    if (typeof fns[fnName] === 'function') {
      // 新加一个带 Async 后缀的同名方法，不影响原来的方法
      fns[fnName + 'Async'] = promisify(fns[fnName])
    }
  })

  return fns
}



module.exports = {
  promisify,
  promisifyAll
}