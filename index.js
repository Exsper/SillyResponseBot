'use strict';
//for better includes..
//require('app-module-path/cwd');


const finder = require('./objects/findBuilder');
const sendMessageObject = require('./objects/sendMessageObject');



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
                let str = ask.substring(1).trim();
                const builder = b.returnBuilderIfMatched(str);
                if (!builder) return next();
                const r = builder(str);
                if (!r.reply) return next();
                let replyString = r.toString();
                if (!replyString) return next();
                let smo = new sendMessageObject(meta, r, replyString);
                smo.recordAndSendMessage();
            } catch (ex) {
                console.log(ex);
                return next();
            }
        } else {
            return next();
        }
    });
};

