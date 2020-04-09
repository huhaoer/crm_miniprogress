
Page({

  /**
   * 页面的初始数据
   */
  data: {
    show_kind: false,//'是否展示项目分类选项',
    kind_value: '请选择',//选择的项目分类值
    show_user: false,//'是否展示客户分类选项',
    user_value: '请选择',//选择的客户分类值
  },

  // 1.点击选择弹出项目分类菜单
  showKind() {
    this.setData({
      show_kind: true
    })
  },
  // 2.点击关闭项目等级选择
  close_kind() {
    this.setData({
      show_kind: false
    })
  },
  // 3.点击选中某一个项目等级
  select_kind(e) {
    this.setData({
      kind_value: e.detail.name
    })
  },
  // 4.点击选择弹出客户分类菜单
  showUser() {
    this.setData({
      show_user: true
    })
  },
  // 5.点击关闭客户选择
  close_user() {
    this.setData({
      show_user: false
    })
  },
  // 6.点击选中某一个项目等级
  select_user(e) {
    this.setData({
      user_value: e.detail.name
    })
  },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.showLoading({
      title: '提交中',
      mask: true,
      success(e) {
        console.log(e)
      }
    })

    setTimeout(() => {
      wx.hideLoading();
    }, 2000);
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})