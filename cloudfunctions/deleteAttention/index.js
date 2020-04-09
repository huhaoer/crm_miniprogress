// 云函数入口文件
const cloud = require('wx-server-sdk');

cloud.init();//初始化
const rp = require('request-promise');//request-promise包

// 云函数入口函数
exports.main = async (event, context) => {
  const Token = event.Token;
  const AttentionId = event.AttentionId;

  const URL = 'http://jn6h3r.natappfree.cc/ProjectMgeSvr.assx/deleteAttention'
  let options = {
    uri: URL,
    qs: {
      Token,
      AttentionId
    },
    // json: true 
  };
  return await rp(options)
}