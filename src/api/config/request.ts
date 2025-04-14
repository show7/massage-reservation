// utils/request.ts
import API_CONFIG from "./api.config";
import { BASE_URL } from "./BASE_URL";

// 定义请求配置的类型
interface RequestOptions {
  url: string;
  method?:
    | "GET"
    | "OPTIONS"
    | "HEAD"
    | "POST"
    | "PUT"
    | "DELETE"
    | "TRACE"
    | "CONNECT";
  data?: any;
  header?: any;
  timeout?: number;
}

// 定义请求拦截器函数的类型
type RequestInterceptor = (config: RequestOptions) => RequestOptions;
// 定义响应拦截器函数的类型
type ResponseInterceptor = (res: any) => any;

// 将对象转换为查询字符串的辅助函数
function objectToQueryString(obj: any): string {
  const parts = [];
  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      parts.push(encodeURIComponent(key) + "=" + encodeURIComponent(obj[key]));
    }
  }
  return parts.join("&");
}

class Request {
  private static instance: Request;
  private baseUrl: string = BASE_URL; // 替换为实际的基础地址
  private interceptors: {
    request: RequestInterceptor;
    response: ResponseInterceptor;
  };

  private constructor() {
    this.interceptors = {
      request: (config) => config,
      response: (res) => res,
    };
  }

  public static getInstance(): Request {
    if (!Request.instance) {
      Request.instance = new Request();
    }
    return Request.instance;
  }

  public setRequestInterceptor(interceptor: RequestInterceptor): void {
    this.interceptors.request = interceptor;
  }

  public setResponseInterceptor(interceptor: ResponseInterceptor): void {
    this.interceptors.response = interceptor;
  }

  public request(options: RequestOptions): Promise<any> {
    const {
      url,
      method = "GET",
      data = {},
      header = {},
      ...extendParams
    } = options;
    let config: RequestOptions = {
      url: this.baseUrl + url,
      method,
      data,
      header,
      ...extendParams,
    };

    // 处理 DELETE 或 PUT 请求，将参数拼接到 URL 后面
    if (method === "DELETE" || method === "PUT") {
      const queryString = objectToQueryString(data);
      if (queryString) {
        config.url += (config.url.includes("?") ? "&" : "?") + queryString;
        config.data = {}; // 清空 data 对象，避免重复传递参数
      }
    }

    config = this.interceptors.request(config);

    return new Promise((resolve, reject) => {
      uni.request({
        ...config,
        success: (res) => {
          const processedRes = this.interceptors.response(res);
          resolve(processedRes);
        },
        fail: (err) => {
          reject(err);
        },
      });
    });
  }

  public sendRequestByKey(
    apiKey: string,
    data: any = {},
    header: any = {},
    extendParams: any = {}
  ): Promise<any> {
    const apiInfo = API_CONFIG.find((item) => item.key === apiKey);
    if (!apiInfo) {
      throw new Error(`未找到 key 为 ${apiKey} 的 API 配置`);
    }
    const { url, methods } = apiInfo;
    return this.request({
      url,
      method: methods.toUpperCase() as RequestOptions["method"],
      data,
      header,
      ...extendParams,
    });
  }
}

const requestInstance = Request.getInstance();

export default requestInstance;
