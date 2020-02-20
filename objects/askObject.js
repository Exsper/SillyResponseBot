'use strict';
// const { CQCode } = require('koishi-utils');

class askObject {
    constructor(msg) {
        this.ask = msg;

        this.replaceObjects = [];
        this.replaceTexts = [];
    }

    // 简体化
    //const simplify = require('koishi-utils').simplify; 

    // html转意符换成普通字符
    escape2Html(str) {
        var arrEntities = { 'lt': '<', 'gt': '>', 'nbsp': ' ', 'amp': '&', 'quot': '"' };
        return str.replace(/&(lt|gt|nbsp|amp|quot);/ig, function (all, t) { return arrEntities[t]; });
    }
    // 删除换行符
    removeReturn(str) {
        return str.replace(/\r?\n/g, "");
    }

    cutQRCode() {
        // 不管[]内容是不是CQcode，反正总是要替换回来的，没有必要去来回转换，下面都白写了
        /*
        this.cqCodeObject = CQCode.parseAll(this.msg);
        this.cqCodeObject.forEach((cqCode, i) => {
            // 纯文本，处理特殊字符
            if (cqCode.type === 'text') this.replacedMsg += this.removeReturn(this.escape2Html(cqCode.data.text));
            // CQ对象，暂存并以其他文本替代，回复时再替换回来
            else {
                let replaceText = "[cqObjcet" + i + "]";
                this.replacedMsg += replaceText;
                this.replaceTexts.push(replaceText);
                this.replaceObjects.push(cqCode);
            }
        });
        return this.replacedMsg;
        */
        const _this = this;
        let output = this.ask.replace(/\[(.+?)\]/g, function (matchString, group, index, orgString) {
            let replacedIndex = _this.replaceObjects.indexOf(matchString);
            if (replacedIndex < 0) {
                let replaceText = "[cqObjcet" + index + "]";
                _this.replaceTexts.push(replaceText);
                _this.replaceObjects.push(matchString);
                return replaceText;
            }
            else {
                return _this.replaceTexts[replacedIndex];
            }
        });
        return this.removeReturn(this.escape2Html(output));
    }

    reputQRCode(replymsg) {
        const _this = this;
        return replymsg.replace(/\[(cqObjcet[0-9]+)\]/g, function (matchString, group, index, orgString) {
            let replacedIndex = _this.replaceTexts.indexOf(matchString);
            if (replacedIndex < 0) { return matchString; }
            else return _this.replaceObjects[replacedIndex];
        });
    }

}

module.exports = askObject;