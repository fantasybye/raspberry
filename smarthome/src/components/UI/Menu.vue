<template>
  <div id="app">
    <div id="menu">
      <canvas id="canvas" class="canvas"></canvas>
      <transition name="fade-out">
        <div v-if="$route.path==='/menu'||$route.path==='/'">
          <div class="logo-bg"></div>
          <div class="lrnav">
            <router-link to="/login">
              <a class="gv" href="javascript:;" @click="Login()">登录</a>
            </router-link>
            <router-link to="/register">
              <a class="gv" href="javascript:;" @click="Register()">注册</a>
            </router-link>
          </div>
        </div>
      </transition>

      <transition name="fade-in">
        <router-view :customer="customer" :login="login" @back="back" :admin="admin"></router-view>
      </transition>
      <div class="city"></div>
      <div class="moon"></div>
    </div>
  </div>
</template>

<script>
  import Stars from '../../../static/js/Star';
  import Moon from '../../../static/js/Moon';
  import Meteor from '../../../static/js/Meteor';

  export default {
    data() {
      return {
        login: false,
        customer: false,
        admin: false,
      };
    },
    created() {
      if (sessionStorage.id) {
        this.$router.push('/matters');
      }
    },
    mounted() {
      const canvas = document.getElementById('canvas');
      const ctx = canvas.getContext('2d');
      const width = window.innerWidth;
      const height = window.innerHeight;
      // 实例化月亮和星星。流星是随机时间生成，所以只初始化数组
      const moon = new Moon(ctx, width, height);
      const stars = new Stars(ctx, width, height, 200);
      const meteors = [];
      let count = 0;

      canvas.width = width;
      canvas.height = height;

      const meteorGenerator = () => {
        // x位置偏移，以免经过月亮
        const x = (Math.random() * width) + 800;
        meteors.push(new Meteor(ctx, x, height));

        // 每隔随机时间，生成新流星
        setTimeout(() => {
          meteorGenerator();
        }, Math.random() * 2000);
      };

      const frame = () => {
        count += 1;
        count % 10 === 0 && stars.blink();// eslint-disable-line
        moon.draw();
        stars.draw();

        meteors.forEach((meteor, index, arr) => {
          // 如果流星离开视野之内，销毁流星实例，回收内存
          if (meteor.flow()) {
            meteor.draw();
          } else {
            arr.splice(index, 1);
          }
        });
        requestAnimationFrame(frame);
      };
      meteorGenerator();
      frame();
    },
    methods: {
      Login() {
        this.login = true;
      },
      Register() {
        this.login = false;
      },
      back() {
        this.login = false;
      },
    },
  };
</script>

<style>
  *{
    margin: 0;
    padding: 0;
  }
  body,html{
    width: 100%;
    height: 100%;
    /* background: rgba(7,17,27,0.96); */
  }
  a {
    text-decoration: none;
    /* color: #333; */
  }
  #app {
    font-family: 'Avenir', Helvetica, Arial, sans-serif;
    width: 100%;
    height: 100%;
  }
  #menu {
    height: 100%;
    overflow: hidden;
    position: relative;
  }

  .canvas {
    position: fixed;
    z-index: -1;
  }

  .logo-bg {
    width: 800px;
    height: 200px;
    position: absolute;
    z-index: 10000;
    top: 80px;
    left: 50%;
    transform: translateX(-50%);
    background: url('../../assets/top_logo.png') no-repeat;
  }

  .lrnav {
    width: 200px;
    height: auto;
    position: absolute;
    z-index: 10000;
    top: 300px;
    left: 50%;
    margin-left: -100px;
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
  .city {
    width: 100%;
    height: 170px;
    position: fixed;
    bottom: 0px;
    z-index: 100;
    background: url('../../assets/city.png') no-repeat;
    background-size: cover;
  }
  .moon {
    width: 100px;
    height: 100px;
    position: absolute;
    left: 100px;
    top: 100px;
    background: url('../../assets/moon.png') no-repeat;
    background-size: cover;
  }
  .fade-out-enter-active, .fade-out-leave-active {
    transition: all .5s
  }
  .fade-out-enter, .fade-out-leave-active {
    opacity: 0;
    transform: translateX(-400px);
  }

  .fade-in-enter-active, .fade-in-leave-active {
    transition: all .5s
  }
  .fade-in-enter, .fade-in-leave-active {
    opacity: 0;
    transform: translateX(400px);
  }
</style>
