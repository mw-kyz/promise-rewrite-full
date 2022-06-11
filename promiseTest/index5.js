// 实现 Promise.all 和 Promise.allSettled
const MyPromise5 = require('../MyPromise/promise5.js')

const fs = require('fs')
const { resolve } = require('path')

function readFile (path) {
  return new MyPromise5((resolve, reject) => {
    fs.readFile(path, 'utf8', function (err, data) {
      if (err) {
        reject(err)
      }

      resolve(data)
    })
  })
}

const id = 1

let dataArr = []

dataArr.push(id)

// readFile(resolve(__dirname, '../data/user.json')).then((res) => {
//   dataArr.push(res)

//   readFile(resolve(__dirname, '../data/class.json')).then((res) => {
//     dataArr.push(res)

//     console.log(dataArr)
//   })
// })

// 用 Promise.all 实现上述功能
// 方法的参数必须是可迭代对象，一般传入一个数组
// 数组中每个 Promise 必须全部成功才是成功，只要有一个失败，就失败
// MyPromise5.all([
//   1,
//   readFile(resolve(__dirname, '../data/user.json')),
//   readFile(resolve(__dirname, '../data/class.json'))
// ]).then(res => {
//   console.log(res)
// }).catch(err => {
//   console.log(err) // 参数类型错误可在此捕获，比如传入null、undefined等非迭代对象，就会报错
// })


// ---------------------------------------------

let p1 = new MyPromise5((resolve, reject) => {
  setTimeout(() => {
    resolve('success')
  }, 1000)
})

let p2 = new MyPromise5((resolve, reject) => {
  reject('fail')
})

// allSettled 方法的参数必须是可迭代对象，一般传入一个数组
// 和all对比，比较贪心，失败和成功的结果都会返回，按照原数组顺序返回
MyPromise5.allSettled([p1, p2]).then(res => {
  console.log(res)
  // 结果如下
  // [
  //   { status: 'fulfilled', value: 'success' },
  //   { status: 'rejected', value: 'fail' }
  // ]
}).catch(err => {
  console.log(err) // 参数类型错误可在此捕获，比如传入null、undefined等非迭代对象，就会报错
})