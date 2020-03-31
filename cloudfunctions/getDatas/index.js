// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()//初始化
const rp = require('request-promise');//request-promise包

// 云函数入口函数
exports.main = async (event, context) => {
  let options = {
    uri: 'http://bwgxr6.natappfree.cc/chooseInfo/getChooseByteacherId',
    qs: {
      teacherId: '123456' 
    },
    json: true 
};

return await rp(options)
    .then(res => res)
    .catch(err => console.log(err));
}