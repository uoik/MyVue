import VNode from "../../vdom/vnode.js";
import { getValue } from '../../util/objectUtil.js';

/**
 * 根据对应数据生成相应虚拟DOM
 * @param {*} vm 实例
 * @param {*} elm 元素
 * @param {*} parent 父级元素
 * @param {*} instruction 指令
 */
export function vfor(vm, elm, parent, instruction) {
    let children = [], // 子节点
        nodeName = elm.nodeName, // 节点名称
        nodeType = 0, // 节点类型
        text = '', // 节点文本
        data = getVirtualNodeData(instruction)[2], // 节点数据类型
        key = null;
    // 将拥有v-for指令的DOM构建成虚拟节点
    let virtualNode = new VNode(elm, children, nodeName, nodeType, text, parent, data, key);
    // 将真实DOM删除
    parent.elm.removeChild(elm);
    parent.elm.appendChild(document.createTextNode(''));
    // 解析指令
    let resultSet = analysisInstruction(vm, elm, parent, instruction);
    return virtualNode;
};

/**
 * 根据指令值得到对应数据
 * @param {*} instruction 指令值：(key) in list
 */
function getVirtualNodeData(value) {
    let insSet = value.trim().split(' ');
    if (insSet.length != 3 || insSet[1] != 'in' && insSet[2] != 'of') {
        throw new Error('Instruction："' + value + '" error');
    }
    return insSet
};

/**
 * 得到数据，分析数据，并生成对应虚拟DOM插入
 * @param {*} vm 实例
 * @param {*} elm 元素
 * @param {*} parent 父级元素
 * @param {*} instruction 指令
 */
function analysisInstruction(vm, elm, parent, instruction) {
    let insSet = getVirtualNodeData(instruction);
    let dataSet = getValue(vm._data, insSet[2]);
    if (!dataSet) {
        throw new Error('Not found：' + insSet[2]);
    }
    let resultSet = [];
    for (let i = 0; i < dataSet.length; i++) {
        // 生成
        let dom = document.createElement(elm.nodeName);
        dom.innerText = elm.innerText;
        // 添加各自的内容数据
        let env = analysisKV(insSet[0], dataSet[i], i);
        dom.setAttribute('env', JSON.stringify(env));
        // 插入
        parent.elm.appendChild(dom);
        resultSet.push(dom);
    };
    return resultSet;
};

/**
 * 根据key值，分析各自对应的数据
 * @param {*} key key值
 * @param {*} data 数据
 * @param {*} index 下标
 */
function analysisKV(key, data, index) {
    // 判断key是否带括号
    if (/([\w$]+)/.test(key)) {
        key = key.trim().substring(1, key.length - 1);
    };
    let keys = key.split(',');
    if(keys.length <= 0) {
        throw new Error('Instruction："' + key + '" error');
    }
    let obj = {};
    if(keys.length >= 1){
         obj[keys[0].trim()] = data;
    }
    if(keys.length >= 2){
        obj[keys[1].trim()] = index;
    }
    return obj;
}