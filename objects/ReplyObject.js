'use strict';

const AskObject = require('objects/askObject');

function ReplyObject(ask) {
    //initial vars 
    this.reply = true;
    this.lastReply = "";
    this.choices = [];
    this.replies = [];

    //should be the message sent in removed any hinting chars.
    this.ask = ask;
    this.askObject = new AskObject(this.ask);

    //set the default action to randomly pick an response in the choices array.
    this.formatter = function() {
        if (this.choices.length > 0)
            return this.choices[Math.floor(Math.random() * this.choices.length)];
        else return undefined;
    };
}

ReplyObject.prototype.getNoneCQCodeAsk = function() {
    return this.askObject.cutQRCode();
};


ReplyObject.prototype.setChoices = function(choices) {
    this.choices = choices.map(str => this.askObject.reputQRCode(str));
    return this;
};

//set the custom formatting function
ReplyObject.prototype.format = function(formatter) {
    this.formatter = formatter;
    return this;
};

//get last response message
ReplyObject.prototype.getLastReply = function () {
    return this.replies[this.replies.length - 1];
};

//get an string response as well as record them 
ReplyObject.prototype.toString = function() {
    if (typeof this.formatter === 'function') {
        //forceed to be String 
        const reply = this.formatter().toString();

        //save the reply for future use.
        this.replies.push(reply);
        return reply;
    } else {
        //default action: return undefined
        return undefined;
    }
};

//returns an ReplyObject that means to not reply.
ReplyObject.prototype.no = function() {
    let no = new ReplyObject(this.ask);
    no.reply = false;
    return no;
};
// 人称代词转换
// 以后“是你吗” -> “不是我” 也用得到，现在暂时只回答“不是”
ReplyObject.prototype.flipPosition = function(str) {
    this.choices = this.choices.map(str => str.split("").map(char => (char === '我') ? '你' : (char === '你' ? '我' : char)).join(""));
};


module.exports = ReplyObject;