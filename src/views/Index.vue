<template>
  <div></div>
</template>

<script>
export default {
    async created(){
        //从浏览器缓存中获取登录名和密码
        let loginId = localStorage.getItem('loginId');
        let loginPwd = localStorage.getItem('loginPwd');
        if(!loginId||!loginPwd){
            this.$router.push('/login')
        }else{
            let {success, token } = await this.$get(
            "/Admin/Login",
            {
                loginId,
                loginPwd
            }
          );
          if (success) {
            sessionStorage.setItem("token", token);
            //将token信息放到请求头中
            this.$setToken();
            //跳转到后台管理
            this.$router.push('/layout')
          }else{
              //登录失败，跳转到登录页
            this.$router.push('/login')
          }
        }
        
    }
}
</script>
<style lang="scss" scoped>
</style>