<template>
  <div>
    <StickyNotes ref="StickyNotes" @flushNoteStatus="flushNoteStatus"></StickyNotes>
    <div class="header">
      <ul class="calendar-top">
        <li>
          <div :class="['arrow-left',clickNum > 0 ? 'arrow-rightclick':'']" @click="addMonth(-1)"></div>
        </li>
        <li class="header-center-li" @click="resetMonth()">{{selectMonth}}</li>
        <li>
          <div :class="['arrow-right',clickNum < 0 ? 'arrow-leftclick':'']" @click="addMonth(1)"></div>
        </li>
      </ul>
    </div>
    <div class="container">
      <ul class="calendar-view">
        <li class="top-li left-li">星期日</li>
        <li class="top-li">星期一</li>
        <li class="top-li">星期二</li>
        <li class="top-li">星期三</li>
        <li class="top-li">星期四</li>
        <li class="top-li">星期五</li>
        <li class="top-li">星期六</li>
        <li
          v-for="(item,index) in weeksOfMonth"
          :key="index"
          :class="item.className"
          @click="showNote(item)"
        >
          <div
            :class="['task-view', item.dailyStatus.dailyClass]"
            v-if="item.dailyStatus.taskStatus !== ''"
          >
            <img :src="crown_icon" v-if="item.dailyStatus.taskStatus" />
          </div>
          <div>
            <div class="holiday" v-if="item.holiday !== null && item.holiday.holiday">休</div>
            <div class="workday" v-if="item.holiday !== null && !item.holiday.holiday">班</div>
            {{item.date}}
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>
<script>
import utils from "../utils/calendar";
import StickyNotes from "../components/StickyNotes";
import task from "../components/model/task";
import localStore from "../utils/localStore";
import notification from "../utils/notification";
import crown_icon from "../assets/icon/crown.png";

export default {
  components: {
    StickyNotes
  },
  data() {
    return {
      selectDate: null,
      weeksOfMonth: [],
      clickNum: 0,
      divStatus: true,
      selectItem: null,
      crown_icon
    };
  },
  methods: {
    addMonth: function(num) {
      let ymd = utils.getYMD(this.selectDate);
      this.selectDate = new Date(ymd.year, ymd.month + num, 1);
      this.clickNum += num;
    },
    resetMonth: function() {
      this.selectDate = new Date();
      this.clickNum = 0;
    },
    getHoliday: async function(d) {
      let res = null;
      try {
        res = await this.$axios({
          method: "get",
          url: "http://timor.tech/api/holiday/batch?d=" + d
        });
      } catch (err) {
        res = {
          data: {
            holiday: null
          }
        };
      }
      return res;
    },
    getWeeksOfMonth: async function(d) {
      let ymd = utils.getYMD(new Date());
      let list = utils.getDaysOfMonth(d);
      let dates = "";
      list.forEach(function(v, i) {
        let className = "";
        if (i % 7 === 0) {
          className += "left-li ";
        }
        if (ymd.month !== v.month) {
          className += "other-day ";
        } else if (ymd.toString() === v.toString()) {
          className += "current-day ";
          v.select = true;
        } else if (ymd.date < v.date) {
          className += "afterday ";
          v.select = false;
        } else {
          className += "day ";
          v.select = false;
        }
        v.className = className;
        dates += v.toString() + ",";
      });
      let res = await this.getHoliday(dates);
      list.forEach(function(v) {
        v.holiday = res.data.holiday ? res.data.holiday[v] : null;
        v.dailyStatus = task.getDailyStatus(localStore.getItem(v.toString()));
      });
      return list;
    },
    flushNoteStatus: function() {
      this.weeksOfMonth.forEach(function(v) {
        v.dailyStatus = task.getDailyStatus(localStore.getItem(v.toString()));
      });

      if (this.selectItem.select) {
        if (this.selectItem.dailyStatus.taskStatus === true) {
          notification.showMsgNotification(
            this.selectItem.toString(),
            `您今日任务已全部完成！`
          );
        } else if (this.selectItem.dailyStatus.taskStatus === false) {
          notification.showMsgNotification(
            this.selectItem.toString(),
            `您今日还有"${task.getTaskLvlCN(
              this.selectItem.dailyStatus.dailyClass
            )}"任务尚未完成！`
          );
        }
      }
    },
    showNote: function(item) {
      this.selectItem = item;
      this.$refs.StickyNotes.showNote(item);
    }
  },
  watch: {
    selectDate: async function(newValue) {
      this.weeksOfMonth = await this.getWeeksOfMonth(newValue);
    }
  },
  computed: {
    selectMonth: function() {
      return utils.getYMD(this.selectDate).toYearMonth();
    }
  },
  created: function() {
    this.selectDate = new Date();
    let self = this;
    let time = (function() {
      // return 20000;
      return (
        utils.getAddDate(self.selectDate, 1).getTime() -
        self.selectDate.getTime() +
        2 * 60 * 60 * 1000
      );
    })();
    let fulshStore = function() {
      let lastDay = utils.getYMD(utils.getAddDate(new Date(), -1));
      let currentDay = utils.getYMD(new Date());
      let lastItem = localStore.getItem(lastDay.toString()) || [];
      let currentItem = localStore.getItem(currentDay.toString()) || task.getInitTaskDatas();
      lastItem.forEach(function(v, i) {
        if (v.taskStatus === false) {
          currentItem[i].taskValue += "\r\n" + v.taskValue;
          currentItem[i].taskStatus = false;
          v.taskValue = null;
          v.taskStatus = null;
        }
      });
      localStore.saveItem(lastDay.toString(), lastItem);
      localStore.saveItem(currentDay.toString(), currentItem);
    };
    let timer = () => {
      setTimeout(function() {
        fulshStore();
        self.resetMonth();
        timer();
      }, time);
    };
    timer();
  }
};
</script>
<style lang="less" scoped>
.header {
  margin: 0px auto;
  width: 980px;
  text-align: center;
}
.calendar-top {
  width: 450px;
  height: 60px;
  margin: 0 auto;
  border: none;
}
.calendar-top > li {
  width: 150px;
  height: 60px;
  line-height: 60px;
  float: left;
  font-size: 24px;
}
.arrow-left {
  width: 10px;
  height: 10px;
  float: right;
  border-top: 2px solid #d1d1d1;
  border-left: 2px solid #d1d1d1;
  margin: 24.3px 0px 0px 10px;
  -webkit-transform: rotate(-45deg);
  transform: rotate(-45deg);
}
.arrow-left:hover {
  border-top: 3px solid #4a4a4a;
  border-left: 3px solid #4a4a4a;
}
.arrow-rightclick {
  border-top: 3px solid #adadad;
  border-left: 3px solid #adadad;
}
.arrow-right {
  width: 10px;
  height: 10px;
  float: left;
  border-top: 2px solid #d1d1d1;
  border-right: 2px solid #d1d1d1;
  margin: 24.3px 0px 0px 0px;
  -webkit-transform: rotate(45deg);
  transform: rotate(45deg);
}
.arrow-right:hover {
  border-top: 3px solid #4a4a4a;
  border-right: 3px solid #4a4a4a;
}
.arrow-leftclick {
  border-top: 3px solid #adadad;
  border-right: 3px solid #adadad;
}
.header-center-li {
  cursor: pointer;
}
.header-center-li:hover {
  font-weight: bold;
}
.container {
  text-align: center;
  margin: 0px auto;
  width: 980px;
  font-size: 26px;
  color: #a6a6a6;
}
.calendar-view {
  border-top: 1px #d1d1d1 solid;
  height: 539px;
}
.calendar-view > li {
  width: 139px;
  height: 99px;
  line-height: 99px;
  float: left;
  border-bottom: 1px #d1d1d1 solid;
  border-right: 1px #d1d1d1 solid;
  position: relative;
}
li.top-li {
  height: 39px;
  line-height: 39px;
  background-color: #eaeaea;
  color: #2b2b2b;
  font-size: 22px;
}
li.left-li {
  width: 138px;
  border-left: 1px #d1d1d1 solid;
}
.other-day {
  background: linear-gradient(
    45deg,
    #f0f0f0 25%,
    #f7f7f7 0,
    #f7f7f7 50%,
    #f0f0f0 0,
    #f0f0f0 75%,
    #f7f7f7 0
  );
  background-size: 30px 30px;
}
.current-day {
  background-color: #fdf5e6;
  font-weight: bold;
  color: #2b2b2b;
}
.select {
  border: 2px solid #d1d1d1;
  margin: 0px auto;
  margin-top: 6.5px;
  height: 82px;
  line-height: 82px;
  width: 122px;
}
.afterday {
  background-color: #f7f7f7;
  color: #2b2b2b;
}
.afterday:hover {
  font-weight: bold;
}
.day {
  background-color: #f7f7f7;
  color: #666666;
}
.day:hover {
  font-weight: bold;
}
.workday {
  width: 30px;
  height: 30px;
  color: red;
  line-height: 30px;
  position: absolute;
  font-weight: bold;
  font-size: 18px;
}
.holiday {
  width: 30px;
  height: 30px;
  color: green;
  line-height: 30px;
  position: absolute;
  font-weight: bold;
  font-size: 18px;
}
.task-view {
  width: 0;
  height: 0;
  border-left: 15px solid transparent;
  position: absolute;
  right: 0px;
}
.task-high-urgent {
  border-top: 15px solid #ee3b3b;
}
.task-high-normal {
  border-top: 15px solid #ffb90f;
}
.task-low-urgent {
  border-top: 15px solid #4682b4;
}
.task-low-normal {
  border-top: 15px solid #828282;
}
.task-ok {
  width: 30px;
  height: 30px;
  line-height: 0;
  text-align: right;
}
</style>