const ReplyObject = require('../ReplyObject');

//用jieba解析字符串
const nodejieba = require("nodejieba");
nodejieba.load({
    userDict: __dirname + '/osu.dict.utf8' // osu特有词汇
});

/* #region doOrNot */

// 倒序(end -> start)查找语气词y，返回语气词y在解析结果中的index
function lastIndexOfY(result, end = result.length - 1) {
    for (let i = end; i >= 0; i--) {
        if (result[i].tag === "y" || result[i].word[0] === "了")
            return i;
    }
    // 没有找到语气词
    return -1;
}

// 倒序(end -> start)查找动词v，返回动词v在解析结果中的index
function lastIndexOfV(result, end = result.length - 1) {
    for (let i = end; i >= 0; i--) {
        if (result[i].tag === "v")
            return i;
    }
    // 没有找到动词
    return -1;
}

// 倒序(end -> start)查找形容词a，返回形容词a在解析结果中的index
function lastIndexOfA(result, end = result.length - 1) {
    for (let i = end; i >= 0; i--) {
        if (result[i].tag === "a")
            return i;
    }
    // 没有找到形容词
    return -1;
}

function doOrNot(ask) {
    let reply = new ReplyObject(ask);

    // 排除没有疑问词的消息
    // const ywc = ['吗', '呢', '啊', '吧', '么', '嘛', '呀', '呐'];
    // let isQuestion = false;
    // for(let c of ywc) {
    //     if (ask.includes(c)) {
    //         isQuestion = true;
    //         break;
    //     }
    // }
    // if (isQuestion === false) return reply.no();

    let result = nodejieba.tag(ask); // [{word: string, tag: string}, ...{}]
    reply.tag = result;
    //console.log(result);

    // step1: 倒序查询语气词y
    let yIndex = lastIndexOfY(result);
    if (yIndex < 1) return reply.no(); // 单独一个“吗”字也不行

    // step2: 从语气词y倒叙查询动词v
    let vIndex = lastIndexOfV(result, yIndex);
    let aIndex = lastIndexOfA(result, yIndex); // 查找形容词，将形容词视作动词，可以回答“大吗？小吗？”的问题
    if (vIndex < 0) {
        if (aIndex < 0) return reply.no();
        else vIndex = aIndex;
    } else {
        if (aIndex > 0 && yIndex - aIndex <= 1) vIndex = aIndex;
    }
    let vWord = result[vIndex].word;
    if (vWord.substring(0, 1) === "不") vWord = vWord.substring(1); // 防止出现"不不v"的情况

    // strp3: 判断语气词y前一个词的词性，选择对应回复
    // 现在暂时只回答动词，不是连贯句子
    if (result[yIndex - 1].word === "什么") return reply.no(); // 不是选择性疑问句
    else if (ask.indexOf("是") >= 0) reply.choices = ['是', '不是']; // 直接从原句中找“是”更好，因为分析有可能不会单独拆下“是”，下面几个同理
    else if (ask.indexOf("会") >= 0) reply.choices = ['会', '不会'];
    else if (ask.indexOf("能") >= 0) reply.choices = ['能', '不能'];
    else if (result[yIndex - 1].word === "了") reply.choices = [`${vWord}了`, `没${vWord}`];
    else reply.choices = [vWord, `不${vWord}`];
    return reply;
}

/* #endregion */


module.exports = doOrNot;