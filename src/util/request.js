//***********请求相关的方法
import axios from 'axios'

//导入nprogress加载进度条
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
//导入BASE_URL
import {BASE_URL} from '../config/index'

//初始化一个axios对象
var instance = axios.create({
    //接口地址根路径
    baseURL: BASE_URL,
    //超时时间
    timeout: 30000,
});


// 添加请求拦截器
instance.interceptors.request.use(function (config) {
    // 在发送请求之前做些什么
    NProgress.start()
    return config;
}, function (error) {
    // 对请求错误做些什么
    NProgress.done()
    return Promise.reject(error);
});

// 添加响应拦截器
instance.interceptors.response.use(function (response) {
    // 对响应数据做点什么
    NProgress.done()
    return response;
}, function (error) {
    // 对响应错误做点什么
    NProgress.done()
    return Promise.reject(error);
});


//创建一个get请求方法
let get = async function (url, params) {
    let { data } = await instance.get(url, { params });
    return data;
}

//创建一个post请求方法
let post = async function (url, params) {
    let { data } = await instance.post(url, params); //post params 不需要包一层{}
    return data;
}

//创建一个保存token到请求头的方法
let setToken = function () {
    instance.defaults.headers.common['token'] = sessionStorage.getItem('token');
}

//导出get post方法
export { get, post, setToken };