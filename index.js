'use strict';

const finder = require('./findBuilder');



// 因为jieba的解析会将“不”字和其他字连起来，不好判断，所以还是将AorA形式单独判断
// 因为类似“(不)xxx呢”也会被AorA捕获，所以如果AorA没有输出也要再尝试doOrNot
// function getReply(s) {
//     let r = AorA(s);
//     if (!r.reply) {
//         r = doOrNot(s); // doOrNot速度明显不如AorA
//     }
//     return r;
// }

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
                    let reply = r.toString();
                    if (reply) return meta.$send(reply);
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


let readline = require('readline');
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});
rl.on('line', function (line) {
    let ask = line;
    ask = ask.trim();
    if (ask.startsWith("!") || ask.startsWith("！")) {
        try {
            let str = ask.substring(1).trim();
            const builder = b.returnBuilderIfMatched(str);
            if (builder) {
                const r = builder(str);
                if (r.reply) {
                    //console.log(r.choices);
                    let reply = r.toString();
                    if (reply) console.log(reply);
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

