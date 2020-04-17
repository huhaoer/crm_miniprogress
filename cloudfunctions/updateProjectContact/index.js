// 云函数入口文件
const cloud = require('wx-server-sdk');

cloud.init();//初始化
const rp = require('request-promise');//request-promise包

// 云函数入口函数
exports.main = async (event, context) => {
  // 通过event传递参数
  const Token = event.Token
  const ProjectCode = event.ProjectCode
  const ContactName = event.ContactName
  const ContactTel = event.ContactTel
  const ContactDuty = event.ContactDuty
  
  const URL = 'http://8kwp55.natappfree.cc/ProjectMgeSvr.assx/updateProjectContact'
  let options = {
    uri: URL,
    qs: {
      Token,
      ProjectCode,
      ContactName,
      ContactTel,
      ContactDuty
    },
    // json: true 
  };

  return await rp(options).then(res => res).catch(err => err)
}