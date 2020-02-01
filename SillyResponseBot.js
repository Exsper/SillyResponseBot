'use strict';

/* #region ReplyObject */
function ReplyObject(ask) {
    this.reply = true;
    this.ask = ask;
    this.format = function () {
        if (this.choices.length > 0)
            return this.choices[Math.floor(Math.random() * this.choices.length)];
        else return undefined;
    };
}
ReplyObject.prototype.choices = function (choices) {
    this.choices = choices;
    return this;
};
ReplyObject.prototype.format = function (format) {
    this.format = format;
    return this;
};
ReplyObject.prototype.toString = function () {
    if (typeof this.format === 'function') {
        return this.format();
    } else {
        //default action: return undefined
        return undefined;
    }
};
ReplyObject.prototype.no = function () {
    this.reply = false;
    return this;
};

/* #endregion */

// 人称代词转换
// 以后“是你吗” -> “不是我” 也用得到，现在暂时只回答“不是”
function positionFlip(str) {
    return str.split("").map(char => (char === '我') ? '你' : (char === '你' ? '我' : char)).join("");
}

/* #region AorA */

/**
 * 寻找s1的末尾和s2的开头的重复部分
 * @param {string} s1 字符串aaabb
 * @param {string} s2 字符串bbccc
 * @return {int} 重复部分在s1的起始点 
 */
function LookForTheSame(s1, s2) {
    let s1length = s1.length;
    let s2length = s2.length;

    if (s1length <= 0 || s2length <= 0) return -1;

    // 寻找重复部分
    let length = s1length > s2length ? s2length : s1length;
    while (length > 0) {
        let s1end = s1.substring(s1length - length);
        let s2start = s2.substring(0, length);
        if (s1end === s2start) return s1length - length;
        length -= 1;
    }
    return -1;
}


/**
 * 根据含“不”的选择性询问生成对应回复
 * @param {string} ask 接受的消息
 * @return {ReplyObject} 所有可选项
 */
function AorA(ask) {
    let reply = new ReplyObject(ask);

    // 排除不含“不”、含“不不”、过长或过短的消息
    if (!ask.includes("不") || ask.includes("不不") || ask.length > 30 || ask.length < 3) return reply.no();

    let asklength = ask.length;

    // 获取所有“不”的位置
    let arrOr = ask.split("").map((word, index) => { if (word === '不') return index; }).filter(e => e !== undefined);

    // 删除头尾的“不”
    if (arrOr[0] === 0) arrOr = arrOr.slice(1);
    if (arrOr.length <= 0) return reply.no();
    if (arrOr[arrOr.length - 1] === 0) arrOr.pop();
    if (arrOr.length <= 0) return reply.no();

    // 分析所有按“不”拆分情况，找出“不”两边有相同字符串的情况
    let possible = arrOr.reduce((acc, or) => {
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
    if (endString.includes("!") || endString.includes("！")) return reply.no();
    // 结束词包含疑问词/符号，取符号前的语句
    if (endString.length > 0) {
        const endStringRegex = /(.*?)(?=\?|？|!|！|,|，|\.|。|呢)+/;
        const matchResult = endString.match(endStringRegex);
        if (matchResult instanceof Array) {
            endString = matchResult[0];
        }
    }

    //输出
    let replyString = doString + endString;
    // 将“我”改成“你”，“你”改成“我”
    let replyStringFix = positionFlip(replyString);

    reply.choices = [replyStringFix, `不${replyStringFix}`];
    return reply;
}

/* #endregion */


/* #region doOrNot */

// 倒序(end -> start)查找语气词y，返回语气词y在解析结果中的index
function lastIndexOfY(result, end = result.length - 1) {
    for (let i = end; i >= 0; i--) {
        if (result[i].tag === "y" || result[i].word === "了吗")
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
    //用jieba解析字符串
    const nodejieba = require("nodejieba");
    nodejieba.load({
        userDict: './osu.dict.utf8' // osu特有词汇
    });
    let result = nodejieba.tag(ask); // [{word: string, tag: string}, ...{}]
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
    }
    else {
        if (aIndex > 0 && yIndex - aIndex <= 1) vIndex = aIndex;
    }
    let vWord = result[vIndex].word;
    if (vWord.substring(0, 1) === "不") vWord = vWord.substring(1); // 防止出现"不不v"的情况

    // strp3: 判断语气词y前一个词的词性，选择对应回复
    // 现在暂时只回答动词，不是连贯句子
    if (result[yIndex - 1].word === "什么") return reply.no(); // 不是选择性疑问句
    else if (ask.indexOf("是") >= 0) reply.choices = ['是', '不是']; // 直接从原句中找“是”更好
    else if (result[yIndex - 1].word === "了") reply.choices = [`${vWord}了`, `没${vWord}`];
    else reply.choices = [vWord, `不${vWord}`];
    return reply;
}

/* #endregion */



// 因为jieba的解析会将“不”字和其他字连起来，不好判断，所以还是将AorA形式单独判断
// 因为类似“(不)xxx呢”也会被AorA捕获，所以如果AorA没有输出也要再尝试doOrNot
function getReply(s) {
    let r = AorA(s);
    if (!r.reply) {
        r = doOrNot(s); // doOrNot速度明显不如AorA
    }
    return r;
}

// Koishi插件名
module.exports.name = 'SillyResponseBot';
// 插件处理和输出
module.exports.apply = (ctx) => {
    ctx.middleware((meta, next) => {
        let ask = meta.message;
        ask = ask.trim();
        if (ask.substring(0, 1) === "!" || ask.substring(0, 1) === "！") {
            try {
                let str = ask.substring(1).trim();
                let r = getReply(str);
                if (r.reply) {
                    console.log(r.choices);
                    let reply = r.toString();
                    if (reply) return meta.$send(reply);
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

// test
/*

let readline = require('readline');
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});
rl.on('line', function (line) {
    try {
        // TODO 取！后面的
        let str = line.trim();
        let r = getReply(str);
        if (r.reply) console.log(r.choices);
    }
    catch (ex) {
        console.log(ex);
    }
});
rl.on('close', function () {
    process.exit();
});

*/
