// 云函数入口文件
const cloud = require('wx-server-sdk');

cloud.init();//初始化
const rp = require('request-promise');//request-promise包

// 云函数入口函数
exports.main = async (event, context) => {
  // 通过event传递参数
  const token = event.token
  const SearchCondition = event.SearchCondition
  const Option = event.Option
  const URL = 'http://w3ituu.natappfree.cc/ContractMgeSvr.assx/fuzzySearchContract'
  /**
   * (String token,
   * String SearchCondition, 
   * int Option
   */

  let options = {
    uri: URL,
    qs: {
      token,
      SearchCondition,
      Option
    },
    // json: true 
  };

  return await rp(options)
}