export default {
    getYMD(d) {
        let year = d.getFullYear();
        let month = d.getMonth();
        let date = d.getDate();
        let day = d.getDay();
        return {
            year,
            month,
            date,
            day,
            toString() {
                return `${year}-${month+1}-${date}`;
            },
            toYearMonth(){
                return `${year}年${month+1}月`;
            }
        }
    },
    getAddDate(d, num) {
        return new Date(d.setDate(d.getDate() + num));
    },
    getWeeksOfMonth: function (d) {
        let ymd = this.getYMD(d);
        let startDate = new Date(ymd.year, ymd.month, 1);
        let endDate = new Date(ymd.year, ymd.month + 1, 0);
        while (startDate.getDay() !== 0) {
            startDate = this.getAddDate(startDate, -1);
        }
        while (endDate.getDay() !== 0) {
            endDate = this.getAddDate(endDate, 1);
        }
        let arr = [];
        let endYMD = this.getYMD(endDate);
        while (this.getYMD(startDate).toString() !== endYMD.toString()) {
            let startYMD = this.getYMD(startDate);
            if (startYMD.day === 0) {
                // arr.push({week:[]});
                arr.push([]);
            }
            // let week = arr[arr.length - 1].week;
            // week.push(startYMD);
            arr[arr.length - 1].push(startYMD);
            startDate = this.getAddDate(startDate, 1);
        }
        return arr;
    },
    getDaysOfMonth:function(d){
        let ymd = this.getYMD(d);
        let startDate = new Date(ymd.year, ymd.month, 1);
        let endDate = new Date(ymd.year, ymd.month + 1, 0);
        while (startDate.getDay() !== 0) {
            startDate = this.getAddDate(startDate, -1);
        }
        while (endDate.getDay() !== 0) {
            endDate = this.getAddDate(endDate, 1);
        }
        let arr = [];
        let endYMD = this.getYMD(endDate);
        while (this.getYMD(startDate).toString() !== endYMD.toString()) {
            let startYMD = this.getYMD(startDate);
            arr.push(startYMD);
            startDate = this.getAddDate(startDate, 1);
        }
        return arr;
    }
}