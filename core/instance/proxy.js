import { renderData } from './render.js';
import { rebuild } from './mount.js';
import { getValue } from '../util/objectUtil.js';

/**
 * 构建代理
 * @param {*} vm 实例
 * @param {*} obj 数据对象
 * @param {*} namespace 命名空间
 */
function constructProxy(vm, data, namespace) {
    let proxyObj = null;
    if (data instanceof Array) {
        // 判断数组内的每一项是否为对象或数组
        for (let i = 0; i < data.length; i++) {
            constructProxy(vm, data[i], namespace);
        }
        // 代理数组
        proxyObj = proxyArr(vm, data, namespace);
    } else if (data instanceof Object) {
        // 构建代理对象
        proxyObj = constructObjProxy(vm, data, namespace);
    } else {
        throw new Error('Data is not Object or Array');
    }
    return proxyObj;
}

/**
 * 代理数组
 * @param {*} vm 实例
 * @param {*} arr 数据数组
 * @param {*} namespace 命名空间
 */
function proxyArr(vm, arr, namespace) {
    let obj = {
        elmType: 'Array',
        toString() {
            let str = '';
            for (let i = 0; i < arr.length; i++) {
                str += arr[i] + ', ';
            }
            return str.substring(0, str.length - 2);
        },
        push() { },
        pop() { },
        shift() { },
        unshift() { }
    }
    defArrayFunc.call(vm, obj, 'push', namespace, vm);
    defArrayFunc.call(vm, obj, 'pop', namespace, vm);
    defArrayFunc.call(vm, obj, 'shift', namespace, vm);
    defArrayFunc.call(vm, obj, 'unshift', namespace, vm);

    arr.__proto__ = obj;
    return arr;
}

// 数组原型
const arrayProto = Array.prototype;
/**
 * 重构数组方法
 * @param {*} obj 重构后的对象
 * @param {*} type 方法类型
 * @param {*} namespace 命名空间
 * @param {*} vm 实例
 */
function defArrayFunc(obj, type, namespace, vm) {
    Object.defineProperty(obj, type, {
        enumerable: true,
        configurable: true,
        value(...args) {
            let typeFunc = arrayProto[type];
            let resp = typeFunc.apply(this, args);
            // 
            rebuild(vm, getNameSpace(namespace, ''));
            // 更新数据重新渲染界面
            renderData(vm, getNameSpace(namespace, ''))

            return resp;
        }
    })
}

/**
 * 构建代理对象
 * @param {*} vm 实例
 * @param {*} obj 数据对象
 * @param {*} namespace 命名空间
 */
function constructObjProxy(vm, objData, namespace) {
    const proxyObj = {};
    for (const key in objData) {
        Object.defineProperty(proxyObj, key, {
            configurable: true,
            get() {
                return objData[key];
            },
            set(value) {
                objData[key] = value;
                // 更新数据重新渲染界面
                renderData(vm, getNameSpace(namespace, key))
            }
        });
        Object.defineProperty(vm, key, {
            configurable: true,
            get() {
                return objData[key];
            },
            set(value) {
                objData[key] = value;
                // 更新数据重新渲染界面
                let val = getValue(vm._data, getNameSpace(namespace, key))
                // 判断是否为数组
                if (val instanceof Array) {
                    // 重新建立映射集合
                    rebuild(vm, getNameSpace(namespace, key));
                }
                renderData(vm, getNameSpace(namespace, key));

            }
        });
        if (objData[key] instanceof Object) {
            proxyObj[key] = constructProxy(vm, objData[key], getNameSpace(namespace, key));
        }
    }
    return proxyObj;
}

/**
 * 根据命名空间和属性值返回一个新的命名空间
 * @param {*} nowNameSpace 当前的命名空间
 * @param {*} nowKey 当前的属性
 */
function getNameSpace(nowNameSpace, nowKey) {
    if (nowNameSpace == null || nowNameSpace == '') {
        return nowKey;
    } else if (nowKey == null || nowKey == '') {
        return nowNameSpace;
    } else {
        return nowNameSpace + '.' + nowKey;
    }
}

export default constructProxy