/*
    menu - topic
*/
import $ from '../../util/dom-core.js'
import { getRandom } from '../../util/util.js'
import Panel from '../panel.js'

// 构造函数
function Topic(editor) {
    this.editor = editor
    this.$elem = $('<div class="w-e-menu"><i class="w-e-icon-topic"></i></div>')
    this.type = 'panel'

    // 当前是否 active 状态
    this._active = false
}

// 原型
Topic.prototype = {
    constructor: Topic,

    // 点击事件
    onClick: function (e) {
        const editor = this.editor
        let $linkelem

        if (this._active) {
            // 当前选区在链接里面
            $linkelem = editor.selection.getSelectionContainerElem()
            if (!$linkelem) {
                return
            }
            // 将该元素都包含在选取之内，以便后面整体替换
            editor.selection.createRangeByElem($linkelem)
            editor.selection.restoreSelection()
            // 显示 panel
            this._createPanel($linkelem.text().replace(/#/g, ''))
        } else {
            // 当前选区不在链接里面
            if (editor.selection.isSelectionEmpty()) {
                // 选区是空的，未选中内容
                this._createPanel('', '')
            } else {
                // 选中内容了
                this._createPanel(editor.selection.getSelectionText(), '')
            }
        }
    },

    // 创建 panel
    _createPanel: function (text) {
        // panel 中需要用到的id
        const inputTextId = getRandom('input-text')
        const listId = getRandom('input-text')
        const btnOkId = getRandom('btn-ok')
        const btnDelId = getRandom('btn-del')

        // 是否显示“删除链接”
        const delBtnDisplay = this._active ? 'inline-block' : 'none'

        // 初始化并显示 panel
        const panel = new Panel(this, {
            width: 300,
            // panel 中可包含多个 tab
            tabs: [
                {
                    // tab 的标题
                    title: '话题',
                    // 模板
                    tpl: `<div>
                            <input id="${inputTextId}" type="text" class="block" value="${text}" placeholder="话题"/>
                            <ul id="${listId}" class="w-e-topiclist"></ul>
                            <div class="w-e-button-container">
                                <button id="${btnOkId}" class="right">插入</button>
                                <button id="${btnDelId}" class="gray right" style="display:${delBtnDisplay}">删除话题</button>
                            </div>
                        </div>`,
                    // 事件绑定
                    events: [
                        // 输入话题
                        {
                            selector: '#' + inputTextId,
                            type: 'input',
                            fn: () => {
                                const $text = $('#' + inputTextId)
                                const text = $text.val()
                                this._onInput(text)
                            }
                        },
                        // 点击list
                        {
                            selector: '#' + listId,
                            type: 'click',
                            fn: (evt) => {
                                console.log(evt)
                                this._insert(evt.target.textContent)
                                return true
                            }
                        },
                        // 插入
                        {
                            selector: '#' + btnOkId,
                            type: 'click',
                            fn: () => {
                                // 执行插入
                                const $text = $('#' + inputTextId)
                                const text = $text.val()
                                this._insert(text)

                                // 返回 true，表示该事件执行完之后，panel 要关闭。否则 panel 不会关闭
                                return true
                            }
                        },
                        // 删除链接
                        {
                            selector: '#' + btnDelId,
                            type: 'click',
                            fn: () => {
                                // 执行删除链接
                                this._del()

                                // 返回 true，表示该事件执行完之后，panel 要关闭。否则 panel 不会关闭
                                return true
                            }
                        }
                    ]
                } // tab end
            ] // tabs end
        })

        // 显示 panel
        panel.show()

        // 记录属性
        this.panel = panel
        this._listId = listId
    },

    _onInput (text) {
        const config = this.editor.config.topic
        if (!config) {
            return
        }
        if (typeof config.onInput !== 'function') {
            return
        }
        config.onInput.call(this.editor, text)
    },

    setList (data) {
        const $list = document.querySelector(`#${this._listId}`)
        if (!$list) {
            return
        }
        $list.innerHTML = data.map(x => `<li>${x}</li>`).join('')
    },

    // 删除当前链接
    _del: function () {
        if (!this._active) {
            return
        }
        const editor = this.editor
        const $selectionELem = editor.selection.getSelectionContainerElem()
        if (!$selectionELem) {
            return
        }
        const selectionText = editor.selection.getSelectionText()
        editor.cmd.do('insertHTML', '<span>' + selectionText + '</span>')
    },

    // 插入话题
    _insert: function (text) {
        text = text.replace(/#/g, '')
        if (!text) {
            return
        }
        const editor = this.editor
        let checkResult = true // 默认为 true
        if (checkResult === true) {
            editor.cmd.do('insertHTML', `<a href="javascript:topic;">#${text}#</a>`)
        } else {
            alert(checkResult)
        }
    },

    // 试图改变 active 状态
    tryChangeActive: function (e) {
        const editor = this.editor
        const $elem = this.$elem
        const $selectionELem = editor.selection.getSelectionContainerElem()
        if (!$selectionELem) {
            return
        }
        if ($selectionELem.getNodeName() === 'A' && $selectionELem[0].href === 'javascript:topic;') {
            this._active = true
            $elem.addClass('w-e-active')
        } else {
            this._active = false
            $elem.removeClass('w-e-active')
        }
    }
}

export default Topic
