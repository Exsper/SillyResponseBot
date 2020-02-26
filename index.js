'use strict';

const run = require('./run');

// TODO
// 1. cq code

const sentMessageCollection = require('./objects/sentMessageCollection');
let smc = new sentMessageCollection();

// Koishi插件名
module.exports.name = 'SillyResponseBot';
// 插件处理和输出
module.exports.apply = (ctx) => {
    //const { app } = ctx;
    //const botName = app.options.nickname;
    ctx.middleware((meta, next) => {
        run(meta, next, smc);
    });
};

