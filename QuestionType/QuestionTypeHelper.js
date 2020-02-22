'use strict';

const DoOrNotDo = require('./DoOrNotDo');
const ThisOrThat = require('./ThisOrThat');
const TrueOrFalse = require('./TrueOrFalse');

class QuestionTypeHelper {

    // 初步判断疑问句
    static maybeIsQuestion(s) {
        return (!!s.match(/(.+)[嘛嗎吗呢啊麽么呀呐吧\?？]([\?？])?/));
    }

    // 初步判断正反问句
    static maybeIsPorN(s) { // 是Positive or negative
        return (s.includes("不") && !s.includes("不不") && s.length >= 3);
    }

    // 初步判断选择问句
    static maybeIsChoice(s) {
        return (s.indexOf("还是") > 0);
    }

    // 反问句 需要排除
    static isRhetorical(s) {
        const keyWords = ["难道", "这么", "那么", "不是吗"];
        return keyWords.some(function (item, index) {
            if (s.includes(item)) return true;
        })
    }

    // 特指问句 需要排除
    static isSpecific(s) {
        const keyWords = ["什么", "怎么", "谁", "多少", "哪", "几", "多"];
        return keyWords.some(function (item, index) {
            if (s.includes(item)) return true;
        })
    }

    static getMethod(s) {
        if (this.isRhetorical(s)) return false;
        if (this.isSpecific(s)) return false;
        if (this.maybeIsChoice(s)) return ThisOrThat;
        if (this.maybeIsQuestion(s)) return TrueOrFalse;
        if (this.maybeIsPorN(s)) return DoOrNotDo;
        return false;
    }

}



module.exports = QuestionTypeHelper;
