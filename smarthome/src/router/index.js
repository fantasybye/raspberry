import Vue from 'vue';
import Router from 'vue-router';
import Home from '@/components/UI/Home';
import Login from '@/components/user/Login';
import Register from '@/components/user/Register';
import Help from '@/components/UI/Help';
import ShowDevices from '@/components/device/ShowDevices';
import ShowSensors from '@/components/sensor/ShowSensors';
import ShowRooms from '@/components/room/ShowRooms';
import SensorList from '@/components/sensor/SensorList';
import Welcome from '@/components/UI/Welcome';
import Menu from '@/components/UI/Menu';
import SwitchList from '@/components/switch/SwitchList';

Vue.use(Router);

/* eslint-disable import/no-dynamic-require,global-require */
export default new Router({
  routes: [
    {
      path: '/',
      component: Menu,
    },
    {
      path: '/menu',
      component: Menu,
      children: [
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
      ],
    },
    {
      path: '/home',
      name: 'Hello',
      component: Welcome,
      children: [
        {
          path: '/home',
          name: 'Home',
          component: Home,
        },
        {
          path: '/help',
          name: 'Help',
          component: Help,
        },
        {
          path: '/sensor-list',
          component: SensorList,
        },
        {
          path: '/show-rooms',
          component: ShowRooms,
          children: [
            {
              path: 'add-room',
              component: resolve => require(['@/components/room/NewRoom.vue'], resolve),
            },
            {
              path: 'edit-room',
              component: resolve => require(['@/components/room/EditRoom.vue'], resolve),
            },
          ],
        },
        {
          path: '/show-devices',
          name: 'ShowDevices',
          component: ShowDevices,
          children: [
            {
              path: 'add-device',
              // 懒加载
              component: resolve => require(['@/components/device/NewDevice.vue'], resolve),
            },
            {
              path: 'copy-device',
              component: resolve => require(['@/components/device/CopyDevice.vue'], resolve),
            },
            {
              path: 'edit-device',
              component: resolve => require(['@/components/device/EditDevice.vue'], resolve),
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
              component: resolve => require(['@/components/sensor/NewSensor.vue'], resolve),
            },
            {
              path: 'edit-sensor',
              component: resolve => require(['@/components/sensor/EditSensor.vue'], resolve),
            },
            {
              path: 'show-data',
              component: resolve => require(['@/components/data/ShowData.vue'], resolve),
            },
          ],
        },
        {
          path: '/switch-list',
          component: SwitchList,
          children: [
            {
              path: 'add-switch',
              component: resolve => require(['@/components/switch/NewSwitch.vue'], resolve),
            },
          ],
        },
      ],
    },
  ],
});
