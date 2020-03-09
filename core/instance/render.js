import { getValue } from '../util/objectUtil.js';

export let template2Vnode = new Map(); // 模板映射节点集合
export let vnode2Template = new Map(); // 节点映射模板集合

/**
 * 混入渲染属性
 * @param {*} Due 实例
 */
export function renderMixin(Due) {
    Due.prototype._render = function () {
        let vm = this;
        renderNode(vm, vm._vnode);
    }
}

/**
 * 数据更新重新渲染节点
 * @param {*} vm 实例
 * @param {*} data 数据名
 */
export function renderData(vm, data) {
    // 根据更新数据的属性名，得到对应的节点
    let vnodes = template2Vnode.get(data);
    if (vnodes) {
        for (let i = 0; i < vnodes.length; i++) {
            // 重新渲染对应节点的数据
            renderNode(vm, vnodes[i]);
        }
    }
}

/**
 * 渲染节点内容
 * @param {*} vm 实例
 * @param {*} vnode 节点
 */
function renderNode(vm, vnode) {
    // 查询文本节点
    if (vnode.nodeType === 3) {
        // 查询出该节点下的所有模板
        let templates = vnode2Template.get(vnode);
        if (templates) {
            // 得到该节点的文本内容
            let text = vnode.text;
            for (let i = 0; i < templates.length; i++) {
                // 得到插值表达式对应的数据
                let templateValue = getTemplateValue([vm._data, vnode.env], templates[i]);
                if (templateValue) {
                    // 替换模板数据
                    text = text.replace("{{" + templates[i] + '}}', templateValue);
                };
            };
            // 更新节点内容
            vnode.elm.nodeValue = text;
        };

    } else if (vnode.nodeType == 1 && vnode.nodeName == 'INPUT') {
        let templates = vnode2Template.get(vnode);
        if (templates) {
            for (let i = 0; i < templates.length; i++) {
                let templateValue = getTemplateValue([vm._data, vnode.env], templates[i]);
                if(templateValue){
                    // 替换input元素的值
                    vnode.elm.value = templateValue;
                }
            }
        }

    } else {
        // 递归子节点是否有文本节点
        for (let i = 0; i < vnode.children.length; i++) {
            renderNode(vm, vnode.children[i]);
        };
    };
};

/**
 * 预备渲染, 建立模板与vnode的索引
 * @param {*} vm 实例
 * @param {*} vnode 根节点
 */
function prepareRender(vm, vnode) {
    if (vnode == null) return;
    // 判断是否为文本节点类型
    if (vnode.nodeType === 3) {
        // 解析模板字符串
        analysisTemplateString(vnode);
    };

    if (vnode.nodeType === 1) {
        // 解析标签属性
        analysisAttr(vm, vnode);
    }

    for (let i = 0; i < vnode.children.length; i++) {
        prepareRender(vm, vnode.children[i]);
    };
}

/**
 * 解析模板中的插值表达式
 * @param {*} vnode 
 */
function analysisTemplateString(vnode) {
    // 找到模板字符串中所有的插值表达式
    let strList = vnode.text.match(/{{[\w.]+}}/g);
    // 映射
    for (let i = 0; strList && i < strList.length; i++) {
        setTemplate2Vnode(strList[i], vnode);
        setVnode2Template(strList[i], vnode);
    };
}

/**
 * 解析标签中的属性
 * @param {*} vm 
 * @param {*} vnode 
 */
function analysisAttr(vm, vnode) {
    let attrNames = vnode.elm.getAttributeNames();
    if (attrNames.indexOf('v-model') > -1) {
        setTemplate2Vnode(vnode.elm.getAttribute('v-model'), vnode);
        setVnode2Template(vnode.elm.getAttribute('v-model'), vnode);
    }
}

/**
 * 映射模板到节点集合
 * @param {*} template 
 * @param {*} vnode 
 */
function setTemplate2Vnode(template, vnode) {
    let templateSet = template2Vnode.get(getTemplateName(template));
    if (templateSet) {
        templateSet.push(vnode);
    } else {
        template2Vnode.set(getTemplateName(template), [vnode]);
    };
}

/**
 * 映射节点到模板集合
 * @param {*} template 
 * @param {*} vnode 
 */
function setVnode2Template(template, vnode) {
    let vnodeSet = vnode2Template.get(vnode);
    if (vnodeSet) {
        vnodeSet.push(getTemplateName(template));
    } else {
        vnode2Template.set(vnode, [getTemplateName(template)]);
    };
}

/**
 * 去除插值表达式
 */
function getTemplateName(text) {
    return text.replace(/{{|}}/g, '');
}

/**
 * 遍历数据，得到模板对应的值
 * @param {*} dataArr 数据数组
 * @param {*} templateName 插值名称
 */
function getTemplateValue(dataArr, templateName) {
    for (let i = 0; i < dataArr.length; i++) {
        let value = getValue(dataArr[i], templateName);
        if (value) {
            return value;
        };
    };
    return null;
}

export default prepareRender;