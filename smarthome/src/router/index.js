import Vue from 'vue';
import Router from 'vue-router';
import Home from '@/components/Home';
import ShowDevices from '@/components/ShowDevices';
import ShowSensors from '@/components/ShowSensors';
import Login from '@/components/Login';
import Register from '@/components/Register';

Vue.use(Router);

/* eslint-disable import/no-dynamic-require,global-require */
export default new Router({
  routes: [
    {
      path: '/login',
      name: 'Login',
      component: Login,
    },
    {
      path: '/register',
      name: 'Register',
      component: Register,
    },
    {
      path: '/',
      name: 'Hello',
      component: Home,
    },
    {
      path: '/home',
      name: 'Home',
      component: Home,
    },
    {
      path: '/show-devices',
      name: 'ShowDevices',
      component: ShowDevices,
      children: [
        {
          path: 'add-device',
          // 懒加载
          component: resolve => require(['@/components/NewDevice.vue'], resolve),
        },
        {
          path: 'edit-device',
          component: resolve => require(['@/components/EditDevice.vue'], resolve),
        },
      ],
    },
    {
      path: '/show-devices/show-sensors',
      name: 'ShowSensors',
      component: ShowSensors,
      children: [
        {
          path: 'add-sensor',
          component: resolve => require(['@/components/NewSensor.vue'], resolve),
        },
        {
          path: 'edit-sensor',
          component: resolve => require(['@/components/EditSensor.vue'], resolve),
        },
        {
          path: 'show-data',
          component: resolve => require(['@/components/ShowData.vue'], resolve),
        },
      ],
    },
  ],
});
