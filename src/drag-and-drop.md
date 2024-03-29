<!-- 记录一个常用的拖拽JavaScript函数 -->
<!-- 2022-11-04 -->

常写拖拽功能，封装了这一套比较通用的，特别说一下几点容易踩坑的：
- 拖拽选项里的`document: boolean`要考虑清楚，决定了鼠标移出目标元素是否还会继续触发拖拽事件
- 回调参数`DraggableData`单次移动(dx/xy)和累计偏移量(tx/ty)都返回了，考虑清楚需要用哪个
- `onStart`回调里返回`false`会中止拖拽流程，返回其它则会作为`onDrag`的参数

```ts
export interface DraggableData {
  /**
   * 单次拖动事件移动的距离[X]
   */
  dx: number,
  /**
   * 单次拖动事件移动的距离[Y]
   */
  dy: number,
  /**
   * 累计移动的距离[X]
   */
  tx: number,
  /**
   * 累计移动的距离[Y]
   */
  ty: number,
  /**
   * 相对el的坐标[X]
   */
  offsetX: number,
  /**
   * 相对el的坐标[Y]
   */
  offsetY: number,
}

export interface DraggableOptions<T = any> {
  onStart(event: MouseEvent, data: DraggableData): T
  onDrag(event: MouseEvent, data: DraggableData, truck: T): void
  onStop(event: MouseEvent): void,
  /**
   * 是否将move事件添加至document上
   */
  document: boolean
}

const noop = () => {}

const defaultOptions: DraggableOptions = {
  onStart: noop,
  onDrag: noop,
  onStop: noop,
  document: false,
};

const getDraggableData = (changes: Partial<DraggableData>): DraggableData => {
  const initialValue = {
    dx: 0,
    dy: 0,
    tx: 0,
    ty: 0,
    offsetX: 0,
    offsetY: 0,
  };
  return Object.assign(initialValue, changes);
};

/**
 * 获取相对目标元素的offsetX/Y；
 * ev.offsetX/Y是相对ev.target的，这会随着鼠标hover到的元素的变化而变化，有时我们不希望这样。
 * @param el 目标元素
 * @param ev 鼠标事件
 * @returns
 */
const getRealOffsetRect = (el: HTMLElement, ev: MouseEvent) => {
  const { left, top } = el.getBoundingClientRect();
  const x = ev.pageX - left;
  const y = ev.pageY - top;
  return [x, y];
};

/**
 * 使得元素可拖拽；考虑一下是否需要destroy
 * @param el
 * @param dragCallback
 * @param options
 */
export function draggable<T>(el: HTMLElement, draggableOptions: Partial<DraggableOptions<T>>) {
  const options = Object.assign({}, defaultOptions, draggableOptions);
  const moveTarget = options.document ? document.body : el;
  let lastX = 0;
  let lastY = 0;
  let initialX = 0;
  let initialY = 0;
  let truck: any = null;

  function onmousedown(ev: MouseEvent) {
    const [offsetX, offsetY] = getRealOffsetRect(el, ev);
    const ret = options.onStart(ev, getDraggableData({ offsetX, offsetY }));
    if (ret === false) {
      return;
    }
    truck = ret;
    lastX = ev.screenX;
    lastY = ev.screenY;
    initialX = ev.screenX;
    initialY = ev.screenY;
    moveTarget.addEventListener('mousemove', onmousemove);
    document.addEventListener('mouseup', onmouseup);
  }

  function onmousemove(ev: MouseEvent) {
    const { screenX, screenY } = ev;

    // 计算step使用screenX/Y，防止由于DOM的原因导致数值异常
    const dx = screenX - lastX;
    const dy = screenY - lastY;

    lastX = screenX;
    lastY = screenY;

    const tx = screenX - initialX;
    const ty = screenY - initialY;

    const { left, top } = el.getBoundingClientRect();
    const offsetX = ev.pageX - left;
    const offsetY = ev.pageY - top;

    options.onDrag(ev, { dx, dy, tx, ty, offsetX, offsetY }, truck);
  }

  function onmouseup(ev: MouseEvent) {
    options.onStop(ev);
    moveTarget.removeEventListener('mousemove', onmousemove);
    document.removeEventListener('mouseup', onmouseup);
  }

  el.addEventListener('mousedown', onmousedown);
}
```