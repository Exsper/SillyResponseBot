'use strict';


function ReplyObject(askObject) {

    this.reply = true;
    this.choices = [];
    this.askObject = askObject;

    //set the default action to randomly pick an response in the choices array.
    this.formatter = function() {
        if (this.choices.length > 0)
            return this.choices[Math.floor(Math.random() * this.choices.length)];
        else return undefined;
    };
}

ReplyObject.prototype.setChoices = function(choices) {
    this.choices = choices.map(str => this.askObject.reputCQCode(str));
    return this;
};

//set the custom formatting function
ReplyObject.prototype.format = function(formatter) {
    this.formatter = formatter;
    return this;
};

//get an string response as well as record them 
ReplyObject.prototype.toString = function() {
    if (typeof this.formatter === 'function') {
        //forceed to be String 
        return this.formatter().toString();
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
ReplyObject.prototype.flipPosition = function() {
    this.choices = this.choices.map(str => str.split("").map(char => (char === '我') ? '你' : (char === '你' ? '我' : char)).join(""));
};


module.exports = ReplyObject;