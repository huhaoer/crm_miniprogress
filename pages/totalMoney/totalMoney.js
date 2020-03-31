// pages/totalMoney/totalMoney.js
Page({
  /**
   * 页面的初始数据
   */
  data: {
    activeNames: "", //手风琴页面默认显示的一条,数组形式
    active: "total", //tab页默认显示项目总金额页面
    isLoading: false //是否在加载中
  },
  // 折叠面板方法
  onChangeColl(event) {
    console.log(event);
    this.setData({
      activeNames: event.detail
    });
  },

  // tab切换方法
  onChangeTab(event) {
    console.log(event);
    // 切换tab页时 先返回顶部
    wx.pageScrollTo({
      scrollTop: 0
    });

    // 改变时先切换到加载状态
    this.setData({
      isLoading: true
    });

    // 模拟数据请求
    setTimeout(() => {
      this.setData({
        isLoading: false
      });
    }, 2000);
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
      });
    }

    // 调用云函数
    wx.cloud
      .callFunction({
        name: "getDatas", //云函数的名字
      })
      .then(res => {
        console.log(res, "云函数数据");
      })
      .catch(err => {
        console.log(err);
      });
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    const name = options.name || "total"; //获取跳转页面传递的tab页name名 默认为total
    console.log(name);
    this.setData({
      active: name,
      isLoading: true
    });
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {},

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

    // 加载数据
    setTimeout(() => {
      this.setData({
        isLoading: false
      });
    }, 2000);
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
  }
});
