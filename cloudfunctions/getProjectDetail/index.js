// 云函数入口文件
const cloud = require('wx-server-sdk');

cloud.init();//初始化
const rp = require('request-promise');//request-promise包

// 云函数入口函数
exports.main = async (event, context) => {
  const ProjectCode = event.ProjectCode;
  const Option = event.Option;
  const Token = event.Token;
  const URL = 'http://w3ituu.natappfree.cc/ProjectMgeSvr.assx/getProjectDetail'
  let options = {
    uri: URL,
    qs: {
      ProjectCode,
      Option,
      Token
    },
    // json: true 
  };
  return await rp(options)
}