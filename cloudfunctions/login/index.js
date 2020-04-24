// 云函数入口文件
const cloud = require('wx-server-sdk');

cloud.init();//初始化
const rp = require('request-promise');//request-promise包

// 云函数入口函数
exports.main = async (event, context) => {
  // 通过event传递参数
  const loginId = event.loginId
  const password = event.password
  const URL = 'http://d3zgyg.natappfree.cc/Authorize.assx/Login'

  let options = {
    uri: URL,
    qs: {
      loginId,
      password
    },
    // json: true 
  };

  return await rp(options)
}