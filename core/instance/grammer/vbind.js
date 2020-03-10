import { getValue, getEnvAttr } from '../../util/objectUtil.js';
import { generateCode, isTrue } from '../../util/code.js';

/**
 * 绑定属性值
 * @param {*} vm 实例
 * @param {*} vnode 虚拟节点
 */
export function vbind(vm, vnode) {
    if (vnode.nodeType !== 1) return;

    let attrNames = vnode.elm.getAttributeNames();
    for (let i = 0; i < attrNames.length; i++) {
        // 判断是否有v-bind指令
        if (attrNames[i].indexOf('v-bind:') == 0 || attrNames[i].indexOf(':') == 0) {
            replaceAttr(vm, vnode, attrNames[i], vnode.elm.getAttribute(attrNames[i]));
        }
    };
};

/**
 * 替换属性值
 * @param {*} vm 实例
 * @param {*} vnode 节点
 * @param {*} attr 属性名
 * @param {*} value 属性值
 */
function replaceAttr(vm, vnode, attr, value) {
    let k = attr.split(':')[1];
    // console.log(attr, value)
    // 判断属性值是否为表达式
    if (/^{[\w\W]+}$/.test(value)) {
        let v = value.substring(1, value.length - 1);
        let expressionList = v.split(',').map(v => v.trim());
        let result = analysisExpression(vm, vnode, expressionList);
        vnode.elm.setAttribute(k, result)
    } else {
        let v = getValue(vm._data, value);
        vnode.elm.setAttribute(k, v)
    };
};

/**
 * 分析表达式
 * @param {*} vm 实例
 * @param {*} vnode 节点
 * @param {*} expressionList 表达式列表
 */
function analysisExpression(vm, vnode, expressionList) {
    // 获取当前环境数据
    let data = getEnvAttr(vm, vnode);
    // 解析表达式
    let code = generateCode(data);
    // 拼接字符
    let result = '';
    for (let i = 0; i < expressionList.length; i++) {
        // 判断是否有冒号
        let isSym = expressionList[i].indexOf(":");
        if (isSym >= 0) {
            let temp = expressionList[i].split(':');
            let bool = isTrue(temp[1], code);
            if (bool) {
                result += temp[0] + ',';
            }
        } else {
            result += expressionList[i] + ',';
        }
    }
    result = result.replace(/,/g, ' ').trim();
    return result;
};