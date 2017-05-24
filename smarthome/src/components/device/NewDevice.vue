<template>
  <div class="form-horizontal">
    <div class="form-group">
      <div class="col-sm-6">
        <label>设备名称</label>
        <input type="text" class="form-control" v-model="name" placeholder="Name">
      </div>
      <div class="col-sm-6">
        <label>房间选择</label>
        <select v-model="room" class="form-control">
          <option v-for="room in rooms" :value="room.id">
            {{ room.name }}
          </option>
        </select>
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
      return {
        name: '',
        comment: '',
      };
    },
    computed: {
      rooms() {
        return this.$store.state.roomList;
      },
    },
    methods: {
      save() {
        if (this.name === '' || this.name.trim() === '') {
          alert('设备名不能为空！'); // eslint-disable-line
        } else {
          const device = {
            roomid: this.room,
            name: this.name,
            comment: this.comment,
          };
          this.$store.dispatch('saveDevice', device);
          this.$router.go(-1);
        }
      },
    },
  };
</script>
