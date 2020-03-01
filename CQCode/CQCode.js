"use strict";
// https://docs.cqp.im/manual/cqcode/
// https://cqhttp.cc/docs/4.14/#/CQCode
class CQCode {
    // 系统表情
    static face(id) {
        return `[CQ:face,id=${id}]`;
    }
    // emoji表情
    static emoji(id) {
        return `[CQ:emoji,id=${id}]`;
    }
    // 原创表情
    static bface(id) {
        return `[CQ:bface,id=${id}]`;
    }
    // 小表情
    static sface(id) {
        return `[CQ:sface,id=${id}]`;
    }
    // 自定义图片
    static image(fileName) {
        return `[CQ:image,file=${fileName}]`;
    }
    // 语音
    static record(fileName) {
        return `[CQ:record,file=${fileName}]`;
    }
    // @某人
    static at(qqId) {
        return `[CQ:at,qq=${qqId === -1 ? "all" : qqId}]`;
    }
    // 音乐
    static music(musicId, type = "", style = false) {
        return `[CQ:music,id=${musicId},type=${type ? type : "qq"}${style ? ",style=1" : ""}]`;
    }

    // 增强CQ码
    // 无缓存图片
    static imageNoCache(fileName) {
        return `[CQ:image,cache=0,file=${fileName}]`;
    }
}

module.exports = CQCode;
