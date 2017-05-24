/**
 * Created by frank on 2017/5/4.
 */
import * as types from './mutations-type';

const axios = require('axios');

/* eslint-disable no-param-reassign */
export default {
  [types.SAVE_ROOM](state, room) {
    axios({
      method: 'POST',
      url: '/apis/rooms',
      data: {
        title: room.name,
        about: room.comment,
        tags: ['temperature', 'lab'],
      },
      headers: {
        'U-ApiKey': 'cd9cece70ad24efeb04a31749eb8e39f',
        'Content-Type': 'application/json',
      },
    }).then((response) => {
      const result = JSON.stringify(response.data);
      const item = result.substring(1, result.length - 1).split(':');
      const nRoom = {
        id: item[1],
        name: room.name,
        comment: room.comment,
      };
      state.roomList.push(nRoom);
    });
  },
  [types.DELETE_ROOM](state, idx) {
    const id = state.roomList[idx].id;
    state.devList.splice(idx, 1);
    axios({
      method: 'DELETE',
      url: `/apis/room/${id}`,
      headers: {
        'U-ApiKey': 'cd9cece70ad24efeb04a31749eb8e39f',
        'Content-Type': 'application/json',
      },
    });
  },
  [types.EDIT_ROOM](state, room) {
    axios({
      method: 'PUT',
      url: `/apis/device/${room.roomid}`,
      data: {
        title: room.name,
        about: room.comment,
        tags: ['temperature', 'lab'],
      },
      headers: {
        'U-ApiKey': 'cd9cece70ad24efeb04a31749eb8e39f',
        'Content-Type': 'application/json',
      },
    }).then(() => {
      const idx = room.roomidx;
      state.roomList.splice(idx, 1);
      const nRoom = {
        id: room.roomid,
        name: room.name,
        comment: room.comment,
      };
      state.roomList.push(nRoom);
    });
  },
  [types.SHOW_ROOM](state) {
    axios({
      method: 'GET',
      url: '/apis/rooms',
      headers: {
        'U-ApiKey': 'cd9cece70ad24efeb04a31749eb8e39f',
        'Content-Type': 'application/json',
      },
    }).then((response) => {
      // JSON 转化为字符串
      state.roomList.splice(0, state.roomList.length);
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
        const room = {
          id: id[1].substring(1, id[1].length - 1),
          name: title[1].substring(1, title[1].length - 1),
          comment: about[1].substring(1, about[1].length - 1),
        };
        state.roomList.push(room);
      }
    });
  },
  // 新增设备
  [types.SAVE_DEVICE](state, device) {
    // 设置默认值，未来我们可以做登入直接读取昵称和头像
    axios({
      method: 'POST',
      url: '/apis/devices',
      data: {
        room_id: device.roomid,
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
        'U-ApiKey': 'cd9cece70ad24efeb04a31749eb8e39f',
        'Content-Type': 'application/json',
      },
    }).then((response) => {
      const result = JSON.stringify(response.data);
      console.log(`save${result}`);// eslint-disable-line
      const item = result.substring(1, result.length - 1).split(':');
      const nDevice = {
        roomid: device.roomid,
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
        'U-ApiKey': 'cd9cece70ad24efeb04a31749eb8e39f',
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
        room_id: device.roomid,
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
        'U-ApiKey': 'cd9cece70ad24efeb04a31749eb8e39f',
        'Content-Type': 'application/json',
      },
    }).then((response) => {
      const result = JSON.stringify(response.data);
      // eslint-disable-next-line
      console.log(`edit${result}`);
      const idx = device.devidx;
      state.devList.splice(idx, 1);
      const nDevice = {
        roomid: device.roomid,
        id: device.deviceid,
        name: device.name,
        comment: device.comment,
      };
      state.devList.push(nDevice);
    });
  },
  // 查看设备
  [types.SHOW_DEVICE](state, idx) {
    if (idx === 999) {
      axios({
        method: 'GET',
        url: '/apis/devices',
        headers: {
          'U-ApiKey': 'cd9cece70ad24efeb04a31749eb8e39f',
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
    } else {
      const rid = state.roomList[idx].id;
      axios({
        method: 'GET',
        url: `/apis/room/${rid}/devices`,
        headers: {
          'U-ApiKey': 'cd9cece70ad24efeb04a31749eb8e39f',
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
            roomid: rid,
            id: id[1].substring(1, id[1].length - 1),
            name: title[1].substring(1, title[1].length - 1),
            comment: about[1].substring(1, about[1].length - 1),
          };
          state.devList.push(device);
        }
      });
    }
  },
  // 复制设备
  [types.COPY_DEVICE](state, device) {
    axios({
      method: 'POST',
      url: '/apis/devices',
      data: {
        room_id: device.roomid,
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
        'U-ApiKey': 'cd9cece70ad24efeb04a31749eb8e39f',
        'Content-Type': 'application/json',
      },
    }).then((response) => {
      const result = JSON.stringify(response.data);
      console.log(`save${result}`);// eslint-disable-line
      const item = result.substring(1, result.length - 1).split(':');
      const nDevice = {
        roomid: device.roomid,
        id: item[1],
        name: device.name,
        comment: device.comment,
      };
      state.devList.push(nDevice);
      axios({
        method: 'GET',
        url: `/apis/device/${device.oid}/sensors`,
        data: {
          room_id: device.roomid,
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
          'U-ApiKey': 'cd9cece70ad24efeb04a31749eb8e39f',
          'Content-Type': 'application/json',
        },
      }).then((response2) => {
        const result2 = JSON.stringify(response2.data);
        const list = result2.substring(1, result2.length - 2).split('},');
        for (let i = 0; i < list.length; i += 1) {
          // 解析每一个单个设备中的信息
          const items = list[i].substring(1).split(',');
          // items[0] id, items[1] device_id items[1] title, items[2] about
          const title = items[2].split(':');
          const about = items[3].split(':');
          const unit = items[8].split(':');
          const symbol = items[9].split(':');
          axios({
            method: 'POST',
            url: `/apis/device/${item[1]}/sensors`,
            data: {
              type: 'value',
              title: title[1].substring(1, title[1].length - 1),
              about: about[1].substring(1, about[1].length - 1),
              tags: ['temperature', 'lab'],
              unit: {
                name: unit[1].substring(1, unit[1].length - 1),
                symbol: symbol[1].substring(1, symbol[1].length - 1),
              },
            },
            headers: {
              'U-ApiKey': 'cd9cece70ad24efeb04a31749eb8e39f',
              'Content-Type': 'application/json',
            },
          });
        }
      });
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
        'U-ApiKey': 'cd9cece70ad24efeb04a31749eb8e39f',
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
        unit: sensor.unit,
        symbol: sensor.symbol,
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
        'U-ApiKey': 'cd9cece70ad24efeb04a31749eb8e39f',
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
    if (idx === 999) {
      axios({
        method: 'GET',
        url: '/apis/sensors',
        headers: {
          'U-ApiKey': 'cd9cece70ad24efeb04a31749eb8e39f',
          'Content-Type': 'application/json',
        },
      }).then((response) => {
        const result = JSON.stringify(response.data);
        const list = result.substring(1, result.length - 2).split('},');
        for (let i = 0; i < list.length; i += 1) {
          // 解析每一个单个设备中的信息
          const items = list[i].substring(1).split(',');
          // items[0] id, items[1] device_id items[1] title, items[2] about
          const id = items[0].split(':');
          const deviceid = items[1].split(':');
          const title = items[2].split(':');
          const about = items[3].split(':');
          const unit = items[8].split(':');
          const symbol = items[9].split(':');
          //
          const nsensor = {
            deviceId: deviceid[1],
            id: id[1],
            name: title[1].substring(1, title[1].length - 1),
            comment: about[1].substring(1, about[1].length - 1),
            unit: unit[1].substring(1, unit[1].length - 1),
            symbol: symbol[1].substring(1, symbol[1].length - 1),
          };
          state.senList.push(nsensor);
        }
      });
    } else {
      state.senList.splice(0, state.senList.length);
      const devid = state.devList[idx].id;
      axios({
        method: 'GET',
        url: `/apis/device/${devid}/sensors`,
        headers: {
          'U-ApiKey': 'cd9cece70ad24efeb04a31749eb8e39f',
          'Content-Type': 'application/json',
        },
      }).then((response) => {
        const result = JSON.stringify(response.data);
        const list = result.substring(1, result.length - 2).split('},');
        for (let i = 0; i < list.length; i += 1) {
          // 解析每一个单个设备中的信息
          const items = list[i].substring(1).split(',');
          // items[0] id, items[1] device_id items[1] title, items[2] about
          const id = items[0].split(':');
          const deviceid = items[1].split(':');
          const title = items[2].split(':');
          const about = items[3].split(':');
          const unit = items[8].split(':');
          const symbol = items[9].split(':');
          //
          const nsensor = {
            deviceId: deviceid[1],
            id: id[1],
            name: title[1].substring(1, title[1].length - 1),
            comment: about[1].substring(1, about[1].length - 1),
            unit: unit[1].substring(1, unit[1].length - 1),
            symbol: symbol[1].substring(1, symbol[1].length - 1),
          };
          state.senList.push(nsensor);
        }
      });
    }
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
        'U-ApiKey': 'cd9cece70ad24efeb04a31749eb8e39f',
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
  [types.SHOW_DATA](state, sensor) {
    const devid = sensor.deviceId;
    const senid = sensor.id;
    axios({
      method: 'GET',
      url: `/apis/device/${devid}/sensor/${senid}.json?start=2017-05-19T00:00:00&end=2017-05-19T23:59:59&interval=1&page=1`,
      headers: {
        'U-ApiKey': 'cd9cece70ad24efeb04a31749eb8e39f',
        'Content-Type': 'application/json',
      },
    }).then((response) => {
      const result = JSON.stringify(response.data);
      const list = result.substring(1, result.length - 2).split('},');
      state.dataList.splice(0, state.dataList.length);
      for (let i = 0; i < list.length; i += 1) {
        // 解析每一个单个设备中的信息
        const items = list[i].substring(1).split(',');
        // items[0] id, items[1] title, items[2] about
        const timestamp = items[0].split(':');
        const value = items[1].split(':');
        //
        const data = {
          timestamp: `${timestamp[1]}:${timestamp[2]}:${timestamp[3]}`,
          value: value[1],
        };
        state.dataList.push(data);
      }
    });
    // state.dataList.push();
  },
  [types.ON_SWITCH](state, idx) {
    state.switchList[idx].ison = true;
  },
  [types.OFF_SWITCH](state, idx) {
    state.switchList[idx].ison = false;
  },
  [types.SAVE_SWITCH](state, nswitch) {
    state.switchList.push(nswitch);
  },
  [types.DELETE_SWITCH](state, idx) {
    state.switchList.splice(idx, 1);
  },
};
