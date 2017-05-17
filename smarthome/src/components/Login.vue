<template>
  <div class="form-horizontal">
    <div class="form-group">
      <div class="col-sm-6">
        <label>用户名:</label>
        <input type="text" class="form-control" v-model="name" placeholder="Username">
      </div>
    </div>
    <div class="form-group">
      <div class="col-sm-6">
        <label>密码:</label>
        <input type="password" class="form-control" v-model="name" placeholder="Password">
        <!--<span >密码错误</span>-->
      </div>
    </div>
    <div class="col-sm-6">
      <button class="btn btn-primary login-button" @click="login()">登 录</button>
    </div>
  </div>
</template>

<style>
  .login-button{
    float: right;
  }
</style>

<script>
  export default {
    data() {
      return {
        usrname: '',
        password: '',
      };
    },
    methods: {
      login() {
        this.$router.go(-1);
      },
    },
  };
</script>
