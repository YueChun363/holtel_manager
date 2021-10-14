<template>
  <div class="main">
    <!-- 背景画布 -->
    <canvas id="particle-canvas" width="1147" height="850"></canvas>
    <div class="content">
      <div class="login">
        <div class="title">岳纯的酒店管理系统</div>
        <el-form
          size="mini"
          :model="ruleForm"
          status-icon
          :rules="rules"
          ref="ruleForm"
          label-width="40px"
          class="demo-ruleForm"
        >
          <el-form-item label="账号" prop="loginId">
            <el-input v-model="ruleForm.loginId" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="密码" prop="loginPwd">
            <!-- 给input密码框添加回车登录事件 -->
            <el-input
              type="password"
              v-model="ruleForm.loginPwd"
              autocomplete="off"
              @keyup.native.enter="submitForm('ruleForm')"
            ></el-input>
          </el-form-item>
          <el-form-item>
            <el-checkbox v-model="ruleForm.checkMe">记住我</el-checkbox>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="submitForm('ruleForm')"
              >登录</el-button
            >
            <el-button @click="resetForm('ruleForm')">取消</el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
  </div>
</template>
<script>
//导入md5加密方法
import { strToMd5 } from "../util/md5";
//导入背景画布动画方法
import { start } from "../assets/js/login";
export default {
  mounted() {
    //调用背景动画方法
    start();
  },
  created() {
    //获取当前登录用户的名称
    let loginId = localStorage.getItem("loginId")
    //如果用户名存在就直接填入
    if (loginId) {
      this.ruleForm.loginId=loginId;
    }
  },
  data() {
    //验证密码的方法
    var validateLoginId = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入账号"));
      } else {
        callback();
      }
    };
    var validateLoginPwd = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入密码"));
      } else {
        callback();
      }
    };
    return {
      //表单数据
      ruleForm: {
        //登录名
        loginId: "",
        //登录密码
        loginPwd: "",
        checkMe: false,
      },
      //表单的验证数据
      rules: {
        loginId: [{ validator: validateLoginId, trigger: "blur" }],
        loginPwd: [{ validator: validateLoginPwd, trigger: "blur" }],
      },
    };
  },
  methods: {
    //表单的提交方法
    submitForm(formName) {
      this.$refs[formName].validate(async (valid) => {
        //判断表单数据是否验证成功
        if (valid) {
          //实现登录
          //对密码加密
          this.ruleForm.loginPwd = strToMd5(this.ruleForm.loginPwd);
          let { message, success, token } = await this.$get(
            "/Admin/Login",
            this.ruleForm
          );
          //判断登录是否成功
          console.log(message);
          if (success) {
            //服务器返回token
            //保存token，通常保存在浏览器缓存中
            sessionStorage.setItem("token", token);
            //将token信息放到请求头中
            this.$setToken();
            //在浏览器中保存登录名
            localStorage.setItem("loginId", this.ruleForm.loginId);
            //判断是否需要记住密码
            if (this.ruleForm.checkMe) {
              localStorage.setItem("loginPwd", this.ruleForm.loginPwd);
            }
            //跳转到后台管理
            this.$router.push("/layout");
          } else {
            this.$msg_e(message, 1000);
          }
        } else {
          // console.log("error submit!!");
          return false;
        }
      });
    },
    //表单重置方法
    resetForm(formName) {
      //重置表单
      this.$refs[formName].resetFields();
    },
  },
};
</script>
<style lang="scss" scoped>
// 背景画布样式
#particle-canvas {
  width: 100%;
  height: 100vh;
  background: linear-gradient(
    to bottom,
    rgb(10, 10, 50) 0%,
    rgb(60, 10, 60) 100%
  );
  vertical-align: middle;
}
.main {
  width: 100vw;
  height: 100vh;
  position: relative;
  .content {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    .login {
      width: 440px;
      border: 1px solid #ccc;
      padding: 20px;
      border-radius: 5px;
      .title {
        font-size: 18px;
        color: white;
        text-align: center;
        margin-bottom: 20px;
      }
    }
  }
}
</style>