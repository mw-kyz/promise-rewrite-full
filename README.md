# promise-rewrite-full

#### 介绍
按照 Promise/A+ 规范重写 promise 及周边

promise.then

promise.catch

Promise.resolve

Promise.reject

Promise.all

Promise.allSettled

Promise.race 和 finally

promisify 和 promisifyAll 工具函数（将普通方法 promise 化）

模拟 babel 编译 generator

generator + co 实现 async await


测试：
```sh
// 测试 promise 的每个功能，可在 index.js 中修改测试文件
npm run dev
// 利用第三方库验证重写的 Promise 是否符合 Promise/A+ 规范
npm test
```