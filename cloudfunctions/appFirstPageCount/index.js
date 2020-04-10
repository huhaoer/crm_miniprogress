// 云函数入口文件
const cloud = require('wx-server-sdk');

cloud.init();//初始化
const rp = require('request-promise');//request-promise包

// 云函数入口函数
exports.main = async (event, context) => {
  const Token = event.Token;
  const UserId = event.UserId;
  const URL = 'http://smgnkj.natappfree.cc/ProjectMgeSvr.assx/appFirstPageCount'
  let options = {
    uri: URL,
    qs: {
      Token,
      UserId
    },
    // json: true 
  };
  return await rp(options)
}