'use strict';
const path = require('path');

// segment分词
// 载入模块
const Segment = require('segment');
// 创建实例
const segment = new Segment();
// 使用识别模块及字典
segment
    // 分词模块
    // 强制分割类单词识别
    // .use('URLTokenizer')            // URL识别
    // .use('WildcardTokenizer')       // 通配符，必须在标点符号识别之前
    .use('PunctuationTokenizer')    // 标点符号识别
    // .use('ForeignTokenizer')        // 外文字符、数字识别，必须在标点符号识别之后
    // 中文单词识别
    .use('DictTokenizer')           // 词典识别
    // .use('ChsNameTokenizer')        // 人名识别，建议在词典识别之后

    // 优化模块
    // .use('EmailOptimizer')          // 邮箱地址识别
    // .use('ChsNameOptimizer')        // 人名识别优化
    // .use('DictOptimizer')           // 词典识别优化
    // .use('DatetimeOptimizer')       // 日期时间识别优化

    // 字典文件

    // .loadDict('dict.txt')           // 盘古词典
    // .loadDict('dict2.txt')          // 扩展词典（用于调整原盘古词典）
    // .loadDict('names.txt')          // 常见名词、人名
    // .loadDict('wildcard.txt', 'WILDCARD', true)   // 通配符
    // .loadSynonymDict('synonym.txt')   // 同义词
    // .loadStopwordDict('stopword.txt') // 停止符

    // 自定义词典
    .loadDict(path.join(__dirname, '/segmentUserDict/singledict.txt'))  // 复制原dict，删除一些词组，防止词组改变词性
    .loadDict(path.join(__dirname, '/segmentUserDict/osu.txt'))  // osu专用语
    .loadDict(path.join(__dirname, '/segmentUserDict/ywc.txt'))  // 疑问词



// 倒序(end -> start)查找语气词y，返回语气词y在解析结果中的index
function lastIndexOfY(result, end = result.length - 1) {
    for (let i = end; i >= 0; i--) {
        if (result[i].tag.indexOf("语气词") >= 0 || result[i].w[0] === "了")
            return i;
    }
    // 没有找到语气词
    return -1;
}

// 倒序(end -> start)查找形容词或动词，返回形容词或动词在解析结果中的index
function lastIndexOfAV(result, end = result.length - 1) {
    for (let i = end; i >= 0; i--) {
        if (result[i].tag.indexOf("形容词") >= 0 || result[i].tag.indexOf("动词") >= 0)
            return i;
    }
    // 没有找到形容词或动词
    return -1;
}


// 倒序(end -> start)查找形容词动词词组，返回{index:词组第一个词在解析结果中的index, word:该词组}
function getAVWords(result, end = result.length - 1) {
    let index = lastIndexOfAV(result, end);
    if (index < 0) return { index: -1, word: "" };
    let word = "";
    while (index >= 0) {
        if (result[index].tag.indexOf("形容词") >= 0 || result[index].tag.indexOf("动词") >= 0) {
            word = result[index].w + word;
            index = index - 1;
        }
        else if (result[index].w === "了" || result[index].w === "得") {
            word = result[index].w + word;
            index = index - 1;
        }
        else {
            index = index + 1;
            break;
        }
    }
    if (index < 0) index = 0;
    return { index: index, word: word };
}


function isResultContainWord(result, word) {
    let isContain = false;
    result.forEach((r, i) => {
        if (r.w === word) {
            isContain = true;
        }
    });
    return isContain;
}


function doOrNot(result) {
    // 倒序查询语气词y
    let yIndex = lastIndexOfY(result);
    if (yIndex < 1) return "没有语气词"; // 单独一个“吗”字也不行

    // 从语气词y倒叙查询动词形容词av
    let av = getAVWords(result, yIndex);
    if (av.index < 0) return "没有找到动词/形容词";
    let vWord = av.word;

    if (vWord.substring(0, 1) === "不") vWord = vWord.substring(1); // 防止出现"不不v"的情况

    // 判断语气词y前一个词的词性，选择对应回复
    if (result[yIndex - 1].w === "什么") return "不是选择性疑问句"; // 不是选择性疑问句
    if (isResultContainWord(result, "是")) return ['是', '不是']; // 直接从原句中找“是”更好，因为分析有可能不会单独拆下“是”，下面几个同理
    if (isResultContainWord(result, "会")) return ['会', '不会'];
    if (isResultContainWord(result, "能")) return ['能', '不能'];
    if (vWord.length > 2 && vWord[vWord.length - 2] === "不") return [`${vWord}`, `${vWord.substring(0, vWord.length - 2) + "得" + vWord.substring(vWord.length - 1)}`];
    if (vWord.length > 2 && vWord[vWord.length - 2] === "得") return [`${vWord}`, `${vWord.substring(0, vWord.length - 2) + "不" + vWord.substring(vWord.length - 1)}`];
    if (result[yIndex - 1].w === "了") return [`${vWord}了`, `没${vWord}`];
    if (vWord.substring(vWord.length - 1) === "了") return [`${vWord}`, `没${vWord.substring(0, vWord.length - 1)}`];
    return [vWord, `不${vWord}`];
}



let readline = require('readline');
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});
rl.on('line', function (line) {
    let result = segment.doSegment(line, {
        stripPunctuation: true // 去除标点
    });
    result.forEach(words => { words.tag = Segment.POSTAG.chsName(words.p) });
    console.log(result);
    console.log(doOrNot(result));
});