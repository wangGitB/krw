// 为 z-paging 组件声明类型
export class ZPaging {
  complete(_data: any[] | boolean): void {}
  reload(): void {}
  // 添加其他需要的方法
}

// 声明全局类型
declare global {
  const zPaging: new (...args: any[]) => ZPaging;
}
