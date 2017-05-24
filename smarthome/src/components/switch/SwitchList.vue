<template>
  <div>
    <router-link
      v-if="$route.path === '/switch-list'"
      to="/switch-list/add-switch"
      class="btn btn-primary">
      增加一个新开关
    </router-link>

    <div v-if="$route.path === '/switch-list/add-switch'">
      <h3>增加一个新开关</h3>
    </div>
    <hr>
    <div>
      <p v-if="!switches.length&&$route.path === '/switch-list'"><strong>还没有任何房间</strong></p>
      <div class="list-group">
        <router-view></router-view>
      </div>
      <div v-if="$route.path === '/switch-list'" class="col-sm-10">
        <table class="table table-bordered table-switch">
          <tr v-for="(item,index) in switches">
            <td class="text-center col-sm-1">{{ index+1 }}</td>
            <td class="col-sm-6">{{ item.name }}</td>
            <td class="text-center col-sm-2 radio">
              <button :class="{'btn btn-primary btn-sm onoff':item.ison,'btn btn-default btn-sm onoff':!item.ison}" @click="on(index)" >ON</button>
              <button :class="{'btn btn-default btn-sm onoff':item.ison,'btn btn-primary btn-sm onoff':!item.ison}" @click="off(index)">OFF</button>
            </td>
            <td class="text-center col-sm-1">
              <button class="btn btn-danger btn-sm switch-btn"
                      @click="del(index)"
                      data-toggle="dialog" data-target="#layer"
              >删除</button>
            </td>
          </tr>
          <tr v-show="switches.length === 0">
            <td colspan="4" class="text-center">
              <p>暂无数据</p>
            </td>
          </tr>
        </table>
      </div>
    </div>
  </div>
</template>

<style>
  tr{
    vertical-align: inherit;
  }
  td{
    border:1px solid #ddd;
  }
  .onoff{
    width:50px;
    margin: 5px;
  }
  .switch-btn{
    margin: 5px;
  }
</style>
<script>
  export default{
    computed: {
      switches() {
        return this.$store.state.switchList;
      },
    },
    methods: {
      del(idx) {
        this.$store.dispatch('deleteSwitch', idx);
      },
      on(idx) {
        this.$store.dispatch('onSwitch', idx);
      },
      off(idx) {
        this.$store.dispatch('offSwitch', idx);
      },
    },
  };
</script>
