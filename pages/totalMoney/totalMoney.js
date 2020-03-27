// pages/totalMoney/totalMoney.js
Page({
  /**
   * 页面的初始数据
   */
  data: {
    activeNames: '',//手风琴页面默认显示的一条,数组形式
    active: "total",//tab页默认显示项目总金额页面
  },
  onChangeColl(event) {
    console.log(event)
    this.setData({
      activeNames: event.detail
    });
  },
  onChangeTab(event) {
    console.log(event)
    wx.showToast({
      title: `切换到标签 ${event.detail.name}`,
      icon: 'none'
    });
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    // 获取手机屏幕高度
    wx.getSystemInfo({
      success: (result)=>{
        console.log(result,'屏幕高度')
      },
      fail: ()=>{},
      complete: ()=>{}
    });
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
