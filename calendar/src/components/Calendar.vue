<template>
  <div>
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
        <li v-for="(item,index) in weeksOfMonth" :key="index" :class="item.className">
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
export default {
  data() {
    return {
      selectDate: null,
      weeksOfMonth: [],
      clickNum: 0
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
        } else {
          className += "day ";
        }
        v.className = className;
        dates += v.toString() + ",";
      });
      let res = await this.$axios({
        method: "get",
        url: "http://timor.tech/api/holiday/batch?d=" + dates
      });
      list.forEach(function(v) {
        v.holiday = res.data.holiday[v];
      });
      return list;
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
  }
};
</script>
<style scoped>
ul,
li {
  padding: 0;
  margin: 0;
  list-style: none;
}

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
  margin: 0;
  float: left;
  /* border-top: 1px #d1d1d1 solid; */
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
.container {
  text-align: center;
  margin: 0px auto;
  width: 980px;
}
.calendar-view {
  border-top: 1px #d1d1d1 solid;
  height: 539px;
}
.calendar-view > li {
  width: 139px;
  height: 99px;
  line-height: 99px;
  margin: 0;
  float: left;
  border-bottom: 1px #d1d1d1 solid;
  border-right: 1px #d1d1d1 solid;
}
li.top-li {
  height: 39px;
  line-height: 39px;
  background-color: #eaeaea;
}
li.left-li {
  width: 138px;
  border-left: 1px #d1d1d1 solid;
}
.other-day {
  background: linear-gradient(
    45deg,
    #eaeaea 25%,
    #f7f7f7 0,
    #f7f7f7 50%,
    #eaeaea 0,
    #eaeaea 75%,
    #f7f7f7 0
  );
  background-size: 30px 30px;
}
.current-day {
  background-color: #fdf5e6;
}
.day {
  background-color: #fffafa;
}
.workday {
  width: 30px;
  height: 30px;
  color: red;
  line-height: 30px;
}
.workday {
  width: 30px;
  height: 30px;
  color: red;
  line-height: 30px;
  position: absolute;
}
.holiday {
  width: 30px;
  height: 30px;
  color: green;
  line-height: 30px;
  position: absolute;
}
</style>