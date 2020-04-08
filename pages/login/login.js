const cloudFunc = require("../../api/index");
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
    const that = this;
    console.log(that.data.user_account,that.data.user_pwd)
    cloudFunc("login", {
      UserName: that.data.user_account,
      Password: that.data.user_pwd
    })
      .then(res => {
        console.log(res, "登录结果");
        let result = JSON.parse(res.result);
        console.log(result, "JSON转换的result");
        console.log(result.token, "result.token");
        // 密码错误
        if (result.message === "登录失败,账户或密码错误") {
          wx.showToast({
            title: "密码错误",
            icon: "none",
            duration: 1000,
            mask: true
          });
          return;
        } else {
          //保存token
          wx.setStorageSync("token", result.token);
          // 保存用户
          wx.setStorageSync("user", JSON.stringify(result.user));
          // 跳转到首页
          wx.redirectTo({
            url: "/pages/home/home"
          });
        }
      })
      .catch(err => {
        console.log(err, "登录失败");
        wx.showToast({
          title: "登录失败",
          icon: "none",
          duration: 1000,
          mask: true
        });
      });
    // 密码错误
  },
  // 用户输入输入事件
  accountInput(e) {
    let val = e.detail.value; //用户名
    this.setData({
      user_account: val
    });
  },

  // 用户密码输入事件
  passwordInput(e) {
    let pwd = e.detail.value;
    this.setData({
      user_pwd: pwd
    });
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {},

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
});
