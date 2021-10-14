<template>
  <div>
    <!-- 搜索区域 -->
    <div class="search">
      <label style="color: #666; font-size: 12px">房间类型：</label>
      <el-select
        size="mini"
        v-model="roomTypeId"
        placeholder="请选择房间类型"
        clearable
        style="margin-right: 10px"
      >
        <el-option
          v-for="item in roomTypeList"
          :key="item.roomTypeId"
          :label="item.roomTypeName"
          :value="item.roomTypeId"
        >
        </el-option>
      </el-select>
      <label style="color: #666; font-size: 12px">客房状态：</label>
      <el-select
        size="mini"
        v-model="roomStateId"
        placeholder="请选择客房状态"
        clearable
        style="margin-right: 10px"
      >
        <el-option
          v-for="item in roomStateList"
          :key="item.roomStateId"
          :label="item.roomStateName"
          :value="item.roomStateId"
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
      <el-table-column label="房间号" width="180">
        <template slot-scope="scope">
          {{ scope.row.roomId }}
        </template>
      </el-table-column>
      <el-table-column label="房间类型" width="180">
        <template slot-scope="scope">
          {{ scope.row.roomType.roomTypeName }}
        </template>
      </el-table-column>
      <el-table-column label="床位数" width="180">
        <template slot-scope="scope">
          {{ scope.row.roomType.bedNum }}
        </template>
      </el-table-column>
      <el-table-column label="价格" width="180">
        <template slot-scope="scope">
          {{ scope.row.roomType.roomTypePrice }}
        </template>
      </el-table-column>
      <el-table-column label="房间状态" width="180">
        <template slot-scope="scope">
          <el-tag
            size="mini"
            :type="scope.row.roomStateId === 1 ? 'success' : (scope.row.roomStateId===2 ?'danger':'warning')"
            disable-transitions
            >{{ scope.row.roomState.roomStateName }}</el-tag
          >
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
            type="primary"
            @click="handleShowImg(scope.$index, scope.row)"
            >图片</el-button
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
        @current-change="currentChange"
      >
      </el-pagination>
    </div>
    <!-- 抽屉区域 -->
    <el-drawer
      :title="isAdd ? '添加客房' : '修改客房'"
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
          <el-form-item label="房间编号" prop="roomId">
            <el-input v-model="ruleForm.roomId" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="房间类型" prop="roomTypeId">
            <el-select
              size="mini"
              v-model="ruleForm.roomTypeId"
              placeholder="请选择房间类型"
              clearable
              style="margin-right: 10px"
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
          <el-form-item label="房间状态" prop="roomStateId">
            <el-select
              size="mini"
              v-model="ruleForm.roomStateId"
              placeholder="请选择房间状态"
              clearable
              style="margin-right: 10px"
            >
              <el-option
                v-for="item in roomStateList2"
                :key="item.roomStateId"
                :label="item.roomStateName"
                :value="item.roomStateId"
              >
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="描述" prop="description">
            <quill-editor
              v-model="ruleForm.description"
              ref="myQuillEditor"
              style="height: 300px; margin-bottom: 100px"
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
    <!-- 图片上传组件弹出层 -->
    <el-dialog
      title="房间图片"
      :visible.sync="dialogVisible"
      width="60%"
      :before-close="handleClose"
    >
      <!-- 图片上传组件 -->
      <el-upload
        :action="Upload_RoomImg_URL"
        list-type="picture-card"
        :file-list="fileList"
        :on-preview="handlePictureCardPreview"
        :on-remove="handleRemove"
        :on-success="handleAvatarSuccess"
        :before-upload="beforeAvatarUpload"
      >
        <i class="el-icon-plus"></i>
      </el-upload>
      <!-- 弹出层：显示大图 -->
      <!-- append-to-body，内层嵌套的dialog必须指定为true，否则多层嵌套对话框弹出层
                会导致需要多次点击才能关闭和全部弹出框都显示为背景灰色 的问题 -->
      <el-dialog :visible.sync="dialogVisible2" append-to-body>
        <img width="100%" :src="dialogImageUrl" alt="" />
      </el-dialog>
    </el-dialog>
  </div>
</template>
<script>
//导入查看房间图片和上传房间图片的路径
import { Upload_RoomImg_URL, BASE_URL_RoomImg } from "../../config/index";
//导入  导出excel文件的方法
import { xlsx } from "../../util/xlsx";
export default {
  data() {
    var validateRoomId = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入房间编号"));
      } else {
        callback();
      }
    };
    var validateRoomStateId = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请选择房间状态"));
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
    var validateDescription = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入描述"));
      } else {
        callback();
      }
    };
    return {
      //定义房间图片对应的房间号（在图片显示和上传都会用到）：因为上传图片保存到数据库后，
      //图片和房间id一一对应，所以roomId写成了data里面全局的
      roomId: "",
      //房间图片上传路径
      Upload_RoomImg_URL,
      //房间图片显示路径
      BASE_URL_RoomImg,
      //图片上传组件弹出层的显示控制
      dialogVisible: false,
      //是否显示大图弹出层的控制
      dialogVisible2: false,
      //弹出层里面大图的地址
      dialogImageUrl: "",
      //定义房间照片墙显示的照片数组
      fileList: [],

      //表格数据
      tableData: [],
      //表格数据的总数量
      count: 0,
      //当前页码
      pageIndex: 1,
      //房间类型编号，实现下拉框数据选择和展示
      roomTypeId: "",
      //房间状态编号，实现下拉框数据选择和展示
      roomStateId: "",
      //房间类型列:表，用于搜索
      roomTypeList: [],
      //客房状态列表，用于搜索
      roomStateList: [],
      //客房状态列表，用于添加修改
      roomStateList2: [],
      //是否打开抽屉
      drawer: false,
      //标识抽屉是否做添加（用来复用抽屉，既添加也可编辑）
      isAdd: true,
      //表单数据
      ruleForm: {
        //房间号
        roomId: "",
        //状态编号
        roomStateId: "",
        //类型编号
        roomTypeId: "",
        description: "",
      },
      //表单的验证数据
      rules: {
        roomId: [{ validator: validateRoomId, trigger: "blur" }],
        roomStateId: [{ validator: validateRoomStateId, trigger: "change" }],
        roomTypeId: [{ validator: validateRoomTypeId, trigger: "change" }],
        description: [{ validator: validateDescription, trigger: "blur" }],
      },
    };
  },
  created() {
    //调用获取表格数据的方法
    this.getTableData();
    //调用获取房间类型列表的方法
    this.getRoomTypeList();
    //调用获取房间状态列表的方法
    this.getRoomStateList();
  },
  methods: {
    //导出excel的方法
    excelClick() {
      //组织导出的数据
      let json = this.tableData.map(r=>{
          return {
              roomId:r.roomId,
              roomType:r.roomType.roomTypeName,
              bedNum:r.roomType.bedNum,
              price:r.roomType.roomTypePrice,
              roomState:r.roomState.roomStateName
          }
      });
      let fields = {
          roomId:"房间编号",
          roomType:"房间类型",
          bedNum:"床位数",
          price:"房间价格",
          roomState:"房间状态"
      }
      let filename="房间信息表"
      xlsx(json,fields,filename);
    },
    //获取表格数据
    async getTableData() {
      //获取房间信息
      let { data, count } = await this.$get("/Room/List", {
        roomTypeId: this.roomTypeId || 0,
        roomStateId: this.roomStateId || 0,
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
    //获取房间类型列表的方法
    async getRoomTypeList() {
      let res = await this.$get("/RoomType/List");
      this.roomTypeList = res;
    },
    //获取客房状态列表的方法
    async getRoomStateList() {
      let res = await this.$get("/RoomState/List");
      this.roomStateList = res;
      //获取房间状态（用于添加时，房间状态没有入住）
      let res2 = await this.$get("/RoomState/ListToUpdate");
      this.roomStateList2 = res2;
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
              "/Room/Add",
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
              "/Room/Update",
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
        //房间号
        roomId: "",
        //状态编号
        roomStateId: "",
        //类型编号
        roomTypeId: "",
        description: "",
      };
    },
    async handleEdit(index, row) {
      //获取编号
      let roomId = row.roomId;
      let res = await this.$get("/Room/GetOne", { roomId });
      this.ruleForm = res;
      //给表单对象添加一个id，用于备份房间号
      this.ruleForm.id = res.roomId;
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
      let roomId = row.roomId;
      //删除对应账号信息
      let { success, message } = await this.$post("/Room/Delete", {
        roomId,
      });
      if (success) {
        this.$msg_s(message);
        //删除后获取最新的表格
        this.getTableData();
      } else {
        this.$msg_e(message);
      }
    },
    //查看房间图片
    handleShowImg(index, row) {
      //显示客房图片列表的对话框
      this.dialogVisible = true;
      //获取当前点击房间号的编号，因为上传图片保存到数据库后，图片和房间id一一对应，所以
      //roomId写成了data里面全局的
      this.roomId = row.roomId;
      //调用获取上传图片列表的方法
      this.ShowImg(0);
    },
    async ShowImg(type) {
      //根据房间编号查询所有的图片
      let res = await this.$get("/RoomImg/List", { roomId: this.roomId });
      //设置房间照片墙上显示的照片列表
      this.fileList = res.map((r) => {
        return {
          //删除时需要用到roomImgId，所以把图片的id也放到fileList里，在删除方法里用
          roomImgId: r.roomImgId,
          name: r.imgUrl,
          url: this.BASE_URL_RoomImg + r.imgUrl,
        };
      });
    },
    //关闭图片对话框狂
    handleClose(done) {
      //清空照片墙上面缓存的房间照片
      this.fileList = [];
      //关闭对话框
      done();
    },
    //删除照片墙里面照片
    async handleRemove(file, fileList) {
      //获取图片id，后端接口需要传图片名称才能删除，否则可以删除成功但会报错
      let { roomImgId, name } = file;
      //删除对应的图片信息
      let { success, message } = await this.$post("/RoomImg/Delete", {
        roomImgId,
        filename: name,
      });
      if (success) {
        this.$msg_s(message, 1000);
      } else {
        this.$msg_e(message, 1000);
      }
    },
    //预览照片墙照片
    handlePictureCardPreview(file) {
      //设置显示大图的地址
      this.dialogImageUrl = file.url;
      //打开显示大图的对话框
      this.dialogVisible2 = true;
    },
    //上传成功
    async handleAvatarSuccess(res) {
      //返回上传图片到服务器的状态和图片的名称
      let { success, filename } = res;
      //表示图片上传到 服务器 成功
      if (success) {
        //添加客房图片信息（图片名）到数据库
        let res = await this.$post("/RoomImg/Add", {
          roomId: this.roomId,
          imgUrl: filename,
        });
        if (res.success) {
          //如果图片添加成功，向fileList中添加上传的那张图片，但是没办法获取roomImgId，这个方法
          //暂时没用，最好是后端接口加返回数据
          //   this.fileList.shift({
          //     roomImgId: roomImgId,
          //     name: filename,
          //     url: this.BASE_URL_RoomImg + filename,
          //   });
          this.ShowImg(1);
        }
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
      const isLt1M = file.size / 1024 / 1024 < 5;
      if (!isJPG) {
        this.$message.error("上传房间图片只能是 jpg/png/gif/webm 格式!");
      }
      if (!isLt1M) {
        this.$message.error("上传房间图片大小不能超过 1MB!");
      }
      return isJPG && isLt1M;
    },
  },
};
</script>
<style lang="scss" scoped>
</style>