'use strict';

const finder = require('./findBuilder');


// 随机回复抱怨语句
function replyNoBother(times) {
    let replys = [
        "别再问我啦", "你好烦啊", "讨厌！", "别问啦！", "不作回答", "...", "？", "你还问！", "好烦呀！", "不想回答",
        "你是复读机吗？", "这个问题我拒绝回答", "哼！", "我生气啦！"
    ];
    if (times < 10) return replys[Math.floor(Math.random() * replys.length)];
    else if (times === 10) return "小阿日不理你了";
    else return "";
}

let botherLeastTimes = 3; // 相同提问第3次开始就回复抱怨语句
let recordSentMessage = []; // 记录sendMessageObject
function sendMessageObject(meta, replyObject, replyString) {
    // 记录回复对象（QQ号）、对象提出问题、回复时间、回复内容、出现次数
    this.askSender = meta.userId;
    this.askString = replyObject.ask;
    this.replyString = replyString;
    this.replyTime = (new Date()).getTime();
    this.times = 1;
}
sendMessageObject.prototype.recordAndSendMessage = function () {
    // 首先得清理一下太旧的sendMessageObject （5分钟之前的），节省资源，同时也防止间隔时间过长的消息也被视为相同消息（比如每天一次的“早上好”之类的）
    const now = (new Date()).getTime();
    recordSentMessage = recordSentMessage.filter(item => now - item.replyTime < 5 * 60 * 1000);
    // 按askSender和askString检查 在recordSentMessage中是否有相同值
    for (let i = 0; i < recordSentMessage.length; ++i) {
        if (recordSentMessage[i].askSender === this.askSender && recordSentMessage[i].askString === this.askString) {
            // 找到相同项，回复一些别的东西
            recordSentMessage[i].times += 1;
            recordSentMessage[i].replyTime = this.replyTime;
            let times = recordSentMessage[i].times;
            if (times < botherLeastTimes) return "都说了" + recordSentMessage[i].replyString + "呀！"; // 这样也避免了两次回复不一致的情况
            else return replyNoBother(times);
            // forEach无法用return直接返回，所以还是用for了
        }
    }
    // 找不到相同项，向recordSentMessage里添加，并正常回复
    recordSentMessage.push(this);
    return this.replyString;
};



// TODO
// 1. 完善自定义词典
// 2. 完善分词和关键词判断
// 3. 重复问题统一答案（类似于复读），或者加一种回答“不要再问啦！”，要用到koishi的上下文

let b = new finder();
// Koishi插件名
module.exports.name = 'SillyResponseBot';
// 插件处理和输出
module.exports.apply = (ctx) => {
    ctx.middleware((meta, next) => {
        let ask = meta.message;
        ask = ask.trim();
        if (ask.startsWith("!") || ask.startsWith("！")) {
            try {
                let str = ask.substring(1).trim();
                // let r = getReply(str);
                const builder = b.returnBuilderIfMatched(str);
                if (!builder) return next();
                const r = builder(str);
                if (r.reply) {
                    //console.log(r.choices);
                    let replyString = r.toString();
                    if (replyString) {
                        // 在回复之前，先看看是不是相同问题！
                        let smo = new sendMessageObject(meta, r, replyString);
                        let sms = smo.recordAndSendMessage();
                        if (sms !== "") return meta.$send(sms);
                    }
                }
                return next();
            } catch (ex) {
                console.log(ex);
                return next();
            }
        } else {
            return next();
        }
    });
};

// test

/*
let myQQ = "1";
console.log("你的QQ号是1了");

let readline = require('readline');
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});
rl.on('line', function (line) {
    let ask = line;
    ask = ask.trim();

    if (ask === "qq2") {
        myQQ = "2";
        console.log("你的QQ号是2了");
    }
    else if (ask === "qq1") {
        myQQ = "1";
        console.log("你的QQ号是1了");
    }

    else if (ask.startsWith("!") || ask.startsWith("！")) {
        try {
            let str = ask.substring(1).trim();
            const builder = b.returnBuilderIfMatched(str);
            if (builder) {
                const r = builder(str);
                if (r.reply) {
                    //console.log(r.choices);
                    let replyString = r.toString();
                    if (replyString) {
                        // 在回复之前，先看看是不是相同问题！
                        let smo = new sendMessageObject({ userId: myQQ }, r, replyString);
                        let sms = smo.recordAndSendMessage();
                        if (sms !== "") console.log(sms);
                    }
                }
            }
        } catch (ex) {
            console.log(ex);
        }
    }
});
rl.on('close', function () {
    process.exit();
});

*/