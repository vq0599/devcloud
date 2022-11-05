<!-- 给订阅发布函数添加类型推导 -->
<!-- 2022-11-05 -->

想着挺简单，打算自己随意实现个。发现没有类型推导有些别扭，于是搜了搜资料结合自己使用习惯改进了一下，试试吧~
（折腾了挺久，早知道直接找个 Library 用了。。。）

```ts
type AnyFunction = (...args: any[]) => any;

export class Emitter<T extends Record<keyof T, AnyFunction>> {
  store: { [K in keyof T]?: Array<T[K]> } = {};
  on<K extends keyof T>(event: K, callback: T[K]) {
    this.store[event] = (this.store[event] || []).concat(callback);
  }
  off<K extends keyof T>(event: K, callback: T[K]) {
    this.store[event] = (this.store[event] || []).filter(
      (cb) => cb !== callback
    );
  }
  emit<K extends keyof T>(event: K, ...args: Parameters<T[K]>) {
    const callbacks = this.store[event];
    callbacks?.forEach((cb) => {
      cb.call(undefined, ...args);
    });
  }
}

interface EventMap {
  drag: (id: number) => void;
}

export const emitter = new Emitter<EventMap>();

// OK!
emitter.emit('drag', 63307);

// Argument of type 'string' is not assignable to parameter of type 'number'.
emitter.emit('drag', '63307');

// Argument of type '(id: string) => void' is not assignable to parameter of type '(id: number) => void'.
emitter.on('drag', (id: string) => {
  console.log(id);
});
```
