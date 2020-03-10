import VNode from "../vdom/vnode.js";
import prepareRender, { getVNodeByTemplate, clearMap, renderNode } from './render.js';
import { vmodel } from "./grammer/vmodel.js";
import { vfor } from './grammer/vfor.js';
import { mergeAttr } from '../util/objectUtil.js';

/**
 * 添加挂载属性
 * @param {*} Due 
 */
export function initMount(Due) {
    Due.prototype.$mount = function (elm) {
        let vm = this;
        let rootDom = document.getElementById(elm);
        mount(vm, rootDom);
    }
}

/**
 * 生成虚拟DOM树
 * @param {*} vm 实例
 * @param {*} elm 元素
 */
function mount(vm, elm) {
    // 节点挂载
    vm._vnode = constructVNode(vm, elm, null);
    // 预备渲染(建立渲染索引, 通过vnode查找模板, 通过模板查找vnode)
    prepareRender(vm, vm._vnode);
}

/**
 * 生成一个虚拟D节点
 * @param {*} vm 实例
 * @param {*} elm 元素
 * @param {*} parent 父级节点
 */
function constructVNode(vm, elm, parent) {
    let vnode = analysisAttr(vm, elm, parent); // 分析元素属性是否有指令
    if (vnode == null) {
        let children = [], // 子节点
            nodeName = elm.nodeName, // 节点名称
            nodeType = elm.nodeType, // 节点类型
            text = getNodeText(elm), // 节点文本
            data = null, // 节点数据类型
            key = null;
        // 根据条件构造出一个虚拟节点
        vnode = new VNode(elm, children, nodeName, nodeType, text, parent, data, key);
        // 混合环境变量
        if (elm.nodeType == 1 && elm.getAttribute('env')) {
            vnode.env = mergeAttr(vnode.env, JSON.parse(elm.getAttribute('env')));
        } else {
            vnode.env = mergeAttr(vnode.env, parent ? parent.env : {});
        }
    }

    // 得到节点类型
    let nodeType = vnode.nodeType;
    // 得到当前节点下的所有子节点
    let childs = null;
    let len = 0;
    // 判断是否为虚拟DOM
    if (nodeType === 0) {
        // 如果是虚拟DOM，需要查找该父级的子节点
        childs = vnode.parent.elm.childNodes;
        len = vnode.parent.elm.childNodes.length;
    } else {
        childs = vnode.elm.childNodes;
        len = vnode.elm.childNodes.length;
    }
    for (let i = 0; i < len; i++) {
        // 递归遍历
        let childNodes = constructVNode(vm, childs[i], vnode);
        if (childNodes instanceof VNode) {
            vnode.children.push(childNodes);
        } else {
            vnode.children = vnode.children.concat(childNodes);
        }
    }

    return vnode;
}

/**
 * 判断是否为文本节点
 * @param {*} elm 元素
 */
function getNodeText(elm) {
    if (elm.nodeType === 3) {
        return elm.nodeValue;
    } else {
        return '';
    }
}

/**
 * 分析标签元素是否有指令
 * @param {*} vm 实例
 * @param {*} elm 元素
 * @param {*} parent 父级元素
 */
function analysisAttr(vm, elm, parent) {
    // 判断是否为标签节点
    if (elm.nodeType == 1) {
        // 获取标签内的属性
        let attrNames = elm.getAttributeNames();

        // 判断是否有v-model指令
        if (attrNames.indexOf('v-model') > -1) {
            return vmodel(vm, elm, elm.getAttribute('v-model'));
        };

        // 判断是否有v-for指令
        if (attrNames.indexOf('v-for') > -1) {
            return vfor(vm, elm, parent, elm.getAttribute('v-for'));
        }
    }
}

export function rebuild(vm, template) {
    let virtualNode = getVNodeByTemplate(template);
    if (virtualNode) {
        for (let i = 0; i < virtualNode.length; i++) {
            virtualNode[i].parent.elm.innerHTML = '';
            virtualNode[i].parent.elm.appendChild(virtualNode[i].elm);
            // 根据v-for指令重新生成节点
            let result = constructVNode(vm, virtualNode[i].elm, virtualNode[i].parent);
            virtualNode[i].parent.children = [result];
            clearMap(); // 清空节点模板映射集合
            prepareRender(vm, vm._vnode); // 重新建立节点模板映射集合
            renderNode(vm, vm._vnode); // 重新渲染节点
        }
    }
}

export default mount;