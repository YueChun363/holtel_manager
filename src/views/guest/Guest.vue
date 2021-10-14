<template>
  <div>
    <!-- 搜索区域 -->
    <div class="search">
      <label style="color: #666; font-size: 12px">客户姓名：</label>
      <el-input
        size="mini"
        clearable
        style="width: 200px; margin-right: 10px"
        v-model="guestName"
        placeholder="请输入客户姓名"
      ></el-input>
      <label style="color: #666; font-size: 12px">结账状态：</label>
      <el-select
        size="mini"
        v-model="resideStateId"
        placeholder="请选择结账状态"
        clearable
        style="margin-right: 10px"
      >
        <el-option
          v-for="item in resideStateList"
          :key="item.resideStateId"
          :label="item.resideStateName"
          :value="item.resideStateId"
        >
        </el-option>
      </el-select>
      <el-button size="mini" type="success" @click="searchClick"
        >查询</el-button
      >
      <el-button size="mini" type="warning" @click="excelClick"
        >导出Excel</el-button
      >
      <el-button size="mini" type="primary" @click="addClick">添加</el-button>
    </div>
    <!-- 表格区域 -->
    <el-table :data="tableData" style="width: 99%" size="mini">
      <el-table-column label="客户姓名" width="80">
        <template slot-scope="scope">
          {{ scope.row.guestName }}
        </template>
      </el-table-column>
      <el-table-column label="客户电话" width="100">
        <template slot-scope="scope">
          {{ scope.row.phone }}
        </template>
      </el-table-column>
      <el-table-column label="身份证号" width="150">
        <template slot-scope="scope">
          {{ scope.row.identityId }}
        </template>
      </el-table-column>
      <el-table-column label="入住房间" width="80">
        <template slot-scope="scope">
          {{ scope.row.roomId }}
        </template>
      </el-table-column>
      <el-table-column label="房间类型" width="80">
        <template slot-scope="scope">
          {{ scope.row.room.roomType.roomTypeName }}
        </template>
      </el-table-column>
      <el-table-column label="床位数" width="60">
        <template slot-scope="scope">
          {{ scope.row.room.roomType.bedNum }}
        </template>
      </el-table-column>
      <el-table-column label="房间价格" width="60">
        <template slot-scope="scope">
          {{ scope.row.room.roomType.roomTypePrice }}
        </template>
      </el-table-column>
      <el-table-column label="入住日期" width="140">
        <template slot-scope="scope">
          {{ scope.row.resideDate }}
        </template>
      </el-table-column>
      <el-table-column label="离开日期" width="140">
        <template slot-scope="scope">
          {{ scope.row.leaveDate }}
        </template>
      </el-table-column>
      <el-table-column label="押金" width="60">
        <template slot-scope="scope">
          {{ scope.row.deposit }}
        </template>
      </el-table-column>
      <el-table-column label="消费" width="60">
        <template slot-scope="scope">
          {{ scope.row.room.totalMoney }}
        </template>
      </el-table-column>
      <el-table-column label="人数" width="50">
        <template slot-scope="scope">
          {{ scope.row.guestNum }}
        </template>
      </el-table-column>
      <el-table-column label="状态" width="70">
        <template slot-scope="scope">
          <el-tag
            size="mini"
            :type="scope.row.resideStateId === 1 ? 'danger' : 'success'"
            disable-transitions
            >{{ scope.row.resideState.resideStateName }}</el-tag
          >
        </template>
      </el-table-column>
      <el-table-column label="操作" width="140">
        <template slot-scope="scope">
          <el-button
            v-if="scope.row.resideStateId === 1"
            size="mini"
            type="text"
            @click="handleEdit(scope.$index, scope.row)"
            >编辑</el-button
          >
          <el-button
            v-if="scope.row.resideStateId === 1"
            size="mini"
            type="text"
            style="color: #e6a23c"
            @click="handleJiezhang(scope.$index, scope.row)"
            >结账</el-button
          >
          <!-- 已经结账的客户才能删除，通过resideStateId===2判断 -->
          <el-button
            v-if="scope.row.resideStateId === 2"
            size="mini"
            type="text"
            style="color: #f56c6c"
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
        @current-change="currentChange"
      >
      </el-pagination>
    </div>
    <!-- 抽屉区域 -->
    <el-drawer
      :title="isAdd ? '添加客户' : '修改客户'"
      :visible.sync="drawer"
      direction="rtl"
      :before-close="drawerClose"
      size="30%"
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
          <el-form-item label="姓名" prop="guestName">
            <el-input
              v-model="ruleForm.guestName"
              autocomplete="off"
            ></el-input>
          </el-form-item>
          <el-form-item label="电话" prop="phone">
            <el-input v-model="ruleForm.phone" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="身份证" prop="identityId">
            <el-input
              v-model="ruleForm.identityId"
              autocomplete="off"
            ></el-input>
          </el-form-item>
          <el-form-item label="房间类型" prop="roomTypeId">
            <el-select
              size="mini"
              v-model="ruleForm.roomTypeId"
              placeholder="请选择房间类型"
              clearable
              @change="roomTypeChange"
            >
              <el-option
                v-for="item in roomTypeList"
                :key="item.roomTypeId"
                :label="item.roomTypeName"
                :value="item.roomTypeId"
              >
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="房间" prop="roomId">
            <el-select
              size="mini"
              v-model="ruleForm.roomId"
              placeholder="请选择房间"
              clearable
            >
              <el-option
                v-for="item in roomList"
                :key="item.roomId"
                :label="item.roomId"
                :value="item.roomId"
              >
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="入住时间" prop="resideDate">
            <el-date-picker
              v-model="ruleForm.resideDate"
              type="datetime"
              placeholder="选择入住时间"
            >
            </el-date-picker>
          </el-form-item>
          <el-form-item label="押金" prop="deposit">
            <el-input v-model="ruleForm.deposit" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="入住人数" prop="guestNum">
            <el-input v-model="ruleForm.guestNum" autocomplete="off"></el-input>
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
//导入  导出excel文件的方法
import { xlsx } from "../../util/xlsx";
export default {
  data() {
    var validateIdentityId = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入身份证号"));
      } else {
        callback();
      }
    };
    var validateGuestName = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入客户姓名"));
      } else {
        callback();
      }
    };
    var validatePhone = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入客户电话"));
      } else {
        callback();
      }
    };
    var validateRoomTypeId = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请选择房间类型"));
      } else {
        callback();
      }
    };
    var validateRoomId = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请选择房间号"));
      } else {
        callback();
      }
    };
    var validateResideDate = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请选择房间号"));
      } else {
        callback();
      }
    };
    var validateDeposit = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请选择房间号"));
      } else {
        callback();
      }
    };
    var validateGuestNum = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请选择房间号"));
      } else {
        callback();
      }
    };
    return {
      //定义房间图片对应的房间号（在图片显示和上传都会用到）：因为上传图片保存到数据库后，
      //图片和房间id一一对应，所以roomId写成了data里面全局的
      roomId: "",
      //表格数据
      tableData: [],
      //表格数据的总数量
      count: 0,
      //当前页码
      pageIndex: 1,
      //客户姓名（用于搜索）
      guestName: "",
      //结账状态编号（用于搜索）
      resideStateId: "",
      //结账状态列表列表，用于搜索
      resideStateList: [],

      //房间类型列表（表单）
      roomTypeList: [],
      //客房列表（表单）
      roomList: [],

      //是否打开抽屉
      drawer: false,
      //标识抽屉是否做添加（用来复用抽屉，既添加也可编辑）
      isAdd: true,
      //表单数据
      ruleForm: {
        identityId: "",
        guestName: "",
        phone: "",
        roomTypeId: "",
        roomId: "",
        resideDate: "",
        deposit: "",
        guestNum: "",
      },
      //表单的验证数据
      rules: {
        identityId: [{ validator: validateIdentityId, trigger: "blur" }],
        guestName: [{ validator: validateGuestName, trigger: "blur" }],
        phone: [{ validator: validatePhone, trigger: "blur" }],
        roomTypeId: [{ validator: validateRoomTypeId, trigger: "change" }],
        roomId: [{ validator: validateRoomId, trigger: "change" }],
        resideDate: [{ validator: validateResideDate, trigger: "blur" }],
        deposit: [{ validator: validateDeposit, trigger: "blur" }],
        guestNum: [{ validator: validateGuestNum, trigger: "blur" }],
      },
    };
  },
  created() {
    //调用获取表格数据的方法
    this.getTableData();
    //调用获取结账状态列表的方法
    this.getResideStateList();
    //调用获取房间类型列表的方法
    this.getRoomTypeList();
  },
  methods: {
    //导出excel的方法
    excelClick() {
      let json = this.tableData.map((r) => {
        return {
          guestName: r.guestName,
          phone: r.phone,
          identityId: r.identityId,
          roomId: r.roomId,
          roomTypeName: r.room.roomType.roomTypeName,
          bedNum: r.room.roomType.bedNum,
          price: r.room.roomType.roomTypePrice,
          resideDate: r.resideDate,
          leaveDate: r.leaveDate,
          deposit: r.deposit,
          totalMoney: r.totalMoney,
          guestNum: r.guestNum,
          resideStateName: r.resideStateName,
        };
      });
      let fields = {
        guestName: "客户姓名",
        phone: "客户电话",
        identityId: "身份证号",
        roomId: "入住房间",
        roomTypeName: "房间类型",
        bedNum: "床位数",
        price: "房间价格",
        resideDate: "入住时间",
        leaveDate: "离开时间",
        deposit: "押金",
        totalMoney: "消费金额",
        guestNum: "入住人数",
        resideStateName: "结账状态",
      };
      let filename = "客户信息表";

      xlsx(json, fields, filename);
    },
    //获取表格数据
    async getTableData() {
      //获取房间信息
      let { data, count } = await this.$get("/GuestRecord/List", {
        //客户姓名
        guestName: this.guestName,
        //结账状态编号
        resideStateId: this.resideStateId || 0,
        //页码
        pageIndex: this.pageIndex,
      });
      this.tableData = data;
      //获取数据总数
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
    searchClick() {
      //重新调用获取表格数据的方法
      this.getTableData();
    },
    //获取结账状态列表的方法
    async getResideStateList() {
      let res = await this.$get("/ResideState/List");
      this.resideStateList = res;
    },
    //获取房间类型列表的方法
    async getRoomTypeList() {
      let res = await this.$get("/RoomType/List");
      this.roomTypeList = res;
    },
    //房间类型下拉框选项改变后，动态获取房间列表
    async roomTypeChange() {
      //每次切换时先清空房间编号
      this.ruleForm.roomId = "";
      let roomTypeId = this.ruleForm.roomTypeId;
      if (roomTypeId) {
        //根据客房类型编号查询对应的客房信息，还要传入状态id，查找状态为空闲的房间
        let { data } = await this.$get("/Room/List", {
          roomTypeId,
          roomStateId: 1,
          //入住了的用户修改了房间类型后再换回来不能选择之前住的那个房间，
          //需要多传递个guestId从而实现与其他用户筛选项区分
          guestId: this.ruleForm.guestId || 0,
        });
        this.roomList = data;
      }
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
              "/GuestRecord/Add",
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
              "/GuestRecord/Update",
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
        identityId: "",
        guestName: "",
        phone: "",
        roomTypeId: "",
        roomId: "",
        resideDate: "",
        deposit: "",
        guestNum: "",
      };
    },
    async handleEdit(index, row) {
      //获取编号
      let guestId = row.guestId;
      let res = await this.$get("/GuestRecord/GetOne", { guestId });
      this.ruleForm = res;
      //给表单对象添加房间类型编号，不然点击编辑按钮的时候表单里面房间类型不会选中，是空的
      this.ruleForm.roomTypeId = res.room.roomTypeId;
      let roomId = this.ruleForm.roomId;
      //调用获取客房类型对应客房信息的方法，每次修改房间类型都需要重新获取可选房间列表
      this.roomTypeChange();
      this.ruleForm.roomId = roomId;

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
      let guestId = row.guestId;
      //删除对应客户信息
      let { success, message } = await this.$post("/GuestRecord/Delete", {
        guestId,
      });
      if (success) {
        this.$msg_s(message);
        //删除后获取最新的表格
        this.getTableData();
      } else {
        this.$msg_e(message);
      }
    },
    //结账方法
    async handleJiezhang(index, row) {
      //结账确定
      await this.$con_f("确定结账？");
      //获取编号
      let guestId = row.guestId;
      let { totalMoney } = await this.$post("/GuestRecord/Checkout", {
        guestId,
      });
      this.$msg_s("结账成功！需支付" + totalMoney + "元~");
      //重新获取表格数据
      this.getTableData();
    },
  },
};
</script>
<style lang="scss" scoped>
</style>