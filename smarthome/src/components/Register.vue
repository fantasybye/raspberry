<template>
  <div class="form-horizontal">
    <div class="form-group">
      <div class="col-sm-6">
        <label>请输入用户名:</label>
        <input type="text" class="form-control" v-model="name" placeholder="Username">
        <!--<span>用户名不可用</span>-->
    </div>
    </div>
    <div class="form-group">
      <div class="col-sm-6">
        <label>请输入密码:</label>
        <input type="password" class="form-control" v-model="password" placeholder="Password">
        <span></span>
      </div>
    </div>
    <div class="form-group">
      <div class="col-sm-6">
        <label>再次输入密码:</label>
        <input type="password" class="form-control" v-model="cpassword" placeholder="Confirm">
        <!--<span>两次密码不一致</span>-->
      </div>
    </div>
    <div class="col-sm-6">
      <button class="btn btn-primary login-button" @click="register()">注 册</button>
    </div>
  </div>
</template>

<script>
  export default{
    data() {
      return {
        name: '',
        password: '',
        cpassword: '',
      };
    },
    methods: {
      register() {
        const user = {
          username: this.name,
          password: this.password,
        };
        this.$store.dispatch('register', user);
      },
    },
  };
</script>
