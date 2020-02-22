'use strict';


function sendMessageObject(handle, meta, replyString) {
    // 随机回复抱怨语句
    this.botherLeastTimes = 4; // 相同提问第4次开始就回复抱怨语句
    this.refuseReplyTimes = 10; // 相同提问大于10次不再回复

    // 记录回复对象（QQ号）、对象提出问题、回复时间、回复内容、出现次数
    this.handle = handle;

    this.meta = meta;

    this.askSender = meta.userId;
    this.askString = meta.message;
    this.replyString = replyString;
    this.replyTime = (new Date()).getTime();
    this.times = 1;
}


sendMessageObject.prototype.getRndInteger = function (min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
};
sendMessageObject.prototype.replyNoBother = function (times = this.times) {
    const replys = [
        "别再问我啦", "你已经问了好多遍了", "听不见吗", "还听不见吗", "别问啦！", "够啦！",
        "...", "？", "你好烦啊", "讨厌！", "不作回答", "你还问！", "好烦呀！", "哼！",
        "不想回答", "你是复读机吗？", "这个问题我拒绝回答", "我生气啦！", "这里有个聋子！",
        "小阿日对你的好感度-100", "我要拿胶布把你的嘴堵上", "你再怎么问都不会有其他结果的",
        "zzz", "但是我拒绝", "您已被管理员禁言", "您已被移出群聊", "核弹已升空"
    ];
    // times越大，越可能选到靠后的语句（算法还待改进？
    if (times < this.refuseReplyTimes) return replys[Math.floor(this.getRndInteger((1 - this.botherLeastTimes / times) * replys.length, Math.sqrt(times / (this.refuseReplyTimes - 1)) * replys.length))];
    else if (times === this.refuseReplyTimes) return "小阿日不理你了";
    else return "";
};


sendMessageObject.prototype.craftMessage = function () {
    let message = '';
    if (this.times <= 1) message = this.replyString;
    else if (this.times < this.botherLeastTimes) message = this.replyString + "！".repeat(this.times);
    else if (this.times === this.botherLeastTimes) message = `都说了${this.replyString}呀！`;
    else {
        message = this.replyNoBother();
        //silence the sender because I AM ANGRY
        if (this.times >= this.refuseReplyTimes) this.meta.$ban(this.times * 10);
    }
    return message;
};


sendMessageObject.prototype.send = function () {
    const message = this.craftMessage();
    if (message !== "") return this.meta.$send(message);
    else return false;
};


module.exports = sendMessageObject;