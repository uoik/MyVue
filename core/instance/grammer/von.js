import { getValue } from '../../util/objectUtil.js';

/**
 * 绑定事件方法
 * @param {*} vm 实例
 * @param {*} vnode 虚拟节点
 */
export function von(vm, vnode) {
    if (vnode.nodeType !== 1) return;

    let attrNames = vnode.elm.getAttributeNames();
    for (let i = 0; i < attrNames.length; i++) {
        // 判断是否有v-on指令
        if (attrNames[i].indexOf('v-on:') == 0 || attrNames[i].indexOf('@') == 0) {
            analysisAttr(vm, vnode, attrNames[i], vnode.elm.getAttribute(attrNames[i]));
        }
    };
};

/**
 * 解析
 * @param {*} vm 实例
 * @param {*} vnode 节点
 * @param {*} key 事件名称
 * @param {*} func 方法
 */
function analysisAttr(vm, vnode, key, func) {
    let temp1 = key.indexOf('@');
    let temp2 = key.indexOf(':');
    let site = temp1 >= 0 ? temp1 : (temp2 >= 0 ? temp2 : '');
    let value = getValue(vm._methods, func);
    vnode.elm.addEventListener(key.substring(site + 1, key.length), proxyFunc(vm, value));
}

/**
 * 代理方法，将this指向实例
 * @param {*} vm 
 * @param {*} func 
 */
function proxyFunc(vm, func) {
    return function() {
        func.call(vm);
    }
}