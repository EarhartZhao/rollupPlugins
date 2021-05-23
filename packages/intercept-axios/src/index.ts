/*
  拦截Axios请求(axios)，实现接口pending后统一处理接口。
  1. 调用接口时，传递一组接口的唯一值  (如果想要在跳转回页面时得到之前接口pending的数据，推荐传递页面的 name 值)
     传递接口路由，传递接口参数，默认为空
*/

import { AxiosRequestConfig, CancelTokenSource } from 'axios'

import { interceptAxiosObserve, interceptAxiosProxy, interceptAxiosProxyListDataInterface, interceptAxiosProxyListObjInterface } from './createProxy'

declare module 'axios' {
  export interface AxiosRequestConfig {
    /**
     * @description interceptAxios插件 每组数据唯一标识
     */
    interceptAxiosId?: string | any;
  }
}

interface InterceptAxiosOptionInterface {
  throttle?: number,                //是否开启节流，单位ms， 默认500ms
  isSameProps?: boolean,             //props 是否作为判断相同请求的依据
  isSaveResponseData?: boolean,     //是否缓存数据， 默认开启
  axiosSource?: CancelTokenSource,  //axios取消请求函数， 该功能以删除
}

const proxyOptions = (options: AxiosRequestConfig, throttle: number): interceptAxiosProxyListObjInterface => {
  let optionsObj: any = {}
  optionsObj.interceptAxiosId = turnString(options.interceptAxiosId);
  optionsObj.path = options.url;
  optionsObj.props = options.hasOwnProperty('data') ? options.data || '' : '';
  optionsObj.method = options.method;
  optionsObj.dateTime = Date.now();
  optionsObj.state = "pending";
  optionsObj.throttle = throttle;
  optionsObj.isAllowRequest = true;
  return optionsObj;
}

const turnString = (data: any):string => typeof (data) === 'string' ? data : String(data);

class interceptAxios {
  isSaveResponseData?: boolean;
  isSameProps?: boolean;
  throttle: number;
  axiosSource?: CancelTokenSource | any;  // 以删除该功能
  private list: object;
  private AxiosRequestROProxy: interceptAxiosProxyListDataInterface;

  constructor(options: InterceptAxiosOptionInterface) {
    this.isSaveResponseData = options.isSaveResponseData || true;
    this.throttle = options.throttle || 500;
    this.axiosSource = options.axiosSource || null;
    this.isSameProps = options.isSameProps || true;
    this.list = {};
    this.AxiosRequestROProxy = interceptAxiosProxy({})
    interceptAxiosObserve(this.AxiosRequestROFunc)
  }

  AxiosRequestROFunc = (config: interceptAxiosProxyListObjInterface): any => {
    // 观察者 观察 AxiosRequestROProxy 对象发生变化，动态改变 list 数据

    if (!this.list.hasOwnProperty(config.interceptAxiosId)) return this.list[config.interceptAxiosId] = [{ ...config }]

    const sameListArr = this.sameListArr(config)

    if (sameListArr.length === 0) return this.list[config.interceptAxiosId].push(config)

    const intervalTime = config.dateTime - sameListArr[0].dateTime;

    if (intervalTime > this.throttle && sameListArr[0].state === "done") {
      sameListArr[0].state = "pending";
      sameListArr[0].isAllowRequest = true;
    } else {
      sameListArr[0].isAllowRequest = false;
    }
  }

  interceptAxiosList = () => this.list;

  private judegSame = (ele: interceptAxiosProxyListObjInterface, config: interceptAxiosProxyListObjInterface) => ele.path === config.path && ele.method === config.method && ele.props === config.props;
  private sameListArr = (config: interceptAxiosProxyListObjInterface) => this.list[config.interceptAxiosId].filter((ele: any) => this.judegSame(ele, config))

  response = (RO: AxiosRequestConfig, data: any): any => {

    try {
      const config = proxyOptions(RO, this.throttle)

      if (!this.list.hasOwnProperty(config.interceptAxiosId)) throw new Error('interceptAxiosError: response no data');

      const sameListArr = this.sameListArr(config)

      if (sameListArr.length === 0) throw new Error('interceptAxiosError: response no same data');

      sameListArr[0].state = "done";
      sameListArr[0].dateTime = Date.now();
      sameListArr[0].isAllowRequest = true;

      if (this.isSaveResponseData) sameListArr[0].saveData = data;

      return data;

    } catch (error) {
      return data;
    }
  }

  request = async (RO: AxiosRequestConfig) => {

    this.AxiosRequestROProxy.config = proxyOptions(RO, this.throttle)

    // RO.cancelToken = this.axiosSource.token;

    return await (this.requestConfig(RO))
  }

  requestConfig = (RO: AxiosRequestConfig) => {
    return new Promise((resolve, reject) => {
      if (!this.list.hasOwnProperty(RO.interceptAxiosId)) return reject('errror data')

      let config = proxyOptions(RO, this.throttle)

      const sameListArr = this.sameListArr(config)
      if (sameListArr.length === 0) return reject('errror data')

      /*
        以下情况将返回配置:

        1. 第一次请求:                 isAllowRequest = true,  intervalTime < throttle, state == 'pending', ✓  PS: dateTime = Date.now()
        2. 第N次 < throttle 内请求:    isAllowRequest = false, intervalTime < throttle, state == 'pending', ✗
        3. 第N+1次 >= throttle 内请求: isAllowRequest = true,  intervalTime > throttle, state == 'done',    ✓  PS: dateTime = Date.now()

        1. isAllowRequest:true,  intervalTime < throttle, state == 'pending' ✓
        2. isAllowRequest:false, intervalTime < throttle, state == 'pending' ✗
        3. isAllowRequest:false, intervalTime > throttle, state == 'pending' ✗
        4. isAllowRequest:true,  intervalTime < throttle, state == 'done'    ✗
        5. isAllowRequest:true,  intervalTime > throttle, state == 'done'    ✓
      */

      if (sameListArr[0].isAllowRequest) {
        return resolve(RO);
      } else {
        // this.axiosSource.cancel('interceptAxiosCancel');
        return;
      }

    })
  }

}

export default (options: InterceptAxiosOptionInterface) => new interceptAxios(options);




