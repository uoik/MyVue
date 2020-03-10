/**
 * 将对象生成字符串代码
 * @param {*} data 
 */
export function generateCode(data) {
    let code = '';
    for (const key in data) {
        code += `let ${key} = ${JSON.stringify(data[key])};`;
    }
    return code;
}

/**
 * 执行表达式
 * @param {*} expression 表达式
 * @param {*} env 环境
 */
export function isTrue(expression, env) {
    let bool = false;
    let code = env;
    code += `if(${expression}){bool = true};`;
    eval(code);
    return bool;
}