<template>
  <div class="form-horizontal">
    <div class="form-group">
      <div class="col-sm-6">
        <label>开关名称</label>
        <input type="text" class="form-control" v-model="name" placeholder="Name">
      </div>
      <div class="col-sm-2">
        <label>开关状态</label>
        <select v-model="onoff" class="form-control">
          <option value="true">ON</option>
          <option value="false">OFF</option>
        </select>
      </div>
    </div>
    <br>
    <hr>
    <button class="btn btn-primary" @click="save()">保存</button>
    <router-link to="/switch-list" class="btn btn-danger">取消</router-link>
  </div>
</template>

<script>
  export default{
    data() {
      return {
        name: '',
        onoff: true,
      };
    },
    methods: {
      save() {
        if (this.name === '' || this.name.trim() === '') {
          alert('开关名不能为空！'); // eslint-disable-line
        } else {
          const nswitch = {
            name: this.name,
            ison: this.onoff,
          };
          this.$store.dispatch('saveSwitch', nswitch);
          this.$router.go(-1);
        }
      },
    },
  };
</script>
