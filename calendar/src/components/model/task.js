const taskNums = ["一、", "二、", "三、", "四、", "五、", "六、", "七、"];
const taskLvls = [
    "task-high-urgent",
    "task-high-normal",
    "task-high-normal",
    "task-high-normal",
    "task-low-urgent",
    "task-low-urgent",
    "task-low-normal"
];
const taskLvlCNs = {
    "task-high-urgent":'优先高-紧急',
    "task-high-normal":'优先高-正常',
    "task-low-urgent":'优先低-紧急',
    "task-low-normal":'优先低-正常',
}
export default {
    getTaskLvls() {
        return taskLvls;
    },
    getTaskLvlCN(key){
        return taskLvlCNs[key];
    },
    getTaskNums() {
        return taskNums;
    },
    getInitTaskDatas() {
        let taskNums = this.getTaskNums();
        let taskDatas = [];
        taskNums.forEach(function (v, i) {
            taskDatas.push({
                taskIndex: i,
                taskNum: v,
                taskValue: "",
                taskStatus: null
            });
        });
        return taskDatas;
    },
    getDailyStatus(item) {
        let result = {
            taskStatus: null,
            dailyClass: ""
        };
        if (item) {
            for (let task of item) {
                if (task.taskStatus === false) {
                    result.dailyClass = taskLvls[task.taskIndex];
                    result.taskStatus = false;
                    break;
                }
                if (task.taskStatus === true) {
                    result.taskStatus = true;
                    result.dailyClass = "task-ok";
                }
            }
        }
        return result;
    }
}