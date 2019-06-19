
# fancy-wangeditor

[wangEditor](http://wangEditor.github.io/) 二次开发

## 增加功能

- topic

## Install

```
yarn add fancy-wangeditor
```

## Topic

使用方式
```
editor.customConfig.menus = [
    'topic'
]
editor.customConfig.topic = {
    onInput (v) {
        getTopics().then((list) => {
            this.setTopicList(list)
        })
    }
}
editor.create()
```
对应html源码
```
<a href="javascript:topic;">#话题#</a>
```
