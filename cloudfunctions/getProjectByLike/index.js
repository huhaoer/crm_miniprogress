// 云函数入口文件
const cloud = require('wx-server-sdk');

cloud.init();//初始化
const rp = require('request-promise');//request-promise包

// 云函数入口函数
exports.main = async (event, context) => {
  // 通过event传递参数
  const StrField = event.StrField;
  const Token = event.Token;
  const Skip = event.Skip;
  const Size = event.Size;
  const Option = event.Option;
  const URL = 'http://w3ituu.natappfree.cc/ProjectMgeSvr.assx/getProjectByLike'
  let options = {
    uri: URL,
    qs: {
      StrField,
      Token,
      Skip,
      Size,
      Option
    },
  };

  return await rp(options)
}