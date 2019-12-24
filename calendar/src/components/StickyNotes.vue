<template>
  <div class="container">
    <div class="x-div clear">
      <img :src="xUrl" />
    </div>
    <ul class="note-view">
      <li>
          <ul class="note-ul">
              <li class="note-li-num"></li>
              <li class="note-li-content"><textarea >这是一个测试活动活动活动活动活动活动活动活动活动活动活动活动</textarea></li>
              <li class="note-li-level">123</li>
          </ul>
      </li>
      <li>123123</li>
      <li>123123</li>
      <li>123123</li>
      <li>123123</li>
      <li>123123</li>
      <li>123123</li>
    </ul>
  </div>
</template>
<script>
import x_icon from "../assets/icon/x-icon.png";
export default {
  data() {
    return {
      xUrl: x_icon
    };
  }
};
</script>
<style lang="less" scoped>
.container {
  width: 980px;
  height: 610px;
  margin: 0;
  padding: 0;
  background-color: #fdf5e6;
  /* margin: 0 auto; */
  position: absolute;
  left: calc(~"50% - 490px");
  z-index: 999;
}
.x-div {
  float: right;
  margin-right: 10px;
}
.note-view {
  padding: 0;
  margin-top: 70px;
  list-style: none;
}
.note-view > li{
    height: 70px;
    line-height: 70px;
    border: 1px solid red;
}
.note-ul {
  padding: 0;
  margin:0 auto;
  list-style: none;
  width: 900px;
  height: 100%;
}
.note-ul > li{
    float: left;
}
.note-li-num{
    width: 50px;
}
.note-li-content{
    width: 800px;
}
.note-li-content > textarea{
    width: 800px;
    height: 65px;
    border: none;
    background-color: #fdf5e6;
    margin-top:1px;
}
.note-li-level{
    width: 50px;
}
</style>