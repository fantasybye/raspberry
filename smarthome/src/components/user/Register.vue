<template>
  <div id="regist">
    <router-link to="/menu">
      <div class="back" @click="back()"></div>
    </router-link>

    <div class="regist-box">
      <div class="logo"></div>
      <form>
        <div class="ipunt-wrap">
          <label for="username" class="icon-user"></label>
          <input type="text" id="username" placeholder="姓名" v-model="username">
        </div>
        <div class="ipunt-wrap">
          <label for="password" class="icon-password"></label>
          <input type="password" id="password" placeholder="密码" v-model="password">
        </div>
        <div class="ipunt-wrap">
          <label for="confirmpassword" class="icon-password"></label>
          <input type="password" id="confirmpassword" placeholder="确认密码" v-model="confirmpassword">
        </div>
        <div class="button">
          <a class="gv" href="javascript:" @click="Register">注册</a>
        </div>
        <div class="toregist">
          已有账号？<router-link to="/login"><a href="javascript:">去登录</a></router-link>
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
        confirmpassword: '',
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
      Register() {
        if (!this.username || !this.password || !this.confirmpassword) {
          this.dialog = true;
          this.dialogMsg = '请填写完整';
          return;
        }
        if (this.password !== this.confirmpassword) {
          this.dialog = true;
          this.dialogMsg = '两次密码不相等';
          return;
        }
        this.$ajax({
          method: 'POST',
          url: '/apis/register',
          data: {
            username: this.username,
            password: this.password,
          },
          headers: {
            'Content-Type': 'application/json',
          },
        }).then((response) => {
          const result = JSON.stringify(response.data);
          if (result !== 'register failed') {
            sessionStorage.username = this.username;
            this.username = '';
            this.password = '';
            const items = result.substring(1, result.length - 1).split(':');
            sessionStorage.apikey = items[1].substring(1, items[1].length - 1);
            this.dialog = true;
            this.dialogMsg = '注册成功，正在前往登录';
            this.$router.push('/login');
          } else {
            this.dialog = true;
            this.dialogMsg = '注册失败';
          }
        });
      },
    },
  };
</script>

<style scoped>
  #regist {
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

  .regist-box {
    width: 700px;
    padding: 50px;
    margin: 40px auto;
    display: flex;
    z-index: 10001;
  }
  .regist-box .logo{
    width: 300px;
    height: 120px;
    margin: 30px;
    background: url('../../assets/logo.png') no-repeat;
    /* background: red; */
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
    z-index: 10001;
  }
  .toregist a{
    color: #066197;
    text-decoration: none;
  }
</style>
