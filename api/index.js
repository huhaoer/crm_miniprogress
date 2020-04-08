// loading配置，请求次数统计
function startLoading() {
  wx.showLoading({
    title: "Loading...",
    mask: true,
  });
}
function endLoading() {
  wx.hideLoading();
}
// 声明一个对象用于存储请求个数
var needLoadingRequestCount = 0;

// 发送一个请求时 调用showLoading方法
function showFullScreenLoading() {
  if (needLoadingRequestCount === 0) {
    startLoading();
    wx.showNavigationBarLoading();
  }
  needLoadingRequestCount++;
}
// 加载全部结束时 调用hideLoading方法
function tryHideFullScreenLoading() {
  if (needLoadingRequestCount <= 0) return;
  needLoadingRequestCount--;
  if (needLoadingRequestCount === 0) {
    endLoading();
    wx.hideNavigationBarLoading();
  }
}

/**
 * 判断token是否过期
 */
// function isLogin(token) {

// }

// 导出的用于请求的方法
let cloudFunc = (name, data) => {
  wx.showNavigationBarLoading();
  showFullScreenLoading();
  return new Promise((resolve, reject) => {
    wx.cloud.callFunction({
      name,
      data,
      success(res) {
        resolve(res);
        tryHideFullScreenLoading();
        wx.hideNavigationBarLoading();
      },
      fail(err) {
        reject(err);
        tryHideFullScreenLoading();
        wx.hideNavigationBarLoading();
      }
    });
  });
};

// 封装request-pormise方法
module.exports =  cloudFunc