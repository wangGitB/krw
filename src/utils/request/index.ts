// 引入配置
import type { HttpRequestConfig, HttpResponse } from 'uview-plus/libs/luch-request/index';
import type { IResponse } from './types';
import Request from 'uview-plus/libs/luch-request/index';
import { requestInterceptors, responseInterceptors } from './interceptors';

const http = new Request();

// 引入拦截器配置
export function setupRequest() {
  http.setConfig((defaultConfig: HttpRequestConfig) => {
    /* defaultConfig 为默认全局配置 */
    // #ifdef H5
    // 修改为使用代理
    if (import.meta.env.VITE_APP_PROXY === 'true') {
      defaultConfig.baseURL = import.meta.env.VITE_API_PREFIX;
    }
    else {
      defaultConfig.baseURL = import.meta.env.VITE_API_BASE_URL;
    }
    // #endif
    defaultConfig.header = {
      'Content-Type': 'application/json', // ✅ 强制 JSON 格式
    };
    return defaultConfig;
  });
  requestInterceptors(http);
  responseInterceptors(http);
}

export function request<T = any>(config: HttpRequestConfig): Promise<T> {
  return new Promise((resolve, reject) => {
    http.request(config).then((res: HttpResponse<IResponse<T>>) => {
      console.log('[ res ] >', res);
      console.log('res.data', res.data);

      // 检查响应数据结构
      if (res.data && 'result' in res.data) {
        const { result } = res.data;
        resolve(result as T);
      }
      else if (res.data && 'data' in res.data) {
        // 兼容后端返回 data 字段的情况
        const { data } = res.data as any;
        resolve(data as T);
      }
      else {
        // 如果没有 result 或 data 字段，则返回整个 res.data
        resolve(res.data as unknown as T);
      }
    }).catch((err: any) => {
      console.error('[ err ] >', err);
      reject(err);
    });
  });
}

export function get<T = any>(url: string, config?: HttpRequestConfig): Promise<T> {
  return request({ ...config, url, method: 'GET' });
}

export function post<T = any>(url: string, config?: HttpRequestConfig): Promise<T> {
  return request({ ...config, url, method: 'POST' });
}

export function upload<T = any>(url: string, config?: HttpRequestConfig): Promise<T> {
  return request({ ...config, url, method: 'UPLOAD' });
}

export function download<T = any>(url: string, config?: HttpRequestConfig): Promise<T> {
  return request({ ...config, url, method: 'DOWNLOAD' });
}

export default setupRequest;
