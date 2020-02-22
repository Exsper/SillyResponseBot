'use strict';

const AskObject = require('./objects/AskObject');
const QuestionTypeHelper = require('./QuestionType/QuestionTypeHelper');
const SendMessageObject = require('./objects/sendMessageObject');

function run(meta, next, smc, istest = false) {
    try {
        let askObject = new AskObject(meta);
        if (!askObject.cutCommand(meta.selfId)) return next();
        let method = QuestionTypeHelper.getMethod(askObject.cutCQCode());
        if (!method) return next();
        let replyObject = method(askObject);
        if (!replyObject.reply) return next();
        //测试用
        if (istest) console.log(replyObject.choices);

        let replyString = replyObject.toString();
        if (!replyString) return next();
        let smo = new SendMessageObject(smc.maxHandle, meta, replyString);
        smo = smc.putIn(smo);
        smo.send();
    } catch (ex) {
        console.log(ex);
        return next();
    }

}


module.exports = run;