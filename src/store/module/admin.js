//当前登录账户模块
export default{
    //设置为私有命名空间
    namespaced:true,
    state:{
        admin:{
            role:{} //保护个人信息页不报错，设置空对象
        }
    },
    mutations:{
        //此方法用于对admin对象赋值
        setAdmin(state,val){
            state.admin = val
        }
    }
}