// 云函数入口文件
const cloud = require('wx-server-sdk');

cloud.init();//初始化
const rp = require('request-promise');//request-promise包

// 云函数入口函数
exports.main = async (event, context) => {
  const Token = event.Token;
  const ProjectCode = event.ProjectCode;

  const URL = 'http://w3ituu.natappfree.cc/ProjectMgeSvr.assx/addAttentionProject'
  let options = {
    uri: URL,
    qs: {
      Token,
      ProjectCode,
    },
    // json: true 
  };
  return await rp(options)
}