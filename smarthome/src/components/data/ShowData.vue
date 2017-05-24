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
//    computed: {
//      name: () => {
//        const idx = this.$route.query.id;
//        const sensor = this.$store.state.senList[idx];
//        return sensor.name;
//      },
//      unit: () => {
//        const idx = this.$route.query.id;
//        const sensor = this.$store.state.senList[idx];
//        return sensor.unit;
//      }
//    },
    created() {
      this.chartInterval = setInterval(() => { // 基于准备好的dom，初始化echarts
        const idx = this.$route.query.id;
        const sensor = this.$store.state.senList[idx];
        this.$store.dispatch('showData', sensor);
        if (this.$store.state.dataList.length === 0) {
          this.myChart = echarts.init(document.getElementById('main'));
          this.myChart.showLoading();
        } else {
          let timeStr = `[${this.$store.state.dataList[0].timestamp}`;
          let valueStr = `[${this.$store.state.dataList[0].value}`;
          for (let i = 1; i < this.$store.state.dataList.length; i += 1) {
            timeStr += ',';
            timeStr += this.$store.state.dataList[i].timestamp;
            valueStr += ',';
            valueStr += `"${this.$store.state.dataList[i].value}"`;
          }
          timeStr += ']';
          valueStr += ']';
          const time = JSON.parse(timeStr);
          const value = JSON.parse(valueStr);

          this.myChart = echarts.init(document.getElementById('main'));
          this.myChart.hideLoading();
          this.myChart.setOption({
            tooltip: {
              show: true,
            },
            xAxis: [
              {
                name: '时间',
                data: time,
                // ['2017-05-13T14:32:20', '2017-05-14T12:32:20', '2017-05-14T15:32:20',
                // '2017-05-15T14:32:20', '2017-05-15T14:32:21', '2017-05-15T14:32:26'],
              },
            ],
            yAxis: [
              {
                name: sensor.unit,
                type: 'value',
              },
            ],
            series: [
              {
                type: 'line',
                data: value,
                // [5, 20, 40, 10, 10, 20],
              },
            ],
          });
        }
      }, 3000);
    },
    beforeDestroy: {
      stop() {
        clearInterval(this.chartInterval);
      },
    },
  };
</script>
