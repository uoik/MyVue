import constructProxy from './proxy.js';
import mount, { initMount } from './mount.js';

let uid = 0; // 每个实例的唯一ID

/**
 * 混合方法到实例原型链
 * @param {*} Due 实例
 */
function initMixin(Due) {
    Due.prototype._init = function (options) {
        const vm = this;
        vm.uid = uid ++; // 实例唯一ID
        vm._isDue = true; // 实例是否由Due创建
        // 初始化data（构建代理）
        if(options && options.data){
            vm._data = constructProxy(vm, options.data, '');
        }

        // 初始化el并挂载
        if(options && options.el){
            const rootDom = document.getElementById(options.el);
            mount(vm, rootDom);
        }
    }

    // 给实例添加$mount挂载属性
    initMount(Due);
}

export {
    initMixin
}