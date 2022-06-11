// 解决链式调用的问题，外加实现catch
const MyPromise3 = require('../MyPromise/promise3.js')

// 处理异步和多次调用的问题
let promise = new MyPromise3((resolve, reject) => {
  resolve('resolve')
  // reject('fail')
})

// 通过 return 传递结果
promise.then(value => {

  console.log('first' + value) // first resolve
  return 'second' + value // 普通值
}).then(value => {

  console.log(value) // second resolve
})

// 通过新的 promise resolve 结果
promise.then(value => {

  console.log('first' + value) // first resolve
  return value // 普通值
}).then(value => {

  console.log('second' + value) // second resolve
  return new MyPromise3((resolve, reject) => {
    setTimeout(() => {
      resolve(value)
    }, 2000)
  })
}).then(value => {
  console.log('third' + value) // third resolve
})

// 通过新的 promise reject
promise.then(value => {

  console.log('first' + value) // first resolve
  return value // 普通值
}).then(value => {

  console.log('second' + value) // second resolve
  return new MyPromise3((resolve, reject) => {
    setTimeout(() => {
      reject('ERROR')
    }, 2000)
  })
}).then(value => {
  console.log('third' + value) // 不执行
}, reason => {
  console.log(reason) // ERROR
})

// then 走了失败的回调函数之后，再走then
promise.then(value => {

  console.log('first' + value) // first resolve
  return value // 普通值
}).then(value => {

  console.log('second' + value) // second resolve
  return new MyPromise3((resolve, reject) => {
    setTimeout(() => {
      reject('ERROR')
    }, 2000)
  })
}).then(value => {
  console.log('third' + value) // 不执行
}, reason => {
  console.log(reason) // ERROR
  // 默认return undefined
}).then(value => {
  console.log(value) // undefined，因为上一个then没有返回值
}, reason => {
  console.log(reason) // 不执行
})

// then 中使用 throw Error
promise.then(value => {

  console.log('first' + value) // first resolve
  return value // 普通值
}).then(value => {

  console.log('second' + value) // second resolve
  return new MyPromise3((resolve, reject) => {
    setTimeout(() => {
      reject('ERROR')
    }, 2000)
  })
}).then(value => {
  console.log('third' + value) // 不执行
}, reason => {
  console.log(reason) // ERROR
  // 默认return undefined
}).then(value => {
  console.log(value) // undefined
  throw new Error('手动抛出错误')
}, reason => {
  console.log(reason) // 不执行
}).then(value => {
  console.log(value) // 不执行
}, reason => {
  console.log(reason) // 手动抛出错误
})

// Promise嵌套
promise.then(() => {
  return new MyPromise3((resolve, reject) => {
    resolve(new MyPromise3((resolve, reject) => {
      resolve(new MyPromise3((resolve, reject) => {
        resolve(111)
      }))
    }))
  })
}).then(value => {
  console.log(value) // 111
})
promise.then(() => {
  return new MyPromise3((resolve, reject) => {
    resolve(new MyPromise3((resolve, reject) => {
      reject(new MyPromise3((resolve, reject) => {
        resolve(111)
      }))
    }))
  })
}).then(value => {
  console.log(value) // 不执行
}, reason => {
  console.log('fail', reason) // 打印一个promise对象，因为源码层面reject的结果不会进行递归处理，所以无法拿到promise最后的值
})

// 空的then
promise.then().then().then(value => {
  console.log('success: ', value) // success: resolve
}, reason => {
  console.log('fail: ', reason)
})

// 用catch 捕获异常
promise.then(value => {

  console.log('first' + value) // first resolve
  return value // 普通值
}).then(value => {

  console.log('second' + value) // second resolve
  return new MyPromise3((resolve, reject) => {
    setTimeout(() => {
      reject('ERROR')
    }, 2000)
  })
}).then(value => {
  console.log('third' + value) // 不执行
}, reason => {
  console.log(reason) // ERROR
  // 默认return undefined
}).then(value => {
  console.log(value) // undefined
  throw new Error('手动抛出错误')
}, reason => {
  console.log(reason) // 不执行
}).then(value => {
  console.log(value) // 不执行
}
// , reason => {
//   console.log('then:', reason) // then 手动抛出错误
// }
)
.catch(reason => {
  console.log('catch:', reason) // catch: 手动抛出错误，如果上个then传了失败回调，这里就不走
  return 'catch error'
}).then(value => {
  console.log('then: ', value) // then: catch error 
})
// catch 在 Promise 的源码层面上就是一个then， catch也是遵循 then的运行原则

// 成功的条件
// then return 普通的 javascript value
// then return 新的promise成功态的结果 value
// 失败的条件
// then return 新的promise失败态的原因 reason
// then 抛出了异常 throw new Error

// promise 链式调用
// javascript return this
// then 不具备this ，需要返回一个新的 Promise，以达到链式调用

// 将返回值伪造为promise对象
const promise111 = new MyPromise3((resolve, reject) => {
  resolve(111)
})

promise111.then(res => {
  console.log(res) // 111
  return {
    // 故意钻源码的空子，让它误判断返回是一个promise对象，这会导致后面的then不执行，因为一直是 PENDING 状态
    // 源码中执行到 then.call(...) 就结束了，走不到 then 的回调参数里面（因为这个假的 then 没有回调参数，如果是真的 then，即使没有传回调参数，源码里也会自动生成回调参数，就算假的 then 有回调参数，也没有执行回调参数的逻辑，所以传了也相当于没传），所以也无法更改状态，一直是 PENDING，所以后面的真then的回调参数无法执行
    then: function () {
      console.log(res, 222) // 111, 222
    }
  }
}).then(resolve => {
  console.log(resolve, 333) // 无法执行
}, err => {
  console.log(err, 666) // 无法执行
})

// 测试一开始就 resolve 一个 Promise 对象
const p = new MyPromise3((resolve, reject) => {
  resolve(new MyPromise3((resolve, reject) => {
    resolve(new MyPromise3((resolve, reject) => {
      setTimeout(() => {
        resolve('success')
      }, 1000)
    }))
  }))
})

p.then((res) => {
  console.log(res)
})