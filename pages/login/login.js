// pages/login/login.js
Page({
  /**
   * 页面的初始数据
   */
  data: {
    user_account: "", //用户名
    user_pwd: "" //密码
  },
  // 点击按钮跳登录转到首页
  handleToHome() {

    // 判断用户信息的登录信息
    wx.showLoading({
      title: "登录中",
      mask: true
    });

    // 密码错误
    if ((this.data.user_account !== "123456") && (this.data.user_pwd !== "123456")) {
      // 隐藏loading
      wx.hideLoading();
      //弹框提醒
      wx.showToast({
        title: "密码错误",
        icon: 'none',
        duration: 1500,
        mask: true
      });
    } else {
      // 隐藏loading
      wx.hideLoading();
      //跳转页面
      wx.redirectTo({
        url: "/pages/home/home",
        success: result => {
          console.log(result, "跳转结果");
        }
      });
    }
  },
  // 用户输入失焦事件
  accountBlur(e) {
    let val = e.detail.value; //用户名
    this.setData({
      user_account: val
    });
  },

  // 用户密码失焦事件
  passwordBlur(e) {
    let pwd = e.detail.value;
    this.setData({
      user_pwd: pwd
    });
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    // var that = this
    // 　　// 查看是否授权
    // 　　wx.getSetting({
    // 　　　　success(res) {
    //   console.log(res)
    // 　　　　　　if (res.authSetting['scope.userInfo']) {
    // 　　　　　　　　// 已经授权，可以直接调用 getUserInfo 获取头像昵称
    // 　　　　　　　　wx.getUserInfo({
    // 　　　　　　　　　　success: function (res) {
    //   console.log(res)
    // 　　　　　　　　　　　　that.setData({
    // 　　　　　　　　　　　　　　info: res.userInfo
    // 　　　　　　　　　　　　})
    // 　　　　　　　　　　}
    // 　　　　　　　　})
    // 　　　　　　}
    // 　　　　}
    // 　　})
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {},

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {},

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {},

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {},

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {},

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {},

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {}
});
