<template>
  <div class="form-horizontal">
    <div class="form-group">
      <div class="col-sm-8">
        <label>设备名称</label>
        <input type="text" class="form-control" v-model="name" placeholder="Name">
      </div>
    </div>
    <div class="form-group">
      <div class="col-sm-12">
        <label>设备介绍</label>
        <input type="text" class="form-control" v-model="comment" placeholder="Comment">
      </div>
    </div>
    <button class="btn btn-primary" @click="save()">保存</button>
    <router-link to="/show-devices" class="btn btn-danger">取消</router-link>
    <hr>
  </div>
</template>

<script>
  export default{
    data() {
      const index = this.$route.query.id;
      const device = this.$store.state.devList[index];
      return {
        name: device.name,
        comment: device.comment,
      };
    },
    methods: {
      save() {
        if (this.name === '' || this.name.trim() === '') {
          alert('设备名不能为空！'); // eslint-disable-line
        } else {
          const index = this.$route.query.id;
          const devid = this.$store.state.devList[index].id;
          const device = {
            devidx: index,
            name: this.name,
            comment: this.comment,
            deviceid: devid,
          };
          this.$store.dispatch('editDevice', device);
          this.$router.go(-1);
        }
      },
    },
  };
</script>
