"use strict";

const AskObject = require("./objects/askObject");
const QuestionTypeHelper = require("./QuestionType/QuestionTypeHelper");
const SendMessageObject = require("./objects/sendMessageObject");

/**
 * 解析并回复
 * @param {object} meta meta
 * @param {object} next next
 * @param {SendMessageObject} smc smc
 * @param {boolean} istest 是否为测试
 * @returns {object} next?
 */
function run(meta, next, smc, istest = false) {
    try {
        const askObject = new AskObject(meta);
        if (!askObject.cutCommand(meta.selfId)) return next();
        const method = QuestionTypeHelper.getMethod(askObject.removeSpecialStrings());
        if (!method) return next();
        const replyObject = method(askObject);
        if (!replyObject.reply) return next();
        // 测试用
        if (istest) console.log(replyObject.choices);

        const replyString = replyObject.toString();
        if (!replyString) return next();
        let smo = new SendMessageObject(smc.maxHandle, meta, replyString);
        smo = smc.putIn(smo);
        return smo.send();
    } catch (ex) {
        console.log(ex);
        return next();
    }

}


module.exports = run;
