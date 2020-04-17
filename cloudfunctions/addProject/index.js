// 云函数入口文件
const cloud = require('wx-server-sdk');

cloud.init();//初始化
const rp = require('request-promise');//request-promise包

// 云函数入口函数
exports.main = async (event, context) => {
  const Token = event.Token;//Token值
  const ProjectName = event.ProjectName;//项目名称
  const ProjectDescribe = event.ProjectDescribe;//项目描述
  const ProjectType = event.ProjectType;//项目类型
  const ProjectRemark = event.ProjectRemark;//项目备注
  const CustId = event.CustId;//客户id
  const UserId = event.UserId;//销售id
  const ContactName = event.ContactName;//联系人姓名
  const ContactTel = event.ContactTel;//联系人电话
  const ContactDuty = event.ContactDuty;//联系人职务
  

  const URL = 'http://8kwp55.natappfree.cc/ProjectMgeSvr.assx/addProject'//添加项目
  let options = {
    uri: URL,
    qs: {
      Token,
      ProjectName,
      ProjectDescribe,
      ProjectType,
      ProjectRemark,
      CustId,
      UserId,
      ContactName,
      ContactTel,
      ContactDuty
    },
    // json: true 
  };
  return await rp(options)
}