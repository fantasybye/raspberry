<template>
  <div>
    <div class="jumbotron helptitle">
      <p>
        <h3 class="helph3">你好！这里是帮助，下面是一些简单的使用说明。</h3>
      </p>
    </div>
    <div class="col-sm-10 help" >
      <ul>
        <li class="helpli"><h3 class="helph3">房间列表</h3></li>
        <hr>
        <h4 class="help">在这里可以对所监控的家居环境房间进行管理，还可以进一步部署房间里的设备。</h4>
        <br>
        <li class="helpli"><h3 class="helph3">设备列表</h3></li>
        <hr>
        <h4 class="help">在这里可以看到家居环境中所有存在的设备，并可以进一步查看设备所拥有的传感器。</h4>
        <br>
        <li class="helpli"><h3 class="helph3">传感器列表</h3></li>
        <hr>
        <h4 class="help">在这里可以看到家居环境中所有的传感器，并可以进步查看传感器的数据图。</h4>
        <li class="helpli"><h3 class="helph3">开关列表</h3></li>
        <hr>
        <h4 class="help">在这里可以查看并控制家居环境中所有的开关。</h4>
      </ul>
    </div>
  </div>
</template>

<style>
  .helptitle{
    padding-top: 20px;
    padding-bottom: 20px;
  }
  .helph3{
    color:midnightblue;
  }
  .helpli{
    padding-right: 20px;
    margin-right: -10px;
    list-style-type:circle;
  }
  .help{
   text-indent: 30px;
  }
</style>
