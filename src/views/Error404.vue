<template>
  <div class="errorImg">
    <img @click="goToHome" src="/img/404/error405.jpg" alt="访问页面不存在图片" />
  </div>
</template>
<script>
export default {
    methods: {
        goToHome(){
            this.$router.push("/layout")
        }
    },
};
</script>
<style lang="scss" scoped>
.errorImg{
    height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
}
</style>