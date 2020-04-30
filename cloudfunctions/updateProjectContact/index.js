// 云函数入口文件
const cloud = require('wx-server-sdk');

cloud.init();//初始化
const rp = require('request-promise');//request-promise包

// 云函数入口函数
exports.main = async (event, context) => {
  /**
   * 
     * @param ProjectCode 项目编号.
     * @param ProjectName 项目名称.
     * @param ProjectDescribe 项目描述.
     * @param ProjectType 项目分类.
     * @param ProjectRemark 备注.
     * @param ProjectPLevel 项目p级
     * @param ProjectStatus 项目状态
     * 
     * @param Token token.
     * @param CustId 客户id.
     * @param UserId 销售id.
     * 
     * @param ContactName 联系人名字
     * @param ContactTel 联系人电话
     * @param ContactDuty 联系人职务
   */
  // 通过event传递参数
  const Token = event.Token
  // 项目
  const ProjectCode = event.ProjectCode
  const ProjectName = event.ProjectName
  const ProjectDescribe = event.ProjectDescribe
  const ProjectType = event.ProjectType
  const ProjectRemark = event.ProjectRemark
  const ProjectPLevel = event.ProjectPLevel
  const ProjectStatus = event.ProjectStatus
  // 合同
  const ContactName = event.ContactName
  const ContactTel = event.ContactTel
  const ContactDuty = event.ContactDuty
  // 客户
  const CustId = event.CustId
  const UserId = event.UserId;//销售id
  const URL = 'http://w3ituu.natappfree.cc/ProjectMgeSvr.assx/updateProject'
  let options = {
    uri: URL,
    qs: {
      Token,
      ProjectCode,
      ProjectName,
      ProjectDescribe,
      ProjectType,
      ProjectRemark,
      ProjectPLevel,
      ProjectStatus,
      ContactName,
      ContactTel,
      ContactDuty,
      CustId,
      UserId
    },
    // json: true 
  };

  return await rp(options)
}