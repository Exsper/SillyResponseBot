'use strict';


class AskObject {
    constructor(meta) {
        this.ask = meta.message.trim();

        this.replaceObjects = [];
        this.replaceTexts = [];
    }

    // 检查开头是否为！ 或者为@bot
    cutCommand(botQQ) {
        if (this.ask.startsWith("!") || this.ask.startsWith("！")) {
            this.ask = this.ask.substring(1).trim();
            return true;
        }
        else if (botQQ) {
            const atBot = `[CQ:at,qq=${botQQ}]`;
            if (this.ask.startsWith(atBot)) {
                this.ask = this.ask.substring(atBot.length).trim();
                return true;
            }
        }
        return false;
    }

    // html转意符换成普通字符
    escape2Html(str) {
        var arrEntities = { 'lt': '<', 'gt': '>', 'nbsp': ' ', 'amp': '&', 'quot': '"' };
        return str.replace(/&(lt|gt|nbsp|amp|quot);/ig, function (all, t) { return arrEntities[t]; });
    }
    // 删除换行符
    removeReturn(str) {
        return str.replace(/\r?\n/g, "");
    }

    // 将CQCode保存起来并用其他字符替换
    cutCQCode() {
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
        this.ask = this.removeReturn(this.escape2Html(output));
        return this.ask;
    }

    // 将CQCode替换回去
    reputCQCode(replymsg) {
        const _this = this;
        return replymsg.replace(/\[(cqObjcet[0-9]+)\]/g, function (matchString, group, index, orgString) {
            let replacedIndex = _this.replaceTexts.indexOf(matchString);
            if (replacedIndex < 0) { return matchString; }
            else return _this.replaceObjects[replacedIndex];
        });
    }

}

module.exports = AskObject;