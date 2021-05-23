# intercept-axios

## 说明
### 拦截axios请求，以最小的破坏实现请求节流并缓存 | Intercept axios requests, achieve request throttling and cache with minimal damage

### 安装 | Install
`npm i intercept-axios -D`

### 配置 | Options
```
  throttle?: number,                //是否开启节流，单位ms， 默认500ms
  isSameProps?: boolean,             //props 是否作为判断相同请求的依据
  isSaveResponseData?: boolean,     //是否缓存数据， 默认开启
```

### 使用 | Use
```
import interceptAxios from 'intercept-axios'
import axios from 'axios'

Object.assign(axios.defaults, {
  baseURL: '',
  timeout: 600000,
});

const interceptAxiosInstance = interceptAxios({ throttle: 2000 });

axios.interceptors.request.use(
  (config) => {
    // return config;
    return interceptAxiosInstance.request(config);
  },
  (err) => {
    Promise.reject(err);
  }
);

axios.interceptors.response.use(
  (res) => {
    console.log("axios.interceptors.res", res);

    if (!res) {
      return Promise.reject();
    }
    return interceptAxiosInstance.response(res.config, res.data.data);
  },
  (err) => {
    console.log('axios error', err)
    if (err.message === 'interceptAxiosCancel') return;
  }
);

export { axios };
```