'use strict';
//for better includes..
require('app-module-path/cwd');


const finder = require('objects/findBuilder');
const sendMessageObject = require('objects/sendMessageObject');



let b = new finder();

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
            if (!builder) return;
            const r = builder(str);
            if (!r.reply) return;
            let replyString = r.toString();
            if (!replyString) return;
            let smo = new sendMessageObject(new meta(myQQ), r, replyString);
            smo.recordAndSendMessage();
        } catch (ex) {
            console.log(ex);
        }
    }
});
rl.on('close', function () {
    process.exit();
});

