// 云函数入口文件
const cloud = require('wx-server-sdk');

cloud.init();//初始化
const rp = require('request-promise');//request-promise包

// 云函数入口函数
exports.main = async (event, context) => {
/**
 * (String token,  1
 * String ContractCode,1
 * String ProjectCode, 1
 * String ContractName, 1
 * String ContractType, 1
 * String PartyA, 
 * String PartyB, 
 * String PartyC, 
 * double ContractAmount, 1
 * String ContractParentCode, 
 * Date ContractSignTime, 1
 * Date ContractEndTime,1
 * Date ContractEffectTime,
 * Date ContractNoEffectTime , 
 * String ContractRemark)1
 */
  const token = event.token;
  const ContractName = event.ContractName;
  const ProjectCode = event.ProjectCode;
  const ContractCode = event.ContractCode;
  const ContractType = event.ContractType;
  const ContractParentCode = event.ContractParentCode;
  const ContractAmount = event.ContractAmount;
  const ContractSignTime = event.ContractSignTime;
  const ContractEndTime = event.ContractEndTime;
  const ContractRemark = event.ContractRemark;

  const URL = 'http://8kwp55.natappfree.cc/ContractMgeSvr.assx/addContract'
  let options = {
    uri: URL,
    qs: {
      token,
      ContractName,
      ProjectCode,
      ContractCode,
      ContractType,
      ContractAmount,
      ContractSignTime,
      ContractEndTime,
      ContractRemark,
      ContractParentCode
    },
    // json: true 
  };
  return await rp(options)
}