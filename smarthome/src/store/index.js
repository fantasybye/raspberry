/**
 * Created by frank on 2017/5/4.
 */
import Vue from 'vue';
import Vuex from 'vuex';
import actions from './actions';
import mutations from './mutations';

Vue.use(Vuex);

// 单一状态树
const state = {
  roomList: [], // 房间
  devList: [], // 设备
  senList: [], // 传感器
  dataList: [], // 数据点
  switchList: [
    {
      name: '客厅门开关',
      ison: true,
    },
    {
      name: '客厅灯开关',
      ison: true,
    },
    {
      name: '卧室门开关',
      ison: false,
    },
    {
      name: '卧室灯开关',
      ison: false,
    },
  ],
};


export default new Vuex.Store({
  state,
  mutations,
  actions,
});
