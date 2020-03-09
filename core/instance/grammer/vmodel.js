import { setValue } from '../../util/objectUtil.js';

/**
 * 绑定v-model
 * @param {*} vm 实例
 * @param {*} elm 元素
 * @param {*} attr 属性名
 */
export function vmodel (vm, elm, attr) {
    elm.oninput = function () {
        setValue(vm._data, attr, elm.value);
    }
}