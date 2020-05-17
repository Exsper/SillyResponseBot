# SillyResponseBot
[![codebeat badge](https://codebeat.co/badges/6a1ada34-3d4a-413c-869b-aa10d61a7124)](https://codebeat.co/projects/github-com-exsper-sillyresponsebot-master)  

只会回答选择性问题的koishi插件

## install
```sh
npm install Exsper/SillyResponseBot
```

## usage
必须先安装koishi，然后在koishi中引用该插件
```javascript
app.plugin(require('SillyResponseBot'));
```
or
```javascript
module.exports = {
    plugins: [
        ['SillyResponseBot'],
    ],
}
```

## 注意
本插件默认自称是小阿日
如果需要更改称谓，请修改objects/sendMessageObject.js中的“小阿日”

## 自定义词典
本插件使用segment分词
在segmentUserDict文件夹下为自定义词典，可以自行修改
