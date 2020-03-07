export let template2Vnode = new Map(); // 模板映射节点集合
export let vnode2Template = new Map(); // 节点映射模板集合

/**
 * 预备渲染, 建立模板与vnode的索引
 * @param {*} vm 实例
 * @param {*} vnode 根节点
 */
function prepareRender(vm, vnode) {
    if(vnode == null) return;
    // 判断是否为文本节点类型
    if(vnode.nodeType == 3){
        // 解析模板字符串
        analysisTemplateString(vnode);
    }
    
    for(let i = 0; i < vnode.children.length; i ++){
        prepareRender(vm, vnode.children[i]);
    }
}

/**
 * 解析模板中的插值表达式
 * @param {*} vnode 
 */
function analysisTemplateString(vnode) {
    // 找到模板字符串中所有的插值表达式
    let strList = vnode.text.match(/{{[\w\W]+}}/g);
    // 映射
    for(let i = 0; strList && i < strList.length; i ++){
        setTemplate2Vnode(strList[i], vnode);
        setVnode2Template(strList[i], vnode);
    }
}

/**
 * 映射模板到节点集合
 * @param {*} template 
 * @param {*} vnode 
 */
function setTemplate2Vnode(template, vnode) {
    let templateSet = template2Vnode.get(getTemplateName(template));
    if(templateSet){
        templateSet.push(vnode);
    }else {
        template2Vnode.set(getTemplateName(template), [vnode]);
    }
}
/**
 * 映射节点到模板集合
 * @param {*} template 
 * @param {*} vnode 
 */
function setVnode2Template(template, vnode) {
    let vnodeSet = vnode2Template.get(vnode);
    if(vnodeSet){
        vnodeSet.push(getTemplateName(template));
    }else {
        vnode2Template.set(vnode, [getTemplateName(template)]);
    }
}
/**
 * 去除插值表达式
 */
function getTemplateName(text) {
    return text.replace(/{{|}}/g, '');
}

export default prepareRender;