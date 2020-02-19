// https://docs.cqp.im/manual/cqcode/
// https://cqhttp.cc/docs/4.14/#/CQCode
class CQCode {
    //系统表情
    face(id) {
        return `[CQ:face,id=${id}]`;
    }
    //emoji表情
    emoji(id) {
        return `[CQ:emoji,id=${id}]`;
    }
    //原创表情
    bface(id) {
        return `[CQ:bface,id=${id}]`;
    }
    //小表情
    sface(id) {
        return `[CQ:sface,id=${id}]`;
    }
    //自定义图片
    image(fileName) {
        return `[CQ:image,file=${fileName}]`;
    }
    //语音
    record(fileName) {
        return `[CQ:record,file=${fileName}]`;
    }
    //@某人
    at(qqId) {
        return `[CQ:at,qq=${qqId === -1 ? 'all' : qqId}]`;
    }
    //音乐
    music(musicId, type = '', style = false) {
        return `[CQ:music,id=${musicId},type=${type ? type : 'qq'}${style ? ',style=1' : ''}]`;
    }

    //增强CQ码
    //无缓存图片
    imageNoCache(fileName) {
        return `[CQ:image,cache=0,file=${fileName}]`;
    }
}

exports.CQCode = CQCode;