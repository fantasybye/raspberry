<template>
  <div>
    <div>
      <router-link
        v-if="$route.path === '/show-devices'"
        to="/show-devices/add-device"
        class="btn btn-primary">
        增加一个设备
      </router-link>

      <router-link
        v-if="$route.path === '/show-devices'"
        to="/show-devices/copy-device"
        class="btn btn-success">
        复制一个设备
      </router-link>
    </div>
    <div v-if="$route.path === '/show-devices/add-device'">
      <h3>增加一个设备</h3>
    </div>
    <div v-if="$route.path === '/show-devices/copy-device'">
      <h3>复制一个设备</h3>
    </div>
    <div v-if="$route.path === '/show-devices/edit-device'">
      <h3>编辑该设备</h3>
    </div>
    <hr>
    <!--<router-view></router-view>-->
    <div>
      <p v-if="!devices.length&&$route.path === '/show-devices'"><strong>还没有任何设备</strong></p>
      <div class="list-group">
        <router-view></router-view>
      </div>
      <div v-if="$route.path === '/show-devices'" class="list-group">
        <!--
        v-for 循环，注意参数顺序为(item,index) in items
        -->
        <a v-for="(device,index) in devices">
          <div class="row list-group-item">
            <div class="col-sm-2 details">
              <img src="../../assets/sensor.png" class="avatar img-circle img-responsive" />
              <p class="text-center">
                <strong> {{ device.name }}</strong>
              </p>
            </div>

            <div class="col-sm-8">
              <p class="comment-section">
                <strong> 房间id：</strong>
                {{ device.roomid }}
              </p>
              <p class="comment-section">
                <strong> 设备id：</strong>
                {{ device.id }}
              </p>
              <p class="comment-section">
                <strong> 设备介绍：</strong>
                {{ device.comment }}
              </p>
            </div>

          </div>
          <div class="row button-row">
            <button
              class="btn btn-xs btn-danger device-button"
              @click="deleteDevice(index)">
              删除该设备
            </button>
            <router-link
              v-if="$route.path !== '/show-devices/edit-device'"
              :to="{path:'/show-devices/edit-device',query:{id:index}}"
              class="btn btn-xs btn-primary device-button">
              编辑该设备
            </router-link>
            <router-link
              :to="{path:'/show-devices/show-sensors',query:{id:index}}"
              class="btn btn-xs btn-success device-button">
              查看传感器
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
    name: 'ShowDevices',
    computed: {
      devices() {
        return this.$store.state.devList;
      },
    },
    methods: {
      deleteDevice(idx) {
        // 删除该设备
        this.$store.dispatch('deleteDevice', idx);
      },
    },
//    created() {
//      const vm = this;
//      vm.$nextTick(() => {
//        vm.$store.dispatch('showDevice');
//      });
//    },
    created() {
      const vm = this;
      vm.$nextTick(() => {
        vm.$store.dispatch('showRoom');
      });
    },
    mounted() {
      const vm = this;
      const idx = this.$route.query.id;
      vm.$nextTick(() => {
        vm.$store.dispatch('showDevice', idx);
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
    margin-top: 10px;
  }
  .button-row{
    height: 30px;
  }
  .device-button {
    float: right;
    margin: 10px;
  }
</style>
