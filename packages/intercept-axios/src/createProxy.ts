export type interceptAxiosProxyListStateType = "pending" | "done";

export interface interceptAxiosProxyListObjInterface {
  interceptAxiosId: string,
  path: string,
  method: string,
  props?: string,
  dateTime: number,
  state: interceptAxiosProxyListStateType,
  throttle?: number,
  isAllowRequest?: boolean,
  saveData?: any
}

export interface interceptAxiosProxyListDataInterface {
  config?: interceptAxiosProxyListObjInterface
}

export interface interceptAxiosProxyListInterface {
  [propName: string]: Array<interceptAxiosProxyListObjInterface>
}

const observableArray = new Set();
export const interceptAxiosObserve = (fn: Function) => observableArray.add(fn);

export const interceptAxiosProxy = (data: interceptAxiosProxyListDataInterface) => {

  const handle = {
    get: (target: object, name: PropertyKey, receiver: any) => {
      return Reflect.get(target, name, receiver);
    },
    set: (target: object | any, key: PropertyKey, value: any, receiver: any) => {
      const result = Reflect.set(target, key, value, receiver);
      observableArray.forEach((item: any) => item(target.config))
      return result;
    }
  }
  
  return new Proxy(data, handle)
}
