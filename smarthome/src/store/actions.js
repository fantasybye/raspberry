/**
 * Created by frank on 2017/5/4.
 */
import * as types from './mutations-type';

export default {
  saveRoom({ commit }, room) {
    commit(types.SAVE_ROOM, room);
  },
  deleteRoom({ commit }, idx) {
    commit(types.DELETE_ROOM, idx);
  },
  editRoom({ commit }, room) {
    commit(types.EDIT_ROOM, room);
  },
  showRoom({ commit }) {
    commit(types.SHOW_ROOM);
  },
  saveDevice({ commit }, device) {
    commit(types.SAVE_DEVICE, device);
  },
  deleteDevice({ commit }, idx) {
    commit(types.DELETE_DEVICE, idx);
  },
  editDevice({ commit }, devid) {
    commit(types.EDIT_DEVICE, devid);
  },
  showDevice({ commit }, idx) {
    commit(types.SHOW_DEVICE, idx);
  },
  copyDevice({ commit }, device) {
    commit(types.COPY_DEVICE, device);
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
  showData({ commit }, sensor) {
    commit(types.SHOW_DATA, sensor);
  },
  saveSwitch({ commit }, nswitch) {
    commit(types.SAVE_SWITCH, nswitch);
  },
  deleteSwitch({ commit }, idx) {
    commit(types.DELETE_SWITCH, idx);
  },
  showSwitch({ commit }) {
    commit(types.SHOW_SWITCH);
  },
  onSwitch({ commit }, idx) {
    commit(types.ON_SWITCH, idx);
  },
  offSwitch({ commit }, idx) {
    commit(types.OFF_SWITCH, idx);
  },
};
