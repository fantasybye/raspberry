<template>
  <div>
    <!--:to="{path:'/show-devices/show-sensors/add-sensor',query:{id:devIdx}}"-->
    <button
      v-if="$route.path === '/show-devices/show-sensors'"
      @click ="push()"
      class="btn btn-primary">
      增加一个新传感器
    </button>

    <div v-if="$route.path === '/show-devices/show-sensors/add-sensor'">
      <h3>增加一个新传感器</h3>
    </div>
    <div v-if="$route.path ==='/show-devices/show-sensors/show-data'" class="col-sm-12">
      <p>
        <label>tips：传感器动态数据每3秒刷新一次</label>
      </p>
    </div>
    <hr>
    <!--<router-view></router-view>-->
    <div class="show-sensors">
      <p v-if="!sensors.length&&$route.path === '/show-devices/show-sensors'"><strong>还没有任何传感器</strong></p>
      <div class="list-group">
        <router-view></router-view>
      </div>
      <div v-if=" $route.path === '/show-devices/show-sensors'"class="list-group">
        <!--
        v-for 循环，注意参数顺序为(item,index) in items
        -->
        <a v-for="(sensor,index) in sensors">
          <div class="row list-group-item">
            <div class="col-sm-2 details">
              <img src="../../assets/sensor.png" class="avatar img-circle img-responsive" />
              <p class="text-center">
                <strong> {{ sensor.name }}</strong>
              </p>
            </div>

            <div class="col-sm-8">
              <p class="comment-section">
                <strong> 传感器类型：</strong>
                数值型传感器
              </p>
              <p class="comment-section">
                <strong>传感器id：</strong>
                {{ sensor.id }}
              </p>
              <p class="comment-section">
                <strong> 传感器介绍：</strong>
                {{ sensor.comment }}
              </p>
            </div>

          </div>
          <div class="row button-row">
            <button
              class="btn btn-xs btn-danger sensor-button"
              @click="deleteSensor(index)">
              删除该传感器
            </button>
            <router-link
              :to="{path:'/show-devices/show-sensors/edit-sensor',query:{id:index}}"
              class="btn btn-xs btn-primary device-button">
              编辑该传感器
            </router-link>
            <router-link
              :to="{path:'/show-devices/show-sensors/show-data',query:{id:index}}"
              class="btn btn-xs btn-success device-button">
              查看数据图
            </router-link>
          </div>
          <hr>
        </a>
      </div>

    </div>
  </div>
</template>
<style>
  .avatar {
    height: 75px;
    margin-top: 10px;
    margin-bottom: 10px;
  }

  .details{
    background-color: #ffffff;
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
  .sensor-button {
    float: right;
    margin: 10px;
  }
</style>

<script>
  export default {
    computed: {
      sensors() {
        return this.$store.state.senList;
      },
    },
    methods: {
      push() {
        const index = this.$route.query.id;
        const devId = this.$store.state.devList[index].id;
        this.$router.push({
          path: '/show-devices/show-sensors/add-sensor',
          query: { id: devId },
        });
      },
      deleteSensor(idx) {
        this.$store.dispatch('deleteSensor', idx);
      },
    },

    mounted() {
      const vm = this;
      const idx = this.$route.query.id;
      vm.$nextTick(() => {
        vm.$store.dispatch('showSensor', idx);
      });
    },
  };
</script>
