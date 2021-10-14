<template>
  <div>
    <!-- 搜索区域 -->
    <div class="search">
      <el-button size="mini" type="primary" @click="addClick"
        >添加角色</el-button
      >
    </div>
    <!-- 表格区域 -->
    <el-table :data="tableData" style="width: 99%" size="mini">
      <el-table-column label="角色编号" width="180">
        <template slot-scope="scope">
          {{ scope.row.roleId }}
        </template>
      </el-table-column>
      <el-table-column label="角色名称" width="250">
        <template slot-scope="scope">
          {{ scope.row.roleName }}
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="success"
            
            >设置权限</el-button
          >
          <el-button
            size="mini"
            type="warning"
            @click="handleEdit(scope.$index, scope.row)"
            >编辑</el-button
          >
          <el-button
            size="mini"
            type="danger"
            @click="handleDelete(scope.$index, scope.row)"
            >删除</el-button
          >
        </template>
      </el-table-column>
    </el-table>
    <!-- 抽屉区域 -->
    <el-drawer
      :title="isAdd ? '添加角色' : '修改角色'"
      :visible.sync="drawer"
      direction="rtl"
      :before-close="drawerClose"
    >
      <div style="padding: 0 10px">
        <el-form
          size="mini"
          :model="ruleForm"
          status-icon
          :rules="rules"
          ref="ruleForm"
          label-width="80px"
          class="demo-ruleForm"
        >
          <el-form-item label="名称" prop="roleName">
            <el-input v-model="ruleForm.roleName" autocomplete="off"></el-input>
          </el-form-item>

          <el-form-item>
            <el-button type="primary" @click="submitForm('ruleForm')">{{
              isAdd ? "添加" : "修改"
            }}</el-button>
            <el-button @click="resetForm('ruleForm')">取消</el-button>
          </el-form-item>
        </el-form>
      </div>
    </el-drawer>
  </div>
</template>
<script>
//导入角色api层，平时请求数据都需要写在api里，这里只做演示了
import * as role_api from "../../api/role_api";
export default {
  data() {
    //验证角色名称
    var validateRoleName = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入角色名称"));
      } else {
        callback();
      }
    };
    return {
      //表格数据
      tableData: [],
      //是否打开抽屉
      drawer: false,
      //标识抽屉是否做添加（用来复用抽屉，既添加也可编辑）
      isAdd: true,
      //表单数据
      ruleForm: {
        //登录名
        roleName: "",
      },
      //表单的验证数据
      rules: {
        roleName: [{ validator: validateRoleName, trigger: "blur" }],
      },
    };
  },
  created() {
    //调用获取表格数据的方法
    this.getTableData();
  },
  methods: {
    //获取表格数据
    async getTableData() {
      //在页面中请求接口，获取数据
      // let res = await this.$get('/Role/List')
      //也必须await
      let res = await role_api.list();
      this.tableData = res;
    },
    addClick() {
      //添加按钮点击方法
      this.drawer = true;
    },
    //关闭抽屉的方法
    async drawerClose(done) {
      //关闭时清空表单数据，有问题，下次进去直接就暴红提是输入name
      //下面这种情况是清空的数据
      //   this.ruleForm = {roleName: "",};
      //而resetform方法是根据ref的ruleForm清空的节点内的内容
      this.resetForm("ruleForm");
      this.isAdd = true;
      done();
    },
    //表单的提交方法
    submitForm(formName) {
      this.$refs[formName].validate(async (valid) => {
        //判断表单数据是否验证成功
        if (valid) {
          if (this.isAdd) {
            //执行添加功能
            let { success, message } = await this.$post(
              "/Role/Add",
              this.ruleForm
            );
            //判断是否添加成功
            if (success) {
              this.$msg_s(message);
              //获取最新的表格信息
              this.getTableData();
              //清空表单
              this.resetForm("ruleForm");
            } else {
              this.$msg_e(message);
            }
          } else {
            //执行修改
            let { success, message } = await this.$post(
              "/Role/Update",
              this.ruleForm
            );
            //判断是否修改成功
            if (success) {
              this.$msg_s(message);
              //获取最新的表格信息
              this.getTableData();
            } else {
              this.$msg_e(message);
            }
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
      //清空表单数据
      this.ruleForm={
        roleName:"",
      }
    },
    async handleEdit(index, row) {
      //获取角色编号
      let roleId = row.roleId;
      let res = await this.$get("/Role/GetOne", { roleId });
      this.ruleForm = res;
      //标识显示为修改的额抽屉
      this.isAdd = false;
      //打开抽屉
      this.drawer = true;
    },
    //删除表格数据
    async handleDelete(index, row) {
      //删除确定
      await this.$con_f("确定删除？");
      //获取角色编号
      let roleId = row.roleId;
      //删除对应角色信息
      let { success, message } = await this.$post("/Role/Delete", { roleId });
      if (success) {
        this.$msg_s(message);
        //删除后获取最新的表格
        this.getTableData();
      } else {
        this.$msg_e(message);
      }
    },
  },
};
</script>
<style lang="scss" scoped>
.search {
}
</style>