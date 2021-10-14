//mock使用流程：安装mock，编写对应接口地址的mockjs，在main.js引入mock文件夹
//然后indexjs引入各个mockjs，最后修改config里面的把'dev'改为'mock'

//mockjs即使是在关闭的情况下，也会对所有的请求接口进行监控，所以不太好，所以就要设置mockjs拦截的根路径解决这个问题
//这个问题需要去了解一下使用的方法


//把所有的mock全部统一进来，indexjs被执行时，会执行下面import的js
import './room'

