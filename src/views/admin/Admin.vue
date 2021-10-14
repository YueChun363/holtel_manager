<template>
  <div>
    <!-- 搜索区域 -->
    <div class="search">
      <label style="color: #666; font-size: 12px">角色：</label>
      <el-select
        size="mini"
        v-model="roleId"
        placeholder="请选择角色"
        clearable
        style="margin-right: 10px"
      >
        <el-option
          v-for="item in roleListToSearch"
          :key="item.roleId"
          :label="item.roleName"
          :value="item.roleId"
        >
        </el-option>
      </el-select>
      <el-button size="mini" type="success" @click="searchClick"
        >查询</el-button
      >
      <el-button size="mini" type="primary" @click="addClick">添加</el-button>
    </div>
    <!-- 表格区域 -->
    <el-table :data="tableData" style="width: 99%" size="mini">
      <el-table-column label="编号" width="180">
        <template slot-scope="scope">
          {{ scope.row.id }}
        </template>
      </el-table-column>
      <el-table-column label="账号" width="180">
        <template slot-scope="scope">
          {{ scope.row.loginId }}
        </template>
      </el-table-column>
      <el-table-column label="姓名" width="180">
        <template slot-scope="scope">
          {{ scope.row.name }}
        </template>
      </el-table-column>
      <el-table-column label="电话" width="180">
        <template slot-scope="scope">
          {{ scope.row.phone }}
        </template>
      </el-table-column>
      <el-table-column label="头像" width="180">
        <template slot-scope="scope">
          <el-image
            style="width: 60px; height: 60px"
            :src="BASE_URL_AdminImg + (scope.row.photo || 'admin_default.jpg')"
            fit="cover"
          ></el-image>
        </template>
      </el-table-column>
      <el-table-column label="角色" width="180">
        <template slot-scope="scope">
          {{ scope.row.role.roleName }}
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
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
    <!-- 分页 -->
    <div class="flex j-c" style="margin-top: 5px">
      <el-pagination
        background
        layout="prev, pager, next"
        :total="count"
        :page-size="8"
        @current-change="currentChange"
      >
      </el-pagination>
    </div>
    <!-- 抽屉区域 -->
    <el-drawer
      :title="isAdd ? '添加账号' : '修改账号'"
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
          <el-form-item label="头像" prop="photo">
            <el-upload
              class="avatar-uploader"
              :action="Upload_AdminImg_URL"
              :show-file-list="false"
              :on-success="handleAvatarSuccess"
              :before-upload="beforeAvatarUpload"
            >
              <img
                v-if="ruleForm.photo"
                :src="BASE_URL_AdminImg + ruleForm.photo"
                class="avatar"
              />
              <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            </el-upload>
          </el-form-item>
          <el-form-item label="账号" prop="loginId">
            <el-input v-model="ruleForm.loginId" autocomplete="off"></el-input>
          </el-form-item>
          <!-- 不需要修改密码 -->
          <el-form-item v-if="isAdd" label="密码" prop="loginPwd">
            <el-input
              type="password"
              v-model="ruleForm.loginPwd"
              autocomplete="off"
            ></el-input>
          </el-form-item>
          <el-form-item v-if="isAdd" label="确认密码" prop="loginPwd2">
            <el-input
              v-model="ruleForm.loginPwd2"
              autocomplete="off"
              type="password"
            ></el-input>
          </el-form-item>
          <el-form-item label="姓名" prop="name">
            <el-input v-model="ruleForm.name" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="电话" prop="phone">
            <el-input v-model="ruleForm.phone" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="角色" prop="roleId">
            <el-select
              clearable
              v-model="ruleForm.roleId"
              placeholder="请选择角色"
            >
              <el-option
                v-for="item in roleList"
                :key="item.roleId"
                :label="item.roleName"
                :value="item.roleId"
              >
              </el-option>
            </el-select>
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
//导入md5加密方法
import { strToMd5 } from "../../util/md5";
//导入管理员头像根路径和管理员头像上传路径，与图片名字拼接显示图片
import { BASE_URL_AdminImg, Upload_AdminImg_URL } from "../../config/index";
export default {
  data() {
    //验证账号
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
    var validateLoginPwd2 = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入确认密码"));
      } else if (value !== this.ruleForm.loginPwd) {
        callback(new Error("两次密码输入不一致！"));
      } else {
        callback();
      }
    };
    var validateName = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入姓名"));
      } else {
        callback();
      }
    };
    var validatePhone = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入手机号"));
      } else {
        callback();
      }
    };
    var validateRoleId = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请选择角色"));
      } else {
        callback();
      }
    };
    return {
      //表格数据
      tableData: [],
      //表格数据的总数量
      count: 0,
      //角色编号(用于根据条件查询账号信息)
      roleId: "",
      //角色列表（用于搜索）
      roleListToSearch: [],
      //当前页码
      pageIndex: 1,
      //角色列表
      roleList: [],
      //管理员头像根路径
      BASE_URL_AdminImg,
      //管理员头像上传路径
      Upload_AdminImg_URL,
      //是否打开抽屉
      drawer: false,
      //标识抽屉是否做添加（用来复用抽屉，既添加也可编辑）
      isAdd: true,
      //表单数据
      ruleForm: {
        //账号
        loginId: "",
        loginPwd: "",
        loginPwd2: "",
        name: "",
        phone: "",
        //角色编号
        roleId: "",
        //头像
        photo: "",
      },
      //表单的验证数据
      rules: {
        loginId: [{ validator: validateLoginId, trigger: "blur" }],
        loginPwd: [{ validator: validateLoginPwd, trigger: "blur" }],
        loginPwd2: [{ validator: validateLoginPwd2, trigger: "blur" }],
        name: [{ validator: validateName, trigger: "blur" }],
        phone: [{ validator: validatePhone, trigger: "blur" }],
        roleId: [{ validator: validateRoleId, trigger: "change" }],
      },
    };
  },
  created() {
    //调用获取表格数据的方法
    this.getTableData();
    //调用获取角色列表的方法
    this.getRoleList();
  },
  methods: {
    //获取表格数据
    async getTableData() {
      //data是账号数组数据
      //count是总共有多少条数据
      let { data, count } = await this.$get("/Admin/List", {
        roleId: this.roleId || 0,
        pageIndex: this.pageIndex,
        pageSize: 8,
      });
      this.tableData = data;
      this.count = count;
    },
    //分页方法
    currentChange(pageIndex) {
      //设置当前页码
      this.pageIndex = pageIndex;
      //重新调用获取表格数据的方法
      this.getTableData();
    },
    //搜索方法
    searchClick(){
        //重新调用获取表格数据的方法
        this.getTableData();
    },
    //获取角色列表的方法
    async getRoleList() {
      let res = await this.$get("/Role/List");
      this.roleList = res;
      this.roleListToSearch=res;
    },
    addClick() {
      //添加按钮点击方法，打开抽屉
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
            //对密码加密
            this.ruleForm.loginPwd = strToMd5(this.ruleForm.loginPwd);
            this.ruleForm.loginPwd2 = strToMd5(this.ruleForm.loginPwd2);
            //执行添加功能
            let { success, message } = await this.$post(
              "/Admin/Add",
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
              "/Admin/Update",
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
      //清空表单
      this.ruleForm = {
        //账号
        loginId: "",
        loginPwd: "",
        loginPwd2: "",
        name: "",
        phone: "",
        //角色编号
        roleId: "",
        //头像
        photo: "",
      };
    },
    async handleEdit(index, row) {
      //获取登录名
      let loginId = row.loginId;
      let res = await this.$get("/Admin/GetOne", { loginId });
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
      //获取编号
      let id = row.id;
      //获取头像照片名称
      let photo = row.photo;
      //删除对应账号信息
      let { success, message } = await this.$post("/Admin/Delete", {
        id,
        photo,
      });
      if (success) {
        this.$msg_s(message);
        //删除后获取最新的表格
        this.getTableData();
      } else {
        this.$msg_e(message);
      }
    },
    //上传成功
    handleAvatarSuccess(res) {
      let { success, filename } = res;
      if (success) {
        this.ruleForm.photo = filename;
      }
    },
    //上传之前
    beforeAvatarUpload(file) {
      //定义可以上传的图片格式类型数组
      let img_type_list = [
        "image/jpeg",
        "image/png",
        "image/gif",
        "image/webm",
      ];
      //判断类型是否正确
      const isJPG = img_type_list.includes(file.type);
      const isLt1M = file.size / 1024 / 1024 < 1;
      if (!isJPG) {
        this.$message.error("上传头像图片只能是 jpg/png/gif/webm 格式!");
      }
      if (!isLt1M) {
        this.$message.error("上传头像图片大小不能超过 1MB!");
      }
      return isJPG && isLt1M;
    },
  },
};
</script>
<style lang="scss" scoped>
// 上传头像样式
.avatar-uploader {
  width: 178px;
  height: 178px;
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader:hover {
  border-color: #409eff;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}
.avatar {
  width: 178px;
  height: 178px;
  display: block;
}
</style>