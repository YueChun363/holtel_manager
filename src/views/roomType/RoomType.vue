<template>
  <div>
    <!-- 搜索区域 -->
    <div class="search">
      <el-button size="mini" type="primary" @click="addClick"
        >添加房间类型</el-button
      >
    </div>
    <!-- 表格区域 -->
    <el-table :data="tableData" style="width: 99%" size="mini">
      <el-table-column label="类型编号" width="180">
        <template slot-scope="scope">
          {{ scope.row.roomTypeId }}
        </template>
      </el-table-column>
      <el-table-column label="类型名称" width="180">
        <template slot-scope="scope">
          {{ scope.row.roomTypeName }}
        </template>
      </el-table-column>
      <el-table-column label="床位数" width="180">
        <template slot-scope="scope">
          {{ scope.row.bedNum }}
        </template>
      </el-table-column>
      <el-table-column label="价格" width="180">
        <template slot-scope="scope">
          {{ scope.row.roomTypePrice }}
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
    <!-- 抽屉区域 -->
    <el-drawer
      :title="isAdd ? '添加房间类型' : '修改房间类型'"
      :visible.sync="drawer"
      direction="rtl"
      :before-close="drawerClose"
      size="45%"
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
          <el-form-item label="类型名称" prop="roomTypeName">
            <el-input
              v-model="ruleForm.roomTypeName"
              autocomplete="off"
            ></el-input>
          </el-form-item>
          <el-form-item label="床位数" prop="bedNum">
            <el-input
              v-model.number="ruleForm.bedNum"
              autocomplete="off"
            ></el-input>
          </el-form-item>
          <el-form-item label="价格" prop="roomTypePrice">
            <el-input
              v-model.number="ruleForm.roomTypePrice"
              autocomplete="off"
            ></el-input>
          </el-form-item>
          <el-form-item label="描述" prop="typeDescription">
            <quill-editor
              v-model="ruleForm.typeDescription"
              ref="myQuillEditor"
              style="height:300px;margin-bottom:100px"
            >
            </quill-editor>
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
export default {
  data() {
    //验证账号
    var validateRoomTypeName = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入类型名称"));
      } else {
        callback();
      }
    };
    var validateBedNum = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入床位数"));
      } else if (!Number.isInteger(value)) {
        callback(new Error("请输入数字值"));
      } else {
        callback();
      }
    };
    var validateRoomTypePrice = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入价格"));
      } else if (!Number.isInteger(value)) {
        callback(new Error("请输入数字值"));
      } else {
        callback();
      }
    };
    var validateTypeDescription = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入描述"));
      } else {
        callback();
      }
    };
    return {
      //表格数据
      tableData: [],
      //表格数据的总数量
      count: 0,
      //当前页码
      pageIndex: 1,
      //是否打开抽屉
      drawer: false,
      //标识抽屉是否做添加（用来复用抽屉，既添加也可编辑）
      isAdd: true,
      //表单数据
      ruleForm: {
        roomTypeName: "",
        bedNum: "",
        roomTypePrice: "",
        typeDescription: "",
      },
      //表单的验证数据
      rules: {
        roomTypeName: [{ validator: validateRoomTypeName, trigger: "blur" }],
        bedNum: [{ validator: validateBedNum, trigger: "blur" }],
        roomTypePrice: [{ validator: validateRoomTypePrice, trigger: "blur" }],
        typeDescription: [
          { validator: validateTypeDescription, trigger: "blur" },
        ],
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
      //获取房间类型信息
      let data = await this.$get("/RoomType/List");
      this.tableData = data;
    },
    //分页方法
    currentChange(pageIndex) {
      //设置当前页码
      this.pageIndex = pageIndex;
      //重新调用获取表格数据的方法
      this.getTableData();
    },
    //搜索方法
    searchClick() {
      //重新调用获取表格数据的方法
      this.getTableData();
    },
    //获取角色列表的方法
    async getRoleList() {
      let res = await this.$get("/Role/List");
      this.roleList = res;
      this.roleListToSearch = res;
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
              "/RoomType/Add",
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
              "/RoomType/Update",
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
        roomTypeName: "",
        bedNum: "",
        roomTypePrice: "",
        typeDescription: "",
      };
    },
    async handleEdit(index, row) {
      //获取编号
      let roomTypeId = row.roomTypeId;
      let res = await this.$get("/RoomType/GetOne", { roomTypeId });
      this.ruleForm = res;
      //表示显示为修改的抽屉
      this.isAdd = false;
      //打开抽屉
      this.drawer = true;
    },
    //删除表格数据
    async handleDelete(index, row) {
      //删除确定
      await this.$con_f("确定删除？");
      //获取编号
      let roomTypeId = row.roomTypeId;
      //删除对应账号信息
      let { success, message } = await this.$post("/RoomType/Delete", {
        roomTypeId,
      });
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

</style>