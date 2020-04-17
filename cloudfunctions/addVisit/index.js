// 云函数入口文件
const cloud = require('wx-server-sdk');

cloud.init();//初始化
const rp = require('request-promise');//request-promise包

// 云函数入口函数
exports.main = async (event, context) => {
  const ProjectCode = event.proid;
  const VisitRemark = event.remark_mes;
  const VisitFactContent = event.content_mes;
  const VisitFactTime = event.picker_value;
  const Token = event.Token;
  const VisitPlanTime = event.VisitPlanTime;
  const VisitPlanContent = event.VisitPlanContent;

  /**
   * remark_mes: that.data.nowPlanRemark,//备注信息
        content_mes:that.data.nowPlanContent,//内容信息
        picker_value:that.data.nowPlanTime,//选择时间
   */

  const URL = 'http://8kwp55.natappfree.cc/ProjectMgeSvr.assx/addVisit'
  let options = {
    uri: URL,
    qs: {
      ProjectCode,
      VisitRemark,
      VisitFactContent,
      VisitFactTime,
      Token,
      VisitPlanTime,
      VisitPlanContent,
    },
    // json: true 
  };
  return await rp(options)
}