// 云函数入口文件
const cloud = require('wx-server-sdk');

cloud.init();//初始化
const rp = require('request-promise');//request-promise包

// 云函数入口函数
exports.main = async (event, context) => {
  // 通过event传递参数
  const Token = event.Token;
  const VisitId = event.VisitId;
  const VisitFactTime = event.VisitFactTime;
  const VisitFactContent = event.VisitFactContent;
  const VisitRemark = event.VisitRemark;

  const URL = 'http://g8x7bk.natappfree.cc/ProjectMgeSvr.assx/updateVisit'
  let options = {
    uri: URL,
    qs: {
      Token,
      VisitId,
      VisitFactTime,
      VisitFactContent,
      VisitRemark
    },
    // json: true 
  };

  return await rp(options)
}