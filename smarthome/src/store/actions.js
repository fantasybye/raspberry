/**
 * Created by frank on 2017/5/4.
 */
import * as types from './mutations-type';

export default {
  saveDevice({ commit }, device) {
    commit(types.SAVE_DEVICE, device);
  },
  deleteDevice({ commit }, idx) {
    commit(types.DELETE_DEVICE, idx);
  },
  editDevice({ commit }, devid) {
    commit(types.EDIT_DEVICE, devid);
  },
  showDevice({ commit }) {
    commit(types.SHOW_DEVICE);
  },
  showSensor({ commit }, idx) {
    commit(types.SHOW_SENSOR, idx);
  },
  saveSensor({ commit }, sensor) {
    commit(types.SAVE_SENSOR, sensor);
  },
  deleteSensor({ commit }, idx) {
    commit(types.DELETE_SENSOR, idx);
  },
  editSensor({ commit }, sensor) {
    commit(types.EDIT_SENSOR, sensor);
  },
  showData({ commit }) {
    commit(types.SHOW_DATA);
  },
};
