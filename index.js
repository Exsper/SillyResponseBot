'use strict';
//for better includes..
require('app-module-path/cwd');


const finder = require('objects/findBuilder');
const sendMessageObject = require('objects/sendMessageObject');





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
                        if (sms !== "") return meta.$send(sms); // 小阿日不想理你
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