<template>
  <div class="multipleColumn">
    <div id="main"></div>
  </div>
</template>

<style>
  .multipleColumn {
    height:400px;
    background-size: 100% 100%;
  }

  #main {
    width: 100%;
    height: calc(100% - 100px);
    margin-top: -15px;
  }
</style>

<script>
  /* eslint-disable no-param-reassign */
  /* eslint-disable no-underscore-dangle */
  import echarts from 'echarts';

  export default{
    created() {
      this.chartInterval = setInterval(() => { // 基于准备好的dom，初始化echarts实例
        this.myChart = echarts.init(document.getElementById('main'));
        this.myChart.setOption({
          tooltip: {
            show: true,
          },
          xAxis: [
            {
              type: 'category',
              data: ['衬衫', '羊毛衫', '雪纺衫', '裤子', '高跟鞋', '袜子'],
            },
          ],
          yAxis: [
            {
              type: 'value',
            },
          ],
          series: [
            {
              name: '销量',
              type: 'bar',
              data: [5, 20, 40, 10, 10, 20],
            },
          ],
        });
      }, 10000);
    },
    beforeDestroy: {
      function() {
        clearInterval(this.chartInterval);
      },
    },
  };

</script>
