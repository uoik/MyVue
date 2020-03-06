/**
 * 构建代理
 * @param {*} vm 实例
 * @param {*} obj 数据对象
 * @param {*} namespace 命名空间
 */
function constructProxy(vm, data, namespace) {
    let proxyObj = null;
    if (data instanceof Array) {

    } else if (data instanceof Object) {
        // 构建代理对象
        proxyObj = constructObjProxy(vm, data, namespace);
    } else {
        throw new Error('Data is not Object or Array');
    }
    return proxyObj;
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
                console.log(getNameSpace(namespace, key));
                objData[key] = value;
            }
        });
        Object.defineProperty(vm, key, {
            configurable: true,
            get() {
                return objData[key];
            },
            set(value) {
                console.log(getNameSpace(namespace, key));
                objData[key] = value;
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

export {
    constructProxy
}