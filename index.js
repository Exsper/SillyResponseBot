'use strict';
//for better includes..
require('app-module-path/cwd');


const finder = require('objects/findBuilder');
const sendMessageObject = require('objects/sendMessageObject');





// TODO
// 1. 完善自定义词典
// 2. 完善分词和关键词判断

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
                        smo.recordAndSendMessage();
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
// 模拟meta
function meta(qqId) {
    this.userId = qqId;
}
meta.prototype.$send = function (s) { console.log(s); };
meta.prototype.$ban = function (t) { console.log("你已被禁言 " + t + " 秒"); };

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
                        let smo = new sendMessageObject(new meta(myQQ), r, replyString);
                        smo.recordAndSendMessage();
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