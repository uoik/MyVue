export default class VNode{
    constructor(
        elm, // 真实节点
        children, // 子节点
        nodeName, // 节点名称
        nodeType, // 节点类型
        text, // 节点文本
        parent, // 父级节点
        data, // 节点数据类型
        key
    ){
        this.elm = elm;
        this.children = children;
        this.nodeName = nodeName;
        this.nodeType = nodeType;
        this.text = text;
        this.parent = parent;
        this.data = data;
        this.key = key;
        this.env = {}; // 节点当前环境
        this.instructions = null; // 指令
        this.template = []; // 模板
    }
}