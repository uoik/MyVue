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
    if(!data) return;
    let nameArr = name.split('.');
    let temp = data;
    for (let i = 0; i < nameArr.length - 1; i++) {
        if (temp[nameArr[i]]) {
            temp = temp[nameArr[i]];
        } else {
            return;
        };
    };
    if(temp[nameArr[nameArr.length - 1]] != null){
        temp[nameArr[nameArr.length - 1]] = value;
    }
}