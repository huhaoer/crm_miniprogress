const URL = require('./url');
// loading配置，请求次数统计
function startLoading() {
  wx.showLoading({
    title: 'Loading...',
    icon: 'none',
    mask: true,
  })
}
function endLoading() {
  wx.hideLoading();
}
// 声明一个对象用于存储请求个数
var needLoadingRequestCount = 0;
function showFullScreenLoading() {
  if (needLoadingRequestCount === 0) {
    startLoading();
  }
  needLoadingRequestCount++;
};
function tryHideFullScreenLoading() {
  if (needLoadingRequestCount <= 0) return;
  needLoadingRequestCount--;
  if (needLoadingRequestCount === 0) {
    endLoading();
  }
};

// get/post请求
function fun(url, method, data = {}, header = { 'content-type': 'application/json' }) {
  wx.showNavigationBarLoading();
  showFullScreenLoading();
  let promise = new Promise(function (resolve, reject) {
    wx.request({
      url: URL.base_url + url,//封装的基础路径对象加自己传递的路径
      header: header,
      data: data,
      method: method,
      success: function (res) {
        //  根据返回结果 判断其他情况
        // if (typeof res.data === "object") {
        //   if (res.data.status) {
        //     if (res.data.status === -200) {
        //       wx.showToast({
        //         title: "为确保能向您提供最准确的服务，请退出应用重新授权",
        //         icon: "none"
        //       });
        //       reject("请重新登录");
        //     } else if (res.data.status === -201) {
        //       wx.showToast({
        //         title: res.data.msg,
        //         icon: "none"
        //       });
        //       setTimeout(function () {
        //         wx.navigateTo({
        //           url: "/pages/user/supplement/supplement"
        //         });
        //       }, 1000);
        //       reject(res.data.msg);
        //     }
        //   }
        // }
        resolve(res.data);
        tryHideFullScreenLoading();
      },
      fail: function (res) {
        // fail调用接口失败
        reject({ error: '网络错误', code: 0 });
        tryHideFullScreenLoading();
      },
      complete: function () {
        wx.hideNavigationBarLoading();
      }
    });
  });
  return promise;
}
// 上传
function upload(url, name, filePath) {
  let header = {};
  wx.showNavigationBarLoading();
  showFullScreenLoading();
  let promise = new Promise(function (resolve, reject) {
    wx.uploadFile({
      url: baseUrl + url,
      filePath: filePath,
      name: name,
      header: header,
      success: function (res) {
        resolve(res.data.result);
        tryHideFullScreenLoading();
      },
      fail: function() {
        reject({ error: '网络错误', code: 0 });
        tryHideFullScreenLoading();
      },
      complete: function () {
        wx.hideNavigationBarLoading();
        wx.hideLoading();
      }
    });
  });
  return promise;
}
module.exports = {
  "get": function (url, data, header) {
    return fun(url, "GET", data, header);
  },
  "post": function (url, data, header) {
    return fun(url, "POST", data, header);
  },
//   upload: function (url, name, filePath) {
//     return upload(url, name, filePath);
//   }
};