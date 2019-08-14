
# fancy-wangeditor

[wangEditor](http://wangEditor.github.io/) 二次开发

## 增加功能

- topic // 话题
- youtube // youtube视频
- 插入图片附带宽高属性
- 内容区域高度自动调整

## Install

```
yarn add fancy-wangeditor
```

## Topic

usage
```
editor.customConfig.menus = [
    'topic'
]
editor.customConfig.topic = {  // 设置推荐列表，可选
    onInput (v) {
        getTopics().then((list) => {
            this.setTopicList(list)
        })
    }
}
editor.create()
```
output
```
<a href="javascript:topic;">#话题#</a>
```

## Youtube

usage
```
editor.customConfig.menus = [
    'youtube'
]
editor.create()
```
output
```
<iframe width="560" height="315" src="https://www.youtube.com/embed/xxx" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen=""></iframe>
```

## 内容区域高度自动调整

usage
```
editor.customConfig.minContentHeight = 200
editor.customConfig.maxContentHeight = 500
```
