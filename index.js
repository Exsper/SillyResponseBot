"use strict";

const run = require("./run").default;

// TODO
// 1. cq code

const SentMessageCollection = require("./objects/sentMessageCollection");
const smc = new SentMessageCollection();

// Koishi插件名
module.exports.name = "SillyResponseBot";
// 插件处理和输出
module.exports.apply = (ctx) => {
    // const { app } = ctx;
    // const botName = app.options.nickname;
    ctx.middleware((meta, next) => {
        run(meta, next, smc);
    });
};

