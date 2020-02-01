/* #region ReplyObject */
function ReplyObject(ask) {
    this.reply = true;
    this.ask = ask;
    this.format = function() {
        if (this.choices.length > 0)
            return this.choices[Math.floor(Math.random() * this.choices.length)];
        else return undefined;
    };
}
ReplyObject.prototype.choices = function(choices) {
    this.choices = choices;
    return this;
};
ReplyObject.prototype.format = function(format) {
    this.format = format;
    return this;
};
ReplyObject.prototype.toString = function() {
    if (typeof this.format === 'function') {
        return this.format();
    } else {
        //default action: return undefined
        return undefined;
    }
};
ReplyObject.prototype.no = function() {
    this.reply = false;
    return this;
};
// 人称代词转换
// 以后“是你吗” -> “不是我” 也用得到，现在暂时只回答“不是”
ReplyObject.prototype.flipPosition = function (str) {
    this.choices = this.choices.map(str => str.split("").map(char => (char === '我') ? '你' : (char === '你' ? '我' : char)).join(""));
};

/* #endregion */
module.exports = ReplyObject;