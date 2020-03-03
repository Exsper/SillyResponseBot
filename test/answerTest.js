/* eslint-disable require-jsdoc */
"use strict";
const AskObject = require("../objects/askObject");
const QuestionTypeHelper = require("../QuestionType/QuestionTypeHelper");

function getAnswer(ask) {
    const askObject = new AskObject({ message: ask });
    const method = QuestionTypeHelper.getMethod(askObject.removeSpecialStrings());
    if (!method) return ["", ""];
    const replyObject = method(askObject);
    if (!replyObject.reply) return ["", ""];
    return { ask, reply: replyObject.choices };
}

function IsEqual(yourAnswer, correctAnswer) {
    if (yourAnswer.reply[0] === correctAnswer[0] && yourAnswer.reply[1] === correctAnswer[1]) return;
    console.log(yourAnswer.ask + ": " + yourAnswer.reply.join(",") + " not equal to " + correctAnswer.join(",") + "\n");
}

function runTest() {
    // askObject测试
    IsEqual(getAnswer("名字是“我是好人”还是“我是坏人”呢？"), ["“我是好人”", "“我是坏人”"]);
    IsEqual(getAnswer("你有没有看过《你是他还是她》"), ["看过", "没看过"]);
    IsEqual(getAnswer("你听过有人对你说“你有没有看过《你是他还是她》”吗？"), ["听过", "没听过"]);

    // x不x/x没x测试
    IsEqual(getAnswer("今天晚上吃不吃饭？"), ["吃饭", "不吃饭"]);
    IsEqual(getAnswer("今天晚上吃没吃饭？"), ["吃饭了", "没吃饭"]);
    IsEqual(getAnswer("今天晚上要不要吃饭？"), ["要吃饭", "不要吃饭"]);
    IsEqual(getAnswer("今天晚上吃饭不吃饭？"), ["吃饭", "不吃饭"]);
    IsEqual(getAnswer("今天晚上吃饭没吃饭？"), ["吃饭了", "没吃饭"]);

    console.log("测试完毕\n");
}

runTest();
