// 实现promisify和promisifyAll工具方法

// const fs = require('fs')
// const { resolve } = require('path')


// fs.readFile(resolve(__dirname, '../data/user.json'), 'utf8', function (err, data) {
//   if (err) {
//     console.log(err)
//   }

//   console.log(data)
// })

// ------------------------------
// 上面是普通的回调写法
// 加上 .promises 后缀，可以使 fs 上的所有方法 promise 化
// const fs = require('fs').promises

// const { resolve } = require('path')


// fs.readFile(resolve(__dirname, '../data/user.json'), 'utf8').then((res) => {
//   console.log(res)
// }).catch((err) => {
//   console.log(err)
// })

// ------------------------------
// 早期是使用 bluebird 的第三方库
// const fs = require('fs')
// const bluebird = require('bluebird')

// const { resolve } = require('path')

// // 使用promisify方法进行 promise 化
// const readFile = bluebird.promisify(fs.readFile)

// readFile(resolve(__dirname, '../data/user.json'), 'utf8').then((res) => {
//   console.log(res)
// }).catch((err) => {
//   console.log(err)
// })

// -----------------------------------
// 使用 node 官方提供的 util 库
// const fs = require('fs')
// const util = require('util')

// const { resolve } = require('path')

// // 使用promisify方法进行 promise 化
// const readFile = util.promisify(fs.readFile)

// readFile(resolve(__dirname, '../data/user.json'), 'utf8').then((res) => {
//   console.log(res)
// }).catch((err) => {
//   console.log(err)
// })

// 使用自己封装的 promisify 函数
const fs = require('fs')
const myUtil = require('../MyPromise/promiseUtil')

const { resolve } = require('path')

// 使用 promisify 方法进行 promise 化
const readFile = myUtil.promisify(fs.readFile)

// readFile(resolve(__dirname, '../data/user.json'), 'utf8').then((res) => {
//   console.log(res)
// }).catch((err) => {
//   console.log(err)
// })

// 使用 promisifyAll 方法对 fs 对象的方法全部 promise 化
const newFs = myUtil.promisifyAll(fs)

newFs.readFileAsync(resolve(__dirname, '../data/user.json'), 'utf8').then((res) => {
  console.log(res)
}).catch((err) => {
  console.log(err)
})