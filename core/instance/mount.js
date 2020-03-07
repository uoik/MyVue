import VNode from "../vdom/vnode.js";
import prepareRender from './render.js'

/**
 * 添加挂载属性
 * @param {*} Due 
 */
export function initMount(Due) {
    Due.prototype.$mount = function(elm) {
        let vm = this;
        let rootDom = document.getElementById(elm);
        mount(vm, rootDom);
    }
}

/**
 * 生成虚拟DOM树
 * @param {*} vm 实例
 * @param {*} elm 根节点
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
 * @param {*} elm 节点
 * @param {*} parent 父级节点
 */
function constructVNode(vm, elm, parent) {
    let vnode = null,
        children = [], // 子节点
        nodeName = elm.nodeName, // 节点名称
        nodeType = elm.nodeType, // 节点类型
        text = getNodeText(elm), // 节点文本
        data = null, // 节点数据类型
        key = null;

    // 根据条件构造出一个虚拟节点
    vnode = new VNode(elm, children, nodeName, nodeType, text, parent, data, key);

    // 得到当前节点下的所有子节点
    let childs = vnode.elm.childNodes;
    for (let i = 0; i < childs.length; i++) {
        // 递归遍历
       let childNodes = constructVNode(vm, childs[i], vnode);
       if(childNodes instanceof VNode){
           vnode.children.push(childNodes);
       }else {
           vnode.children = vnode.children.concat(childNodes);
       }
    }

    return vnode;
}

/**
 * 判断是否为文本节点
 * @param {*} elm 
 */
function getNodeText(elm) {
    if (elm.nodeType === 3) {
        return elm.nodeValue;
    } else {
        return '';
    }
}

export default mount;