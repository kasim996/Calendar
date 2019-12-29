<template>
  <div class="container" v-show="divStatus">
    <div class="x-div" @click="showNote">
      <img :src="xUrl" />
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
    <div class="bottom-div">{{selectDay}}</div>
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
import localStore from "../utils/localStore";
import task from "../components/model/task";
// import notification from "../utils/notification";

export default {
  data() {
    return {
      xUrl: x_icon,
      taskDatas: [],
      divStatus: false,
      dailyItem: null
    };
  },
  watch: {
    taskDatas: {
      handler: function(newValue) {
        newValue.forEach(function(v) {
          v.taskStatus = v.taskValue == "" ? null : v.taskStatus ? true : false;
        });
        localStore.saveItem(this.dailyItem.toString(), newValue);
        return newValue;
      },
      deep: true
    },
    divStatus: function(newVaule) {
      if (!newVaule) {
        this.$emit("flushNoteStatus");
      }
    }
  },
  computed: {
    taskStatusList: function() {
      let arr = [];
      let taskLvls = task.getTaskLvls();
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
    },
    selectDay: function() {
      if (this.dailyItem) {
        return this.dailyItem.toCNDate();
      } else {
        return "";
      }
    }
  },
  methods: {
    initTasks: function(item) {
      let taskDatas =
        localStore.getItem(item.toString()) || task.getInitTaskDatas();
      return taskDatas;
    },
    finishTask(task) {
      let taskData = this.taskDatas[task.taskIndex];
      taskData.taskStatus = !taskData.taskStatus;
      this.$set(this.taskDatas, task.taskIndex, taskData);
    },
    showNote(item) {
      if (item.year) {
        this.dailyItem = item;
        this.taskDatas = this.initTasks(item);
      }
      this.divStatus = !this.divStatus;
    }
  },
  created: function() {
    // this.taskDatas = this.initTasks();
  }
};
</script>
<style lang="less" scoped>
.container {
  width: 980px;
  height: 610px;
  background-color: #fdf5e6;
  position: absolute;
  left: calc(~"50% - 490px");
  z-index: 999;
}
.bottom-div {
  float: right;
  height: 35px;
  width: 900px;
  line-height: 35px;
  text-align: right;
  margin-right: 30px;
  margin-top: 30px;
  font-size: 20px;
  color: #2b2b2b;
}
.x-div {
  float: right;
  margin-right: 10px;
}
.note-view {
  margin: 45px 0px 0px 0px;
  list-style: none;
}
.note-view > li {
  height: 70px;
  line-height: 70px;
}
.note-ul {
  margin: 0 auto;
  list-style: none;
  width: 900px;
  height: 100%;
}
.note-ul > li {
  height: 100%;
  font-size: 25px;
  float: left;
  line-height: 40px;
  color: #666666;
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
  border: none;
  border-bottom: 1px solid #ededed;
  background-color: #fdf5e6;
  margin-top: 1px;
  resize: none;
  outline: none;
  font-size: 25px;
  color: #666666;
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
  margin-top: 70px;
  margin-bottom: 0px;
  list-style: none;
  width: 100%;
  height: 5px;
}
.note-task > li {
  width: 40px;
  border: none;
  height: 100%;
  cursor: pointer;
}
.task-high-urgent {
  background-color: #ee3b3b;
}
.task-high-normal {
  background-color: #ffb90f;
}
.task-low-urgent {
  background-color: #4682b4;
}
.task-low-normal {
  background-color: #828282;
}
.task-finish {
  float: left;
}
.task-start {
  float: right;
}
</style>