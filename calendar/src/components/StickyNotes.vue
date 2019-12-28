<template>
  <div class="container" v-show="divStatus">
    <div class="x-div" @click="closeWin">
      <img :src="xUrl"  />
    </div>
    <ul class="note-view">
      <li v-for="(item,i) in taskDatas" :key="i">
        <ul class="note-ul">
          <li class="note-li-num">{{item.taskNum}}</li>
          <li class="note-li-content">
            <textarea
              v-model.trim="item.taskValue"
              :class="item.taskStatus?'note-li-content-ok':''"
            ></textarea>
          </li>
          <li class="note-li-level"></li>
        </ul>
      </li>
    </ul>
    <ul class="note-task">
      <li
        v-for="(item,index) in taskStatusList"
        :class="item.taskLvl"
        :key="index"
        @click="finishTask(item)"
      ></li>
    </ul>
  </div>
</template>
<script>
import x_icon from "../assets/icon/x-icon.png";
export default {
  data() {
    return {
      xUrl: x_icon,
      taskDatas: [],
      divStatus: false
    };
  },
  watch: {
    taskDatas: {
      handler: function(newValue) {
        newValue.forEach(function(v) {
          v.taskStatus = v.taskValue == "" ? null : v.taskStatus ? true : false;
        });
        return newValue;
      },
      deep: true
    }
  },
  computed: {
    taskStatusList: function() {
      let arr = [];
      let taskLvls = [
        "task-high-urgent",
        "task-high-normal",
        "task-high-normal",
        "task-high-normal",
        "task-low-urgent",
        "task-low-urgent",
        "task-low-normal"
      ];
      this.taskDatas.forEach(function(v, i) {
        if (v.taskStatus === true) {
          arr.push({
            taskLvl: `${taskLvls[i]} task-finish`,
            taskIndex: i
          });
        }
        if (v.taskStatus === false) {
          arr.unshift({
            taskLvl: `${taskLvls[i]} task-start`,
            taskIndex: i
          });
        }
      });
      return arr;
    }
  },
  methods: {
    initTasks: function() {
      let taskDatas = [];
      let nums = ["一、", "二、", "三、", "四、", "五、", "六、", "七、"];
      nums.forEach(function(v, i) {
        taskDatas.push({
          taskIndex: i,
          taskNum: v,
          taskValue: "",
          taskStatus: null
        });
      });
      return taskDatas;
    },
    finishTask(task) {
      this.taskDatas[task.taskIndex].taskStatus = !this.taskDatas[
        task.taskIndex
      ].taskStatus;
      this.$set(this.taskDatas, task.taskIndex, this.taskDatas[task.taskIndex]);
    },
    closeWin() {
      this.divStatus = !this.divStatus;
    }
  },
  created: function() {
    this.taskDatas = this.initTasks();
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
  margin: 70px 0px 0px 0px;
  list-style: none;
}
.note-view > li {
  height: 70px;
  line-height: 70px;
  // border: 1px solid red;
}
.note-ul {
  padding: 0;
  margin: 0 auto;
  list-style: none;
  width: 900px;
  height: 100%;
}
.note-ul > li {
  height: 100%;
  font-size: 25px;
  float: left;
  padding: 0px;
  margin: 0px;
  line-height: 40px;
  font-family: "Microsoft YaHei";
  color: #2b2b2b;
}
.note-li-num {
  width: 50px;
  text-align: right;
}
.note-li-content {
  width: 800px;
}
.note-li-content > textarea {
  width: 100%;
  height: 64px;
  // border: 0;
  border-top: none;
  border-left: none;
  border-right: none;
  border-bottom: 1px solid #ededed;
  background-color: #fdf5e6;
  margin-top: 1px;
  resize: none;
  outline: none;
  font-size: 25px;
  font-family: "Microsoft YaHei";
  color: #2b2b2b;
}
.note-li-content-ok {
  border-bottom: 1px solid #cdcdb4 !important;
}
textarea::-webkit-scrollbar {
  width: 5px;
}
textarea::-webkit-scrollbar-thumb {
  /*滚动条里面小方块*/
  border-radius: 10px;
  box-shadow: inset 0 0 5px transparent;
  background: transparent;
}
textarea::-webkit-scrollbar-track {
  /*滚动条里面轨道*/
  box-shadow: inset 0 0 5px transparent;
  border-radius: 10px;
  background: transparent;
}
.note-li-level {
  width: 40px;
  height: 80%;
}
.note-task {
  margin-top: 45px;
  margin-bottom: 0px;
  padding: 0;
  // float: right;
  list-style: none;
  width: 100%;
  height: 5px;
}
.note-task > li {
  // float: right;
  width: 40px;
  border: none;
  height: 100%;
  cursor: pointer;
}
.task-high-urgent {
  // border-left: 10px solid #ee3b3b;
  // float: left;
  background-color: #ee3b3b;
}
.task-high-normal {
  // float: right;
  // border-top: 15px solid #ffb90f;
  background-color: #ffb90f;
}
.task-low-urgent {
  // float: right;
  // border-top: 15px solid #4682b4;
  background-color: #4682b4;
}
.task-low-normal {
  // border-top: 15px solid #828282;
  background-color: #828282;
}
.task-finish {
  float: left;
}
.task-start {
  float: right;
}
</style>