<template>
  <div>
    <router-link
      v-if="$route.path === '/show-rooms'"
      to="/show-rooms/add-room"
      class="btn btn-primary">
      增加一个新房间
    </router-link>

    <div v-if="$route.path === '/show-rooms/add-room'">
      <h3>增加一个新房间</h3>
    </div>
    <div v-if="$route.path === '/show-rooms/edit-room'">
      <h3>编辑该房间</h3>
    </div>
    <hr>
    <!--<router-view></router-view>-->
    <div>
      <p v-if="!rooms.length&&$route.path === '/show-rooms'"><strong>还没有任何房间</strong></p>
      <div class="list-group">
        <router-view></router-view>
      </div>
      <div v-if="$route.path === '/show-rooms'" class="list-group">
        <!--
        v-for 循环，注意参数顺序为(item,index) in items
        -->
        <a v-for="(room,index) in rooms">
          <div class="row list-group-item">
            <div class="col-sm-2 details">
              <img src="../../assets/room.png" class="avatar img-circle img-responsive" />
              <p class="text-center">
                <strong> {{ room.name }}</strong>
              </p>
            </div>

            <div class="col-sm-8">
              <p class="comment-section">
                <strong> 房间id：</strong>
                {{ room.id }}
              </p>
              <p class="comment-section">
                <strong> 房间介绍：</strong>
                {{ room.comment }}
              </p>
            </div>

          </div>
          <div class="row button-row">
            <button
              class="btn btn-xs btn-danger device-button"
              @click="deleteRoom(index)">
              删除该房间
            </button>
            <router-link
              :to="{path:'/show-rooms/edit-room',query:{id:index}}"
              class="btn btn-xs btn-primary device-button">
              编辑该房间
            </router-link>
            <router-link
              :to="{path:'/show-devices',query:{id:index}}"
              class="btn btn-xs btn-success device-button">
              查看房间设备
            </router-link>
          </div>
          <hr>
        </a>
      </div>
    </div>
  </div>
</template>

<script>
  export default{
    computed: {
      rooms() {
        return this.$store.state.roomList;
      },
    },
    methods: {
      deleteRoom(idx) {
        // 删除该设备
        this.$store.dispatch('deleteRoom', idx);
      },
    },
//    created() {
//      const vm = this;
//      vm.$nextTick(() => {
//        vm.$store.dispatch('showDevice');
//      });
//    },
    mounted() {
      const vm = this;
      vm.$nextTick(() => {
        vm.$store.dispatch('showRoom');
      });
    },
//    watch: {
//      devices: this.$store.dispatch('showDevice'),
//    },
  };
</script>

<style>
  .avatar {
    height: 75px;
    margin: 0 auto;
    margin-top: 10px;
    margin-bottom: 10px;
  }
  .details {
    background-color: #f5f5f5;
    border-right: 1px solid #ddd;
    margin: -10px -15px;
  }
  .comment-section {
    margin-left: 40px;
    margin-top: 20px;
  }
  .button-row{
    height: 30px;
  }
  .device-button {
    float: right;
    margin: 10px;
  }
</style>
