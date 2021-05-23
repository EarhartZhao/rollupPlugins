import interceptAxios from 'intercept-axios'
import axios from 'axios'

// 配置axios
Object.assign(axios.defaults, {
  baseURL: '',
  timeout: 600000,
});

export const interceptAxiosInstance = interceptAxios({ throttle: 2000 });

// 拦截器
axios.interceptors.request.use(
  (config) => {
    // return config;
    return interceptAxiosInstance.request(config);

  },
  (err) => {
    // 请求错误时的动作
    Promise.reject(err);
  }
);

// 相应拦截器
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
