// 云函数入口文件
const cloud = require('wx-server-sdk');

cloud.init();//初始化
const rp = require('request-promise');//request-promise包

// 云函数入口函数
exports.main = async (event, context) => {
  // 通过event传递参数
  const token = event.token;
  const sizeNum = event.sizeNum;
  const skipNum = event.skipNum;
  const Option = event.Option;

  const URL = 'http://jn6h3r.natappfree.cc/CustomerMgeSvr.assx/getCustomerList'
  let options = {
    uri: URL,
    qs: {
      token,
      sizeNum,
      skipNum,
      Option
    },
    // json: true 
  };

  return await rp(options)
}