const generatorObj = require('./generator1')

// const iterator = generatorObj.generator()
// const iterator = generatorObj.myGenerator([
//   'first',
//   'second',
//   'third',
//   'end'
// ])
const iterator = generatorObj.generatorEs5()

let res

res = iterator.next()
console.log(res) // { value: 'first', done: false }

res = iterator.next()
console.log(res) // { value: 'second', done: false }

res = iterator.next()
console.log(res) // { value: 'third', done: false }

res = iterator.next()
console.log(res) // { value: 'end', done: true } // 如果没有return，则 value 值为 undefined

res = iterator.next()
console.log(res) // { value: undefined, done: true }

// -----------------------------------
const uid = 1
const { getUserClasses, co, getUserClassesByAsync } = require('./generator2')
const iterator1 = getUserClasses(uid)

// const { value, done } = iterator1.next()

// 但是这么写也是一种嵌套
// value.then(res => {
//   console.log(res)
//   const { value, done } = iterator1.next(res)
//   value.then(res => {
//     console.log(res)
//     const { value, done } = iterator1.next(res)
//     console.log(value)
//   })
// })

// tj 有一个 co库，传入一个生成器对象，然后可以直接拿到最终结果
// 自己模拟一个co
co(iterator1).then(res => {
  console.log(res)
}).catch(err => {
  console.log(err)
})

// 可以发现
// generator + co异步迭代函数 === async函数 + await
// generator + yield + co 可以实现 async + await 的功能
getUserClassesByAsync(uid).then(res => {
  console.log(res)
}).catch(err => {
  console.log(err)
})