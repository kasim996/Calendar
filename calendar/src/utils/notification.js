import c_icon from "../assets/icon/calendar.png"
export default {
    showMsgNotification(title, msg) {
        let Notification = window.Notification || window.mozNotification || window.webkitNotification;
        let getNotification = (title, msg) => {
            let n = new Notification(title, {
                body: msg,
                icon: c_icon,
            });
            n.onclick = () => {
                n.close();
            };
            setTimeout(() => {
                n.close();
            }, 2500);
        }
        if (Notification) {//支持桌面通知
            if (Notification.permission == "granted") {//已经允许通知
                getNotification(title, msg);
            } else {//第一次询问或已经禁止通知(如果用户之前已经禁止显示通知，那么浏览器不会再次询问用户的意见，Notification.requestPermission()方法无效)
                Notification.requestPermission(function (status) {
                    if (status === "granted") {//用户允许
                        getNotification(title, msg);
                    } else {//用户禁止
                        return false;
                    }
                });

            }
        }
    }
}