'use strict';
//for better includes..
require('app-module-path/cwd');


const finder = require('objects/findBuilder');
const sendMessageObject = require('objects/sendMessageObject');

const simplify = require('koishi-utils').simplify;



// TODO
// 1. cq code

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
                let str = simplify(ask.substring(1).trim());   // 简体化
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

