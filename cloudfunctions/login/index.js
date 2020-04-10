// 云函数入口文件
const cloud = require('wx-server-sdk');

cloud.init();//初始化
const rp = require('request-promise');//request-promise包

// 云函数入口函数
exports.main = async (event, context) => {
  // 通过event传递参数
  const UserName = event.UserName
  const Password = event.Password
  const URL = 'http://smgnkj.natappfree.cc/ContractController/login'
  let options = {
    uri: URL,
    qs: {
      UserName,
      Password
    },
    // json: true 
  };

  return await rp(options).then(res => res).catch(err => err)
}