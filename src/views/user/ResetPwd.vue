<template>
  <div style="width: 500px">
    <el-form
      size="mini"
      :model="ruleForm"
      status-icon
      :rules="rules"
      ref="ruleForm"
      label-width="80px"
      class="demo-ruleForm"
    >
      <el-form-item label="原始密码" prop="oldLoginPwd">
        <el-input
          type="password"
          v-model="ruleForm.oldLoginPwd"
          autocomplete="off"
        ></el-input>
      </el-form-item>
      <el-form-item label="最新密码" prop="newLoginPwd">
        <el-input
          type="password"
          v-model="ruleForm.newLoginPwd"
          autocomplete="off"
        ></el-input>
      </el-form-item>
      <el-form-item label="确认密码" prop="loginPwd2">
        <el-input
          v-model="ruleForm.loginPwd2"
          autocomplete="off"
          type="password"
        ></el-input>
      </el-form-item>

      <el-form-item>
        <el-button type="primary" @click="submitForm('ruleForm')"
          >修改</el-button
        >
        <el-button @click="resetForm('ruleForm')">取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
//导入md5加密方法
import { strToMd5 } from "../../util/md5";
export default {
  data() {
    //验证原始密码
    var validateOldLoginPwd = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入原始密码"));
      } else {
        callback();
      }
    };
    var validateNewLoginPwd = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入最新密码"));
      } else {
        callback();
      }
    };
    var validateLoginPwd2 = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入确认密码"));
      } else if (value !== this.ruleForm.newLoginPwd) {
        callback(new Error("两次密码输入不一致！"));
      } else {
        callback();
      }
    };
    return {
      ruleForm: {
        //管理员编号
        id: this.$store.state.admin.admin.id,
        //原始密码
        oldLoginPwd: "",
        newLoginPwd: "",
        loginPwd2: "",
      },
      //表单的验证数据
      rules: {
        //验证原始密码
        oldLoginPwd: [{ validator: validateOldLoginPwd, trigger: "blur" }],
        newLoginPwd: [{ validator: validateNewLoginPwd, trigger: "blur" }],
        loginPwd2: [{ validator: validateLoginPwd2, trigger: "blur" }],
      },
    };
  },
  methods: {
    //表单的提交方法
    submitForm(formName) {
      this.$refs[formName].validate(async (valid) => {
        //判断表单数据是否验证成功
        if (valid) {
          //对密码加密
          this.ruleForm.oldLoginPwd = strToMd5(this.ruleForm.oldLoginPwd);
          this.ruleForm.newLoginPwd = strToMd5(this.ruleForm.newLoginPwd);
          this.ruleForm.loginPwd2 = strToMd5(this.ruleForm.loginPwd2);
          //执行添加功能
          let { success, message } = await this.$post(
            "/Admin/ResetPwd",
            this.ruleForm
          );
          //判断是否添加成功
          if (success) {
            this.$msg_s(message);
            //清空表单
            this.resetForm("ruleForm");
          } else {
            this.$msg_e(message);
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
      //清空表单
      this.ruleForm = {
        //管理员编号
        id: this.$store.state.admin.admin.id,
        //原始密码
        oldLoginPwd: "",
        newLoginPwd: "",
        loginPwd2: "",
      };
    },
  },
};
</script>
<style lang="scss" scoped>
</style>