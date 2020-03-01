"use strict";


class askObject {
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
    // eslint-disable-next-line class-methods-use-this
    escape2Html(str) {
        const arrEntities = { "lt": "<", "gt": ">", "nbsp": " ", "amp": "&", "quot": '"' };
        return str.replace(/&(lt|gt|nbsp|amp|quot);/ig, (all, t) => { return arrEntities[t] });
    }
    // 删除换行符
    // eslint-disable-next-line class-methods-use-this
    removeReturn(str) {
        return str.replace(/\r?\n/g, "");
    }

    // 将CQCode保存起来并用其他字符替换
    cutCQCode() {
        const output = this.ask.replace(/\[(.+?)\]/g, (matchString, group, index, orgString) => {
            const replacedIndex = this.replaceObjects.indexOf(matchString);
            if (replacedIndex < 0) {
                const replaceText = "[cqObjcet" + index + "]";
                this.replaceTexts.push(replaceText);
                this.replaceObjects.push(matchString);
                return replaceText;
            }
            return this.replaceTexts[replacedIndex];
        });
        this.ask = this.removeReturn(this.escape2Html(output));
        return this.ask;
    }

    // 将CQCode替换回去
    reputCQCode(replymsg) {
        return replymsg.replace(/\[(cqObjcet[0-9]+)\]/g, (matchString, group, index, orgString) => {
            const replacedIndex = this.replaceTexts.indexOf(matchString);
            if (replacedIndex < 0) return matchString;
            return this.replaceObjects[replacedIndex];
        });
    }

}

module.exports = askObject;
