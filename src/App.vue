<template>
  <div id="app">
    <router-view />
  </div>
</template>


<style lang="scss">
// app里面不能加scoped，表示局部的样式
* {
  margin: 0;
  padding: 0;
  list-style: none;
  outline: none;
  text-decoration: none;
}
.flex {
  display: flex;
}
.j-c {
  justify-content: center;
}
.j-s {
  justify-content: space-between;
}
.a-c {
  align-items: center;
}
</style>
