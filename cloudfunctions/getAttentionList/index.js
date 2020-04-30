// 云函数入口文件
const cloud = require('wx-server-sdk');

cloud.init();//初始化
const rp = require('request-promise');//request-promise包

// 云函数入口函数
exports.main = async (event, context) => {
  const Token = event.Token;
  const SkipNum = event.SkipNum;
  const SizeNum = event.SizeNum;

  const URL = 'http://w3ituu.natappfree.cc/ProjectMgeSvr.assx/getAttentionList'
  let options = {
    uri: URL,
    qs: {
      Token,
      SkipNum,
      SizeNum
    },
    // json: true 
  };
  return await rp(options)
}