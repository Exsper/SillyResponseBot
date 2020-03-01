"use strict";

const ReplyObject = require("../objects/ReplyObject");

/**
 * 寻找s1的末尾和s2的开头的重复部分
 * @param {string} s1 字符串aaabb
 * @param {string} s2 字符串bbccc
 * @return {int} 重复部分在s1的起始点
 */
function LookForTheSame(s1, s2) {
    const s1length = s1.length;
    const s2length = s2.length;

    if (s1length <= 0 || s2length <= 0) return -1;

    // 寻找重复部分
    let length = s1length > s2length ? s2length : s1length;
    while (length > 0) {
        const s1end = s1.substring(s1length - length);
        const s2start = s2.substring(0, length);
        if (s1end === s2start) return s1length - length;
        length -= 1;
    }
    return -1;
}

/**
 * DoOrNotDo
 * @param {AskObject} askObject askObject
 * @returns {ReplyObject} replyObject
 */
function DoOrNotDo(askObject) {
    const ask = askObject.ask;
    const reply = new ReplyObject(askObject);

    const asklength = ask.length;

    // 获取所有“不”的位置
    let arrOr = ask.split("").map((word, index) => {
        if (word === "不") return index;
        return null;
    }).filter((e) => e);

    // 删除头尾的“不”
    if (arrOr[0] === 0) arrOr = arrOr.slice(1);
    if (arrOr.length <= 0) return reply.no();
    if (arrOr[arrOr.length - 1] === 0) arrOr.pop();
    if (arrOr.length <= 0) return reply.no();

    // 分析所有按“不”拆分情况，找出“不”两边有相同字符串的情况
    const possible = arrOr.reduce((acc, or) => {
        const s1 = ask.substring(0, or);
        const s2 = ask.substring(or + 1, asklength);
        const start = LookForTheSame(s1, s2);
        if (start >= 0) {
            acc.not.push(or);
            acc.start.push(start);
            acc.length.push(or - start);
        }
        return acc;
    }, {
        not: [],
        start: [],
        length: []
    });
    if (possible.not.length <= 0) return reply.no();


    // 极端情况： aaabbb不bbbccc不bbbcccddd
    // 一般取最长的那个，如果都一样长那就取最后一个好了
    const indexOfMax = possible.length.indexOf(Math.max(...possible.length));

    const doStart = possible.start[indexOfMax];
    const notIndex = possible.not[indexOfMax];
    const doLength = possible.length[indexOfMax];


    // 具体情况：
    // 今天晚上 [吃] 不 [吃] 饭 = 回答：[吃]饭/不[吃]饭
    // 今天晚上 [要] 不 [要] 吃饭 = 回答：[要]吃饭/不[要]吃饭
    // 今天晚上 [吃饭] 不 [吃饭] = 回答：[吃饭]/不[吃饭]
    const doString = ask.substring(doStart, notIndex);
    let endString = (notIndex + doLength + 1 < asklength) ? ask.substring(notIndex + doLength + 1) : "";


    // 细节处理
    // 重复词有“！”视为恶意代码，不作回应（没人会用"学!code不学!code"聊天吧）
    if (doString.includes("!") || doString.includes("！")) return reply.no();
    // 结束词包含疑问词/符号，取符号前的语句
    if (endString.length > 0) {
        const endStringRegex = /(.*?)(?=\?|？|!|！|,|，|\.|。|呢)+/;
        const matchResult = endString.match(endStringRegex);
        if (matchResult instanceof Array) endString = matchResult[0];
    }

    // 输出
    const replyString = doString + endString;
    // 将“我”改成“你”，“你”改成“我”
    // let replyStringFix = positionFlip(replyString);

    reply.setChoices([replyString, `不${replyString}`]);
    return reply;
}


module.exports = DoOrNotDo;
