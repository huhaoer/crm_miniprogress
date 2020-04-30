const request  = require('./request');//导入request请求函数
const URL = require('./url');//导入url路径对象

// 1.登陆接口
export function login(data) {
    return request.get(URL.login,data)
}