<!-- JavaScript里循环与异步相遇的几种情况 -->
<!-- 2022-10-12 -->
每当循环和异步遇到一起时，问题就会变得不太容易理解。在过去没有async/await的时代，我们不得不用计数器的方式去实现。以下列举一些常见的实现方式：

### “阻塞”执行
```ts
const arr = [1, 2, 3, 4, 5, 6]
const genRandom = () => {
  return new Promise(resolve => {
    setTimeout(() => resolve(Math.random()), 200);
  })
}
async function main() {
  for (let i = 0; i < arr.length; i++) {
    arr[i] += await genRandom()
  }
}
```
这是比较直观的方式，和同步类似一看就懂。缺点嘛也很明显，每次迭代都多余了不必要的阻塞等待时间，效率是个问题。

## Promise.all 和 Array.map
```ts
async function main() {
  await Promise.all(arr.map(async num => {
    return num + await genRandom()
  }));
}
```
在不关系执行顺序的情况下，这是一种比较理想的方式。

## 迭代依赖
`Array.reduce`场景下，每次迭代会都依赖于前一次，那应该怎么做呢？（这也是我记录下这个小问题的原因）
```ts
async function main() {
  const total = await arr.reduce(
    async(prev, current) => {
      // prev是上次return的结果，也是一个Promise，所以需要加上await
      return (await prev) + current + await genRandom()
    },
    0 // 这里的0直观的表达应该是Promise.resolve(0)
  ) 
  console.log(total); // 24.343225147972465
}
```