<template>
  <div><div class="main" ref="main"></div></div>
</template>
<script>
//导入echarts
import * as echarts from "echarts";
export default {
  data() {
    return {
      totalTypePrice: [],
    };
  },
  async mounted() {
    //获取每种房型的销售额
    let res = await this.$get("/RoomType/TotalTypePrice");
    this.totalTypePrice = res;

    // 基于准备好的dom，初始化echarts实例
    var myChart = echarts.init(this.$refs.main);
    // 绘制图表
    myChart.setOption({
      title: {
        text: "客房类型销售统计表",
      },
      tooltip: {},
      xAxis: {
        data: this.totalTypePrice.map((r) => r.roomtypeName),
      },
      yAxis: {},
      series: [
        {
          name: "销量",
          type: "bar",
          data: this.totalTypePrice.map((r) => r.totalMoney),
        },
      ],
    });
  },
};
</script>
<style lang="scss" scoped>
.main {
  width: 1000px;
  height: 500px;
  border: 1px solid #ccc;
  padding: 20px;
}
</style>