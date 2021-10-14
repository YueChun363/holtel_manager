<template>
  <div class="main">
    <!-- 左侧导航 -->
    <div
      class="left"
      :style="{
        backgroundColor: themeColor,
        width: isCollapse ? 'auto' : '200px',
      }"
    >
      <div class="logo">YC酒店管理系统</div>
      <el-menu
        default-active="2"
        class="el-menu-vertical-demo"
        :background-color="themeColor"
        text-color="#fff"
        active-text-color="#ffd04b"
        :collapse="isCollapse"
        style="border: none"
        router
      >
        <el-submenu index="1">
          <template slot="title">
            <i class="el-icon-user"></i>
            <span>账号管理</span>
          </template>
          <!-- v-if里面不用给this.$store，要注意 -->
          <el-menu-item
            v-if="$store.state.admin.admin.roleId === 1"
            index="/layout/role"
            >角色管理</el-menu-item
          >
          <el-menu-item index="/layout/admin">账号管理</el-menu-item>
        </el-submenu>
        <el-submenu index="2">
          <template slot="title">
            <i class="el-icon-school"></i>
            <span>房间管理</span>
          </template>
          <el-menu-item
            v-if="$store.state.admin.admin.roleId === 1"
            index="/layout/roomType"
            >类型管理</el-menu-item
          >
          <el-menu-item index="/layout/room">房间管理</el-menu-item>
        </el-submenu>
        <el-submenu index="3">
          <template slot="title">
            <i class="el-icon-s-custom"></i>
            <span>客户管理</span>
          </template>
          <el-menu-item index="/layout/guest">客户管理</el-menu-item>
        </el-submenu>
        <el-submenu index="4" v-if="$store.state.admin.admin.roleId === 1">
          <template slot="title">
            <i class="el-icon-setting"></i>
            <span>权限管理</span>
          </template>
          <el-menu-item index="/layout/permission">权限管理</el-menu-item>
        </el-submenu>
      </el-menu>
    </div>
    <!-- end左侧导航 -->
    <!-- 右侧内容 -->
    <div class="right">
      <!-- 顶部导航 -->
      <div class="nav" :style="{ backgroundColor: themeColor }">
        <div class="icon" @click="isCollapse = !isCollapse">
          <i :class="isCollapse ? 'el-icon-s-unfold' : 'el-icon-s-fold'"></i>
        </div>
        <!-- router导航栏开启路由模式 -->
        <el-menu
          :default-active="activeIndex2"
          class="el-menu-demo"
          mode="horizontal"
          :background-color="themeColor"
          text-color="#fff"
          active-text-color="#ffd04b"
          router
        >
          <el-menu-item index="/layout"
            ><i class="el-icon-s-home"></i>Home</el-menu-item
          >
          <el-menu-item index="/layout/message"
            ><i class="el-icon-s-comment"></i>Message</el-menu-item
          >
          <el-menu-item index="/layout/email"
            ><i class="el-icon-message"></i>Email</el-menu-item
          >
          <el-submenu index="1">
            <template slot="title"><i class="el-icon-help"></i>Theme</template>
            <el-menu-item
              @click="changeTheme(item.value)"
              v-for="(item, index) in theme"
              :key="index"
              >{{ item.name }}</el-menu-item
            >
          </el-submenu>
          <el-submenu index="2">
            <template slot="title"
              ><i class="el-icon-user-solid"></i>{{ admin.name }}</template
            >
            <el-menu-item index="/layout/mine">个人中心</el-menu-item>
            <el-menu-item index="/layout/resetPwd">修改密码</el-menu-item>
            <el-menu-item @click="exit">退出系统</el-menu-item>
          </el-submenu>
        </el-menu>
      </div>
      <!-- end顶部导航 -->
      <!-- 内容区域 -->
      <div class="content">
        <!-- 路由视图 -->
        <router-view></router-view>
      </div>
      <!-- end内容区域 -->
    </div>
    <!-- end右侧内容 -->
  </div>
</template>
<script>
//导入vuex的映射函数
import { mapState, mapMutations } from "vuex";
export default {
  data() {
    return {
      activeIndex2: "1",
      //主题颜色:先从缓存中获取，没有就给默认值
      themeColor: localStorage.getItem("theme") || "#101f30",
      //是否折叠左边导航
      isCollapse: false,
    };
  },
  created() {
    //获取当前登录用户的名称
    let loginId = localStorage.getItem("loginId");
    //如果用户名为空
    if (!loginId) {
      this.$router.push("/login");
    }
    //根据用户名获取用户信息
    this.$get("/Admin/Getone", { loginId }).then((res) => {
      this.setAdmin(res);
      //在浏览器缓存中保存当前用户的角色编号，用于router里面的权限控制使用
      localStorage.setItem("roleId", res.roleId);
    });
  },
  mounted() {},
  computed: {
    ...mapState("theme", ["theme"]),
    ...mapState("admin", ["admin"]),
  },
  methods: {
    //导入vuex登录账户的方法
    ...mapMutations("admin", ["setAdmin"]),
    //切换主题方法
    changeTheme(color) {
      //设置当前主题颜色
      this.themeColor = color;
      //保存主题颜色到缓存
      localStorage.setItem("theme", color);
    },
    //退出
    exit() {
      //清除浏览器缓存
      sessionStorage.removeItem("token");
      localStorage.removeItem("loginId");
      localStorage.removeItem("loginPwd");
      // sessionStorage.clear()
      // localStorage.clear()
      this.$router.push("/login");
    },
  },
};
</script>
<style lang="scss" scoped>
.main {
  width: 100vw;
  height: 100vh;
  display: flex;
  //   左侧样式
  .left {
    // logo样式
    .logo {
      width: 90%;
      color: white;
      font-size: 18px;
      text-align: center;
      padding: 8px 0;
      border: 1px solid white;
      margin: 10px auto;
    }
  }
  //右侧样式
  .right {
    flex: 1;
    //顶部导航样式
    .nav {
      height: 60px;
      min-width: 700px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      .icon {
        padding-left: 5px;
        i {
          font-size: 20px;
          color: white;
        }
      }
    }
    .content {
      padding: 8px;
    }
  }
}
</style>