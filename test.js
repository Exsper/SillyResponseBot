'use strict';
//for better includes..
require('app-module-path/cwd');


const finder = require('objects/findBuilder');
const sendMessageObject = require('objects/sendMessageObject');

//const simplify = require('koishi-utils').simplify;



// html转意符换成普通字符
function escape2Html(str) {
    var arrEntities = { 'lt': '<', 'gt': '>', 'nbsp': ' ', 'amp': '&', 'quot': '"' };
    return str.replace(/&(lt|gt|nbsp|amp|quot);/ig, function (all, t) { return arrEntities[t]; });
}


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
            str = escape2Html(str);   // 处理转义字符
            //str = simplify(str);   // 简体化
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

