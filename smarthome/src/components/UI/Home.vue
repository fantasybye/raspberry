<template>
  <div class="jumbotron">
    <!--<canvas id="canvas" class="canvas"></canvas>-->
    <div>
      <p>
        <strong>
          <router-link to="/show-rooms">你好！这里是首页，点我就可以开始！</router-link>
        </strong>
      </p>
    </div>
    <!--<div class="city"></div>-->
    <!--<div class="moon"></div>-->
  </div>
</template>

<!--<script>-->
  <!--/* eslint-disable */-->
  <!--import Stars from '../../../static/js/Star'-->
  <!--import Moon from '../../../static/js/Moon'-->
  <!--import Meteor   from '../../../static/js/Meteor'-->

  <!--export default{-->
    <!--mounted() {-->
      <!--let canvas = document.getElementById('canvas'),-->
        <!--ctx = canvas.getContext('2d'),-->
        <!--width = window.innerWidth,-->
        <!--height = window.innerHeight,-->
        <!--//实例化月亮和星星。流星是随机时间生成，所以只初始化数组-->
        <!--moon = new Moon(ctx, width, height),-->
        <!--stars = new Stars(ctx, width, height, 200),-->
        <!--meteors = [],-->
        <!--count = 0-->

      <!--canvas.width = width;-->
      <!--canvas.height = height;-->

      <!--const meteorGenerator = ()=> {-->
        <!--//x位置偏移，以免经过月亮-->
        <!--let x = Math.random() * width + 800-->
        <!--meteors.push(new Meteor(ctx, x, height))-->

        <!--//每隔随机时间，生成新流星-->
        <!--setTimeout(()=> {-->
          <!--meteorGenerator()-->

        <!--}, Math.random() * 2000)-->
      <!--}-->

      <!--const frame = ()=>{-->
        <!--count++-->
        <!--count % 10 == 0 && stars.blink()-->
        <!--moon.draw()-->
        <!--stars.draw()-->

        <!--meteors.forEach((meteor, index, arr)=> {-->
          <!--//如果流星离开视野之内，销毁流星实例，回收内存-->
          <!--if (meteor.flow()) {-->
            <!--meteor.draw()-->
          <!--} else {-->
            <!--arr.splice(index, 1)-->
          <!--}-->
        <!--})-->
        <!--requestAnimationFrame(frame)-->
      <!--}-->
      <!--meteorGenerator()-->
      <!--frame()-->
    <!--},-->
  <!--};-->
<!--</script>-->

<!--<style scoped>-->
  <!--#home {-->
    <!--height: 100%;-->
    <!--overflow: hidden;-->
    <!--position: relative;-->
    <!--margin: 0;-->
  <!--}-->

  <!--.canvas {-->
    <!--position: fixed;-->
    <!--z-index: -1;-->
  <!--}-->
  <!--.city {-->
    <!--width: 100%;-->
    <!--height: 170px;-->
    <!--position: fixed;-->
    <!--bottom: 0px;-->
    <!--z-index: 100;-->
    <!--background: url('../../assets/city.png') no-repeat;-->
    <!--background-size: cover;-->
  <!--}-->
  <!--.moon {-->
    <!--width: 100px;-->
    <!--height: 100px;-->
    <!--position: absolute;-->
    <!--left: 100px;-->
    <!--top: 100px;-->
    <!--background: url('../../assets/moon.png') no-repeat;-->
    <!--background-size: cover;-->
  <!--}-->
  <!--.fade-out-enter-active, .fade-out-leave-active {-->
    <!--transition: all .5s-->
  <!--}-->
  <!--.fade-out-enter, .fade-out-leave-active {-->
    <!--opacity: 0;-->
    <!--transform: translateX(-400px);-->
  <!--}-->

  <!--.fade-in-enter-active, .fade-in-leave-active {-->
    <!--transition: all .5s-->
  <!--}-->
  <!--.fade-in-enter, .fade-in-leave-active {-->
    <!--opacity: 0;-->
    <!--transform: translateX(400px);-->
  <!--}-->
<!--</style>-->
