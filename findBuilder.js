const AorA = require('./builders/AorA');
const doOrNot = require('./builders/DoOrNot');

//match the replyObject builder function.
function findBuilder() {
    this.finder = [{
            matcher: (s) => s.match(/(.+)[嘛吗呢啊么呀呐吧]([?？])?/),
            builder: doOrNot
        },
        {
            matcher: (s) => (s.includes("不") && !s.includes("不不") && s.length <= 30 && s.length >= 3),
            builder: AorA
        },
    ];
}
//return false | function
/*

*/
findBuilder.prototype.returnBuilderIfMatched = function(s) {
    const match = this.finder.find(matcher => matcher.matcher(s))
    if (match !== undefined) {
        return match.builder;
    } else {
        return false;
    }
}


module.exports = findBuilder;