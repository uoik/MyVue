/**
 * 遍历数据，得到模板对应的值
 * @param {*} data 数据
 * @param {*} name 插值名称
 */
export function getValue(data, name) {
    if (!data) return;
    let nameArr = name.split('.');
    let value = data;
    for (let i = 0; i < nameArr.length; i++) {
        if (value[nameArr[i]]) {
            value = value[nameArr[i]];
        } else {
            return undefined;
        };
    };
    return value;
}

/**
 * 
 * @param {*} data 数据状态
 * @param {*} name 插值名称
 * @param {*} value 新值
 */
export function setValue(data, name, value) {
    if (!data) return;
    let nameArr = name.split('.');
    let temp = data;
    for (let i = 0; i < nameArr.length - 1; i++) {
        if (temp[nameArr[i]]) {
            temp = temp[nameArr[i]];
        } else {
            return;
        };
    };
    if (temp[nameArr[nameArr.length - 1]] != null) {
        temp[nameArr[nameArr.length - 1]] = value;
    }
}

/**
 * 合并环境变量
 * @param {*} obj1 
 * @param {*} obj2 
 */
export function mergeAttr(obj1, obj2) {
    if (obj1 == null) return clone(obj2);
    if (obj2 == null) return clone(obj1);
    // 合并
    let obj1Attr = Object.getOwnPropertyNames(obj1);
    let obj2Attr = Object.getOwnPropertyNames(obj2);
    let result = {};
    obj1Attr.forEach(v => result[v] = obj1[v]);
    obj2Attr.forEach(v => result[v] = obj2[v]);
    return result;
};

/**
 * 克隆对象
 * @param {*} obj 
 */
function clone(obj) {
    if(obj instanceof Array){
        return cloneArray(obj);
    }else if(obj instanceof Object){
        return cloneObject(obj);
    }else {
        return obj;
    }
}
function cloneArray(obj) {
    let result = new Array(obj.length);
    obj.forEach((v, i) => result[i] = clone(v));
    return result;
}
function cloneObject(obj) {
    let result = {};
    let keys = Object.getOwnPropertyNames(obj);
    keys.forEach(v => {
        result[v] = clone(obj[v])
    })
    return result;
}

