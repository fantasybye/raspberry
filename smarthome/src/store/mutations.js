/**
 * Created by frank on 2017/5/4.
 */
import * as types from './mutations-type';

const axios = require('axios');

/* eslint-disable no-param-reassign */
export default {
  // 新增设备
  [types.SAVE_DEVICE](state, device) {
    // 设置默认值，未来我们可以做登入直接读取昵称和头像
    axios({
      method: 'POST',
      url: '/apis/devices',
      data: {
        title: device.name,
        about: device.comment,
        tags: ['temperature', 'lab'],
        location: {
          local: 'Nanjing',
          latitude: 0.444,
          longitude: 0.555,
        },
      },
      headers: {
        'U-ApiKey': '6441e70eefc58fea0b1e938abf946a28',
        'Content-Type': 'application/json',
      },
    }).then((response) => {
      const result = JSON.stringify(response.data);
      const item = result.substring(1, result.length - 1).split(':');
      const nDevice = {
        id: item[1],
        name: device.name,
        comment: device.comment,
      };
      state.devList.push(nDevice);
    });
  },
  // 删除设备
  [types.DELETE_DEVICE](state, idx) {
    const id = state.devList[idx].id;
    state.devList.splice(idx, 1);
    axios({
      method: 'DELETE',
      url: `/apis/device/${id}`,
      headers: {
        'U-ApiKey': '6441e70eefc58fea0b1e938abf946a28',
        'Content-Type': 'application/json',
      },

    }).then((response) => {
      const result = JSON.stringify(response.data);
      // eslint-disable-next-line
      console.log(result);
    });
  },
  // 编辑设备
  [types.EDIT_DEVICE](state, device) {
    axios({
      method: 'PUT',
      url: `/apis/device/${device.deviceid}`,
      data: {
        title: device.name,
        about: device.comment,
        tags: ['temperature', 'lab'],
        location: {
          local: 'Nanjing',
          latitude: 0.444,
          longitude: 0.555,
        },
      },
      headers: {
        'U-ApiKey': '6441e70eefc58fea0b1e938abf946a28',
        'Content-Type': 'application/json',
      },
    }).then((response) => {
      const result = JSON.stringify(response.data);
      // eslint-disable-next-line
      console.log(3+result);
      const idx = device.devidx;
      state.devList.splice(idx, 1);
      const nDevice = {
        id: device.deviceid,
        name: device.name,
        comment: device.comment,
      };
      state.devList.push(nDevice);
    });
  },
  // 查看设备
  [types.SHOW_DEVICE](state) {
    axios({
      method: 'GET',
      url: '/apis/devices',
      headers: {
        'U-ApiKey': '6441e70eefc58fea0b1e938abf946a28',
        'Content-Type': 'application/json',
      },
    }).then((response) => {
      // JSON 转化为字符串
      state.devList.splice(0, state.devList.length);
      const result = JSON.stringify(response.data);
      // 将设备组合划分成每一个单个的设备 格式为{"id":"357396","title":"arduinotest","about":"testconnection"
      const list = result.substring(1, result.length - 2).split('},');
      for (let i = 0; i < list.length; i += 1) {
        // 解析每一个单个设备中的信息
        const items = list[i].substring(1).split(',');
        // items[0] id, items[1] title, items[2] about
        const id = items[0].split(':');
        const title = items[1].split(':');
        const about = items[2].split(':');
        //
        const device = {
          id: id[1].substring(1, id[1].length - 1),
          name: title[1].substring(1, title[1].length - 1),
          comment: about[1].substring(1, about[1].length - 1),
        };
        state.devList.push(device);
      }
    });
  },
  // 新增传感器
  [types.SAVE_SENSOR](state, sensor) {
    const devid = sensor.deviceId;
    axios({
      method: 'POST',
      url: `/apis/device/${devid}/sensors`,
      data: {
        type: 'value',
        title: sensor.name,
        about: sensor.comment,
        tags: ['temperature', 'lab'],
        unit: {
          name: sensor.unit,
          symbol: sensor.symbol,
        },
      },
      headers: {
        'U-ApiKey': '6441e70eefc58fea0b1e938abf946a28',
        'Content-Type': 'application/json',
      },
    }).then((response) => {
      const result = JSON.stringify(response.data);
      const item = result.substring(1, result.length - 1).split(':');
      const nSensor = {
        deviceId: devid,
        id: item[1],
        name: sensor.name,
        comment: sensor.comment,
      };
      state.senList.push(nSensor);
    });
  },
  // 删除传感器
  [types.DELETE_SENSOR](state, idx) {
    const senid = state.senList[idx].id;
    const devid = state.senList[idx].deviceId;
    state.senList.splice(idx, 1);
    axios({
      method: 'DELETE',
      url: `/apis/device/${devid}/sensor/${senid}`,
      headers: {
        'U-ApiKey': '6441e70eefc58fea0b1e938abf946a28',
        'Content-Type': 'application/json',
      },
    }).then((response) => {
      const result = JSON.stringify(response.data);
      // eslint-disable-next-line
      console.log(result);
    });
  },
  // 查看传感器
  [types.SHOW_SENSOR](state, idx) { // state) {
    state.senList.splice(0, state.senList.length);
    const devid = state.devList[idx].id;
    axios({
      method: 'GET',
      url: `/apis/device/${devid}/sensors`,
      headers: {
        'U-ApiKey': '6441e70eefc58fea0b1e938abf946a28',
        'Content-Type': 'application/json',
      },
    }).then((response) => {
      const result = JSON.stringify(response.data);
      const list = result.substring(1, result.length - 2).split('},');
      for (let i = 0; i < list.length; i += 1) {
        // 解析每一个单个设备中的信息
        const items = list[i].substring(1).split(',');
        // items[0] id, items[1] title, items[2] about
        const id = items[0].split(':');
        const title = items[1].split(':');
        const about = items[2].split(':');
        //
        const sensor = {
          deviceId: devid,
          id: id[1],
          name: title[1].substring(1, title[1].length - 1),
          comment: about[1].substring(1, about[1].length - 1),
        };
        state.senList.push(sensor);
      }
    });
  },
  // 编辑传感器
  [types.EDIT_SENSOR](state, sensor) {
    const senid = sensor.sensorId;
    const devid = sensor.deviceId;
    axios({
      method: 'PUT',
      url: `/apis/device/${devid}/sensor/${senid}`,
      data: {
        title: sensor.name,
        about: sensor.comment,
        tags: ['temperature', 'lab'],
        unit: {
          name: sensor.unit,
          symbol: sensor.symbol,
        },
      },
      headers: {
        'U-ApiKey': '6441e70eefc58fea0b1e938abf946a28',
        'Content-Type': 'application/json',
      },
    }).then((response) => {
      const result = JSON.stringify(response.data);
      // eslint-disable-next-line
      console.log(3+result);
      const idx = sensor.senidx;
      state.senList.splice(idx, 1);
      const nSensor = {
        deviceId: devid,
        id: senid,
        name: sensor.name,
        comment: sensor.comment,
        unit: sensor.unit,
        symbol: sensor.symbol,
      };
      state.senList.push(nSensor);
    });
  },
  // 展示数据
  [types.SHOW_DATA]() {
   // state.dataList.push();
  },
};

