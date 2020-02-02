'use strict';


// 随机回复抱怨语句
let botherLeastTimes = 3; // 相同提问第3次开始就回复抱怨语句
let refuseReplyTimes = 10; // 相同提问大于10次不再回复

function replyNoBother(times) {
    let replys = [
        "别再问我啦", "你好烦啊", "讨厌！", "别问啦！", "不作回答", "...", "？", "你还问！", "好烦呀！", "不想回答",
        "你是复读机吗？", "这个问题我拒绝回答", "哼！", "我生气啦！"
    ];
    if (times < refuseReplyTimes) return replys[Math.floor(Math.random() * replys.length)];
    else if (times === refuseReplyTimes) return "小阿日不理你了";
    else return "";
}



/* #region sentMessageCollection */

function sentMessageCollection() {
    this.sentMessages = []; // sendMessageObject 数组
    this.timeouts = {};
}

sentMessageCollection.prototype.add = function (smo) {
    this.sentMessages.push(smo);
    this.timeouts[smo.handle] = setTimeout((smo) => this.remove(smo), 1000 * 60 * 5, smo);
};

sentMessageCollection.prototype.remove = function (smo) {
    this.sentMessages = this.sentMessages.filter(item => item.handle !== smo.handle);
    if (this.timeouts[smo.handle] !== undefined) {
        clearTimeout(this.timeouts[smo.handle]);
    }
};

sentMessageCollection.prototype.findSameAsk = function (smo) {
    let findSmo = this.sentMessages.filter(item => item.askSender === smo.askSender && item.askString === smo.askString);
    return findSmo;
};

sentMessageCollection.prototype.put = sentMessageCollection.prototype.putIn = function (smo) {
    // 先检查sentMessage里有没有相同发送者且相同消息的
    // 如果没有就直接add，如果有就把现在的times和replyString覆盖掉，然后删掉原来的add现在的
    let sameSmo = this.findSameAsk(smo);
    sameSmo.forEach((item) => { smo.times = item.times + 1; smo.replyString = item.replyString; this.remove(item);});
    this.add(smo);
    return smo;
};

/* #endregion */


let smc = new sentMessageCollection();


/* #region sendMessageObject */

let handle = 0;

function sendMessageObject(meta, replyObject, replyString) {
    // 记录回复对象（QQ号）、对象提出问题、回复时间、回复内容、出现次数
    this.handle = handle + 1;
    handle += 1;
    this.askSender = meta.userId;
    this.askString = replyObject.ask;
    this.replyString = replyString;
    this.replyTime = (new Date()).getTime();
    this.times = 1;
}
sendMessageObject.prototype.recordAndSendMessage = function () {
    let smo = smc.put(this);
    let times = smo.times;

    if (times <= 1) return smo.replyString;
    else if (times < botherLeastTimes) return "都说了" + smo.replyString + "呀！";
    else return replyNoBother(times);
};

/* #endregion */

module.exports = sendMessageObject;