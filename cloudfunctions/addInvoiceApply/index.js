// 云函数入口文件
const cloud = require('wx-server-sdk');

cloud.init();//初始化
const rp = require('request-promise');//request-promise包

// 云函数入口函数
exports.main = async (event, context) => {
  /**
  String token,  
  String ContractCode, 
  String PhaseId, 
  double InvoiceApplyAmount
   */
  const token = event.token;
  const ContractCode = event.ContractCode;
  const PhaseId = event.PhaseId;
  const InvoiceApplyAmount = event.InvoiceApplyAmount;

  const URL = 'http://d3zgyg.natappfree.cc/ContractMgeSvr.assx/addInvoiceApply'
  let options = {
    uri: URL,
    qs: {
      token,
      ContractCode,
      PhaseId,
      InvoiceApplyAmount
    },
    // json: true 
  };
  return await rp(options)
}