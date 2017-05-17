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
  devList: [], // 设备
  senList: [], // 传感器
  dataList: [], // 数据点
};


export default new Vuex.Store({
  state,
  mutations,
  actions,
});
