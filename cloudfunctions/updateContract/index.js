// 云函数入口文件
const cloud = require('wx-server-sdk');

cloud.init();//初始化
const rp = require('request-promise');//request-promise包

// 云函数入口函数
exports.main = async (event, context) => {
  // 通过event传递参数
  /**
     * @param token                token.
     * @param ContractCode         合同编号.
     * @param ContractEffectTime   合同生效时间.
     * @param ContractNoEffectTime 合同失效时间.
     * @param ContractName         合同名称.
     * @param ContractType         合同类型.
     * @param PartyA               合同甲方.
     * @param PartyB               合同乙方.
     * @param PartyC               合同丙方.
     * @param ContractAmount       合同总金额.
     * @param ContractParentCode   父合同编号.
     * @param ContractSignTime     合同签订时间.
     * @param ContractEndTime      合同结束时间.
     * @param ContractRemark       备注.
     * @param ProjectCode           所属项目code
     * @param ContractNewCode       新合同code
   */
  const token = event.token
  const ContractCode = event.ContractCode
  const ContractEffectTime = event.ContractEffectTime
  const ContractNoEffectTime = event.ContractNoEffectTime
  const ContractName = event.ContractName
  const ContractType = event.ContractType
  const PartyA = event.PartyA
  const PartyB = event.PartyB
  const PartyC = event.PartyC
  const ContractAmount = event.ContractAmount
  const ContractParentCode = event.ContractParentCode
  const ContractSignTime = event.ContractSignTime
  const ContractEndTime = event.ContractEndTime
  const ContractRemark = event.ContractRemark
  const ProjectCode = event.ProjectCode
  const ContractNewCode = event.ContractNewCode

  const URL = 'http://w3ituu.natappfree.cc/ContractMgeSvr.assx/updateContract'
  let options = {
    uri: URL,
    qs: {
      token,
      ContractCode,
      ContractEffectTime,
      ContractNoEffectTime,
      ContractName,
      ContractType,
      PartyA,
      PartyB,
      PartyC,
      ContractAmount,
      ContractParentCode,
      ContractSignTime,
      ContractEndTime,
      ContractRemark,
      ProjectCode,
      ContractNewCode
    },
  };

  return await rp(options)
}