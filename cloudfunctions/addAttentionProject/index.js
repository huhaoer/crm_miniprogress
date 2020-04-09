// 云函数入口文件
const cloud = require('wx-server-sdk');

cloud.init();//初始化
const rp = require('request-promise');//request-promise包

// 云函数入口函数
exports.main = async (event, context) => {
  const Token = event.Token;
  const ProjectCode = event.ProjectCode;
  const UserId = event.UserId;

  const URL = 'http://jn6h3r.natappfree.cc/ProjectMgeSvr.assx/addAttentionProject'
  let options = {
    uri: URL,
    qs: {
      Token,
      ProjectCode,
      UserId,
    },
    // json: true 
  };
  return await rp(options)
}