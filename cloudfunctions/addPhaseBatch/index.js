// 云函数入口文件
const cloud = require('wx-server-sdk');

cloud.init();//初始化
const rp = require('request-promise');//request-promise包

// 云函数入口函数
exports.main = async (event, context) => {
  // 通过event传递参数
  const token = event.token;
  const ContractCode = event.ContractCode;
  const PhaseStr = event.PhaseStr;

  const URL = 'http://d3zgyg.natappfree.cc/ContractMgeSvr.assx/addPhaseBatch'
  let options = {
    uri: URL,
    qs: {
      token,
      ContractCode,
      PhaseStr
    },
    // json: true 
  };

  return await rp(options)
}