<template>
  <div class="form-horizontal">
    <div class="form-group">
      <div class="col-sm-6">
        <label>设备选择</label>
        <select v-model="device" class="form-control">
          <option v-for="device in devices" :value="device.id">
            {{ device.name }}
          </option>
        </select>
      </div>
    </div>
    <div class="form-group">
      <div class="col-sm-6">
        <label>房间选择</label>
        <select v-model="room" class="form-control">
          <option v-for="room in rooms" :value="room.id">
            {{ room.name }}
          </option>
        </select>
      </div>
    </div>
    <button class="btn btn-primary" @click="save()">保存</button>
    <router-link to="/show-devices" class="btn btn-danger">取消</router-link>
    <hr>
  </div>
</template>

<script>
  export default{
    computed: {
      rooms() {
        return this.$store.state.roomList;
      },
      devices() {
        return this.$store.state.devList;
      },
    },
    methods: {
      save() {
        const idx = this.device;
        const device = this.$store.state.devList[idx - 1];
        const ndevice = {
          roomid: this.room,
          oid: device.id,
          name: device.name,
          comment: device.comment,
        };
        this.$store.dispatch('copyDevice', ndevice);
        this.$router.go(-1);
      },
    },
  };
</script>
