const AppID = "wx3186c10ca59e1b79";
const AppSecret = "8f78943af083115f3153f5fa160a6da2";
Page({
  /**
   * 页面的初始数据
   */
  data: {
    js_code: "", //JS_CODE
    showScroll: false //是否显示回到顶部按钮
  },


  // 返回顶部
  handleTop() {
    if (wx.pageScrollTo) {
      wx.pageScrollTo({
        scrollTop: 0
      });
    } else {
      wx.showModal({
        title: "提示",
        content:
          "当前微信版本过低，无法使用该功能，请升级到最新微信版本后重试。"
      })
    }
  },



  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
 
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {},

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    // 取消首页导航
    // wx.hideShareMenu({
    //   success: (result)=>{
        
    //   },
    //   fail: ()=>{},
    //   complete: ()=>{}
    // });
    if (wx.canIUse('hideHomeButton')) {
      wx.hideHomeButton()
    }
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {},

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {},

  // 获取滚动条当前位置
  onPageScroll: function(e) {
    // 判断回到顶部按钮是显示还是隐藏
    if (e.scrollTop > 150) {
      this.setData({
        showScroll: true
      });
    } else {
      this.setData({
        showScroll: false
      });
    }
  },

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
