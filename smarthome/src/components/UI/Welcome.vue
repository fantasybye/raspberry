<template>
  <div id="wrapper">
    <nav class="navbar navbar-default">
      <div class="container">
        <!--<a class="navbar-brand" href="#">-->
        <!--<i class="glyphicon glyphicon-time"></i>-->
        <!--计划板-->
        <!--</a>-->
        <ul class="nav navbar-nav">
          <li><router-link to="/home"> 首页</router-link></li>
          <li><router-link to="/show-rooms"> 房间列表</router-link></li>
          <li><router-link :to="{path:'/show-devices',query:{id:999}}">设备列表</router-link></li>
          <li><router-link to="/sensor-list">传感器列表</router-link></li>
          <li><router-link to="/switch-list">开关列表</router-link></li>
          <li><router-link to="/help">帮助</router-link></li>
          <!--<li><router-link to="/api">API</router-link></li>-->
          <!--<li class="lr"><router-link to="/login">登录</router-link></li>-->
          <!--<li class="lr"><router-link to="/register">注册</router-link></li>-->
          <!--<li><router-link to="/show-devices/show-sensors/show-data">test</router-link></li>-->
        </ul>
        <router-link class="logout" to="/menu">注销</router-link>
        <label id="welcome" class="logout" >欢迎!  {{ username }}</label>
      </div>
    </nav>
    <div class="container">
      <!--<div class="col-sm-3">-->
      <!--<sidebar></sidebar>-->
      <!--</div>-->
      <div class="col-sm-12">
        <router-view></router-view>
      </div>
      <footer class="footer navbar-fixed-bottom">
        <div class="footerdiv">
          <hr>
          <h6 class="footer">欢迎使用智能家居环境监控系统，如遭遇问题，请联系15850566780</h6>
        </div>
      </footer>
    </div>
  </div>
</template>
<script>
  export default{
    data() {
      return {
        username: sessionStorage.username,
      };
    },
  };
</script>
<style>
  #welcome{
    color:darkgray;
    font-weight: normal;
  }
  .logout{
    float: right;
    margin-right: 30px;
    margin-top: 15px;
  }
  .footer{
    text-align: center;
    padding: 10px;
  }
  .footerdiv{
    margin: 0 auto;
    width: 80%;
  }
</style>
