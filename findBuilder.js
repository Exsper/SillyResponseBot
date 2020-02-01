const AorA = require('./builders/AorA');
const doOrNot = require('./builders/DoOrNot');

//match the replyObject builder function.
function findBuilder() {
    this.finder = [{
            matcher: (s) => (s.includes("不") && !s.includes("不不") && s.length <= 30 && s.length > 4),
            builder: AorA
        },
        {
            matcher: (s) => s.match(/[嘛吗呢啊么呀呐](\?)?/) || s.match(/[嘛吗呢啊么呀呐](\w+)/),
            builder: doOrNot
        }
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