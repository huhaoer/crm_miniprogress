// 云函数入口文件
const cloud = require('wx-server-sdk');

cloud.init();//初始化
const rp = require('request-promise');//request-promise包

// 云函数入口函数
exports.main = async (event, context) => {
  // 通过event传递参数
  const token = event.token
  const ContractCode = event.ContractCode
  const PhaseDescribe = event.PhaseDescribe
  const PhasePlanTime = event.PhasePlanTime
  const PhaseType = event.PhaseType
  const PhaseAmount = event.PhaseAmount
  const PhaseId = event.PhaseId
  const PhaseFactTime = event.PhaseFactTime

  const URL = 'http://d3zgyg.natappfree.cc/ContractMgeSvr.assx/addPhase'

  let options = {
    uri: URL,
    qs: {
      token,
      ContractCode,
      PhaseDescribe,
      PhasePlanTime,
      PhaseType,
      PhaseAmount,
      PhaseId,
      PhaseFactTime
    },
    // json: true 
  };

  return await rp(options)
}