<template>
  <div class="form-horizontal">
    <div class="form-group">
      <div class="col-sm-6">
        <label>传感器名称</label>
        <input type="text" class="form-control" v-model="name" placeholder="Name">
      </div>
      <div class="col-sm-6">
        <label>传感器类型</label>
        <select class="form-control"><option value="value">数值型传感器</option></select>
      </div>
    </div>
    <div class="form-group">
      <div class="col-sm-12">
        <label>传感器介绍</label>
        <input type="text" class="form-control" v-model="comment" placeholder="Comment">
      </div>
    </div>
    <div class="form-group">
      <div class="col-sm-8">
        <label>传感器单位</label>
        <input type="text" class="form-control" v-model="unit" placeholder="Unit">
      </div>
      <div class="col-sm-2">
        <label>符号</label>
        <input type="text" class="form-control" v-model="symbol">
      </div>
    </div>
    <button class="btn btn-primary" @click="save()">保存</button>
    <router-link to="/show-devices/show-sensors" class="btn btn-danger">取消</router-link>
    <hr>
  </div>
</template>

<script>
  export default{
    data() {
      const index = this.$route.query.id;
      const sensor = this.$store.state.senList[index];
      return {
        deviceId: sensor.deviceId,
        name: sensor.name,
        comment: sensor.comment,
        unit: sensor.unit,
        symbol: sensor.symbol,
      };
    },
    methods: {
      save() {
        if (this.name === '' || this.name.trim() === '') {
          alert('传感器名不能为空！'); // eslint-disable-line
        } else {
          const index = this.$route.query.id;
          const sensor = {
            senidx: index,
            deviceId: this.$store.state.senList[index].deviceId,
            sensorId: this.$store.state.senList[index].id,
            name: this.name,
            comment: this.comment,
            unit: this.unit,
            symbol: this.symbol,
          };
          this.$store.dispatch('editSensor', sensor);
          // this.axios.post().then();
          this.$router.go(-1);
        }
      },
    },
  };
</script>
