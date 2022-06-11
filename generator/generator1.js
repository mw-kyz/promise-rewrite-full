/**
 * generator 生成器函数 -> 生成一个迭代器
 * function * 函数名 () {}
 * iterator 迭代器对象
 * yield 产出一个值 暂停标识
 */

function * generator () {
  yield 'first'
  yield 'second'
  yield 'third'

  return 'end'
}

// 自己实现

function * generator () {
  yield 'first'
  yield 'second'
  yield 'third'

  return 'end'
}

function myGenerator (arr) {
  let nextIdx = 0

  return {
    next: function () {
      return nextIdx < arr.length - 1
             ?
             { value: arr[nextIdx++], done: false }
             :
             { value: arr[nextIdx++] || undefined, done: true }
    }
  }
}

// 模拟 babel 将生成器函数转成 es5 的编译过程
function generatorEs5 () {
  const ctx = {
    current: 0,
    next: 0,
    done: false,
    finish () {
      this.done = true
    }
  }

  return {
    next () {
      return {
        value: generator$(ctx),
        done: ctx.done
      }
    }
  }
}

function generator$ (ctx) {
  while (true) {
    switch (ctx.current = ctx.next) {
      case 0:
        ctx.next = 1
        return 'first' // 写死，因为是编译之后的结果
      case 1:
        ctx.next = 2
        return 'second'
      case 2:
        ctx.next = 3
        return 'third'
      case 3:
        ctx.next = 4
        ctx.finish()
        return 'end'
      case 4:
        return undefined
    }
  }
}

module.exports = {
  generator,
  myGenerator,
  generatorEs5
}