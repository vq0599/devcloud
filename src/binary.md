<!-- 必须要知道的编程基础知识 -->
<!-- 2022-03-05 -->
## 整型
| 类型 | 字节(Byte) | 位(Bit)| 范围 |
| :---: | :---: | :---: | :---: |
|`int16`| 2 |`2 * 8 = 16` | -2<sup>16 - 1</sup> ~ 2<sup>16 - 1</sup> - 1 |
|`int32`| 4 |`4 * 8 = 32` | -2<sup>32 - 1</sup> ~ 2<sup>32 - 1</sup> - 1 |
|`int64`| 8 |`8 * 8 = 64` | -2<sup>64 - 1</sup> ~ 2<sup>64 - 1</sup> - 1 |
- 一个字节是8位
- 无符号整型因为不需要符号位所以可表示的数会多一位

#### 为什么是`x - 1`次方？
二进制`x`位所能表示的最大（有符号）十进制数为`2`<sup>`x`</sup>` - 1`，但是由于第一位是**符号位**，所以就变成了`2`<sup>`x - 1`</sup>` - 1`。

#### 为什么最小值不需要减`1`
对于有符号整型而言，是存在`+0`和`-0`的，以`int16`位为例：
```cpp
0000 0000 0000 0000 // - 0
1000 0000 0000 0000 // + 0
```
但十进制里面没有`-0`这么一说，所以就把`-0`当作是最小负值`-2`<sup>`x - 1`</sup>，

#### `int`是几位的？
C++中`int`即为`int32`

#### `long`是几位的？
关于`long`，C标准没有规定其占用几个字节，只要求不短于`int`

## JS里的二进制
#### ArrayBuffer
`ArrayBuffer`是对**固定长度**的**连续**内存空间的引用。

```ts
const buffer = new ArrayBuffer(16);
console.log(buffer.byteLength) // 16
```
以上代码表示分配一个`16`字节的连续内存空间，并用`0`进行预填充。
```ts
const view = new Uint8Array(buffer);
console.log(view.length); // 16
console.log(view.byteLength); // 16
```
将 buffer 视为一个 8 位整数的序列，每位占 1 各字节，则可代表 16 位数。
```ts
const view = new Uint16Array(buffer);
console.log(view.length); // 8
console.log(view.byteLength); // 16
```
将 buffer 视为一个 16 位整数的序列，每位占 1 各字节，则可代表 8 位数。
![](https://zh.javascript.info/article/arraybuffer-binary-arrays/arraybuffer-views.svg)

### 特殊的Uint8ClampedArray
当数组元素越界时，Uint8Array会自动换算，而Uint8ClampedArray会固定取边界值。
```ts
const x = new Uint8ClampedArray([17, -45.3, 257]); // [17, 255, 0]

const x = new Uint8Array([17, -45.3, 257]); // [17, 211, 1]
```
注意，并不存在`Uint16ClampedArray`、`Uint32ClampedArray`，可别脑洞大开。

## 参考资料
- [https://zh.javascript.info/arraybuffer-binary-arrays](https://zh.javascript.info/arraybuffer-binary-arrays)