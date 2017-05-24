<template>
  <div id="login">
    <router-link to="/menu">
      <div class="back" @click="back()"></div>
    </router-link>

    <div class="login-box">
      <div class="logo"></div>
      <form>
        <div class="ipunt-wrap">
          <label for="username" class="icon-user"></label>
          <input type="text" id="username" placeholder="用户名" v-model="username">
        </div>
        <div class="ipunt-wrap">
          <label for="password" class="icon-password"></label>
          <input type="password" id="password" placeholder="密码" v-model="password">
        </div>
        <div class="button">
          <a class="gv" href="javascript:;" @click="Login()">登录</a>
        </div>
        <div class="toregist" >
          还没有账号？<router-link to="/register"><a href="javascript:;">去注册</a></router-link>
        </div>
      </form>
    </div>
    <v-dialog v-show="dialog" :dialog-msg="dialogMsg" @confirm="confirm"></v-dialog>
  </div>
</template>

<script>

  import dialog from '../UI/Dialog';

  export default {
    components: {
      'v-dialog': dialog,
    },
    props: {
      login: {
        type: Boolean,
      },
    },
    data() {
      return {
        username: '',
        password: '',
        dialog: false,
        dialogMsg: '',
      };
    },

    methods: {
      confirm() {
        this.dialog = false;
      },
      back() {
        this.$emit('back');
      },
      Login() {
        if (!this.username || !this.password) {
          this.dialog = true;
          this.dialogMsg = '请填写完整';
          return;
        }
        this.$ajax({
          method: 'POST',
          url: '/apis/apikey',
          data: {
            username: this.username,
            password: this.password,
          },
          headers: {
            'Content-Type': 'application/json',
          },
        }).then((response) => {
          const result = JSON.stringify(response.data);
          if (result !== "user doesn't exist" && result !== "password doesn't match") {
            sessionStorage.username = this.username;
            this.username = '';
            this.password = '';
            const items = result.substring(1, result.length - 1).split(':');
            sessionStorage.apikey = items[1].substring(1, items[1].length - 1);
            this.$router.push('/home');
          } else {
            alert('用户名或密码出错');// eslint-disable-line
          }
        });
      },
    },
  };
</script>

<style scoped>
  #login {
    height: 100%;
    overflow: hidden;
    position: relative;
  }
  .back{
    position: fixed;
    left: 20px;
    top: 20px;
    width: 30px;
    height: 30px;
    background: url('../../assets/back.png') no-repeat;
    background-size: cover;
    cursor: pointer;
  }

  .gv {
    text-decoration: none;
    background: url('../../assets/nav_gv.png') repeat 0px 0px;
    width: 130px;
    height: 43px;
    display: block;
    text-align: center;
    line-height: 43px;
    cursor: pointer;
    float: left;
    margin: 10px 2px 10px 2px;
    font: 18px/43px 'microsoft yahei';
    color: #066197;
  }
  a.gv:hover {
    background: url('../../assets/nav_gv.png') repeat 0px -43px;
    color:#1d7eb8;
    -webkit-box-shadow: 0 0 6px #1d7eb8;
    transition-duration: 0.5s;
  }

  .login-box {
    width: 600px;
    padding: 50px;
    margin: 40px auto;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    z-index: 100001;
  }
  .login-box .logo{
    width: 270px;
    height: 108px;
    margin-bottom: 20px;
    background: url('../../assets/logo.png') no-repeat;
    background-size: cover;
  }
  .ipunt-wrap label{
    display: inline-block;
    width: 25px;
    height: 25px;
    vertical-align: middle;
    margin-right: 10px;
    background-size: cover;
  }
  .icon-user{
    background: url('../../assets/user.png') no-repeat;
  }
  .icon-password{
    background: url('../../assets/password.png') no-repeat;
  }

  .ipunt-wrap input{
    border: none;
    outline: none;
    background: none;
    border-bottom: 1px solid #fff;
    margin-top: 30px;
    width: 200px;
    height: 30px;
    line-height: 30px;
    /* text-align: center; */
    color: #fff;
    font-size: 14px;
    padding: 0 5px;
  }
  .button {
    margin-top: 30px;
    margin-left: 60px
  }
  .toregist{
    font-size: 12px;
    float: right;
    padding-top: 20px;
    color: #fff;
  }
  .toregist a{
    color: #066197;
    text-decoration: none;
  }
</style>
