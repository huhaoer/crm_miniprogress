// 云函数入口文件
const cloud = require('wx-server-sdk');

cloud.init();//初始化
const rp = require('request-promise');//request-promise包

// 云函数入口函数
exports.main = async (event, context) => {
  // 通过event传递参数
  const token = event.token;
  const skipNum = event.skipNum;
  const sizeNum = event.sizeNum;
  const Option = event.Option;

  const URL = 'http://w3ituu.natappfree.cc/CustomerMgeSvr.assx/getCustumerListByUserId'
  let options = {
    uri: URL,
    qs: {
      token,
      Option,
      skipNum,
      sizeNum
    },
    // json: true 
  };

  return await rp(options)
}