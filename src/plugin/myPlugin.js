import { done } from 'nprogress'
import { get, post, setToken } from '../util/request'

//定义一个插件
export default {
    //插件中必须包含一个install方法
    install: function (Vue) {
        //给Vue混入成员
        Vue.mixin({
            methods: {
                $get(url, params) {
                    return get(url, params)
                },
                $post(url, params) {
                    return post(url, params)
                },
                $setToken() {
                    //执行该方法就会将浏览器里面的token信息保存到axios请求头中
                    setToken()
                },
                //成功消息框
                $msg_s(message, duration = 2000) {
                    this.$message({
                        //显示关闭图标
                        showClose: true,
                        message,
                        type: 'success',
                        duration
                    });
                },
                //警告消息框
                $msg_w(message, duration = 2000) {
                    this.$message({
                        //显示关闭图标
                        showClose: true,
                        message,
                        type: 'warning',
                        duration
                    });
                },
                //错误消息框
                $msg_e(message, duration = 2000) {
                    this.$message({
                        //显示关闭图标
                        showClose: true,
                        message,
                        type: 'error',
                        duration
                    });
                },
                //确认框
                $con_f(message) {
                    return new Promise((resolve, reject) => {
                        this.$confirm(message)
                            .then(res => {
                                resolve()
                            })
                            .catch((_) => { });
                    })
                }
            },
        })
    }
}