import { message } from "antd";
import axios, { type AxiosInstance, type AxiosResponse, type InternalAxiosRequestConfig } from "axios";
import { store } from "../../store";

const http: AxiosInstance = axios.create({
    baseURL: "https://www.demo.com",
    timeout: 5000
})

//请求拦截器
http.interceptors.request.use((config:InternalAxiosRequestConfig) => {
    console.log("config", config);
    const {token} = store.getState().authSlice;
    if (token) {
        //Authorization专门用来携带认证信息
        //Bearer表示的是一种认证类型，表示后面携带的是一个令牌
        config.headers['Authorization'] = `Bearer ${token}`
    }
    return config
})

//响应拦截器

http.interceptors.response.use((response:AxiosResponse) => {
    console.log("response", response);
    const res = response.data;
    if (res.code !== 200) {
        message.error(res.code + ":" + res.message);
        return Promise.reject(new Error(res.message))
    }
    return response.data
})

export default http