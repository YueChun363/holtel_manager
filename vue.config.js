// 添加全局配置文件
const path = require('path')

module.exports = {
    //关闭eslint语法检查
    lintOnSave: false,
    //开发服务器相关的配置
    devServer: {
        //配置静态资源目录
        contentBase: path.join(__dirname, 'public'),
        //设置开发服务器的端口号
        port: 8848,
    },
    //配置webpack相关
    configureWebpack:{
        //解析
        resolve:{
            //配置路径别名
            alias:{
                //__dirname 指/src
                '@v':path.resolve(__dirname,'src/views'),
                '@c':path.resolve(__dirname,'src/components'),
            }
        }

    }
}