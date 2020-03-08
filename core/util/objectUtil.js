/**
 * 遍历数据，得到模板对应的值
 * @param {*} data 数据
 * @param {*} name 插值名称
 */
export function getValue(data, name) {
    if (!data) return data;
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