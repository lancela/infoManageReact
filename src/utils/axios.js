//axios的配置
import config from './config';
import axios from 'axios';
import qs from 'qs';

axios.defaults.baseURL=config.baseURL;
// 响应回来后拦截处理
// 每次响应都会进入这里
axios.interceptors.response.use((response)=>{
    // 封装返回的数据
    console.log(response);
    let res = {
        // 响应成功拦截
        ...response,
        data: response.data.data,
        status: response.data.status,
        statusText: response.data.message
      };
      return res;
},(err)=>{
    // 响应失败拦截
    return Promise.reject(err);
});
// 请求发送前拦截
axios.interceptors.request.use((config)=>{
    console.log(config);
    if(config.method==='post'){
        config.data= qs.stringify(config.data)
    }
    return config;
},(error)=>{
    return Promise.reject(error);
})



export default axios;