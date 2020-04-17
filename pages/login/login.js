const cloudFunc = require("../../api/index");
import { setToken, setUserId } from "../../utils/storage";
const regeneratorRuntime = require("../../utils/runtime"); //ES7 环境
Page({
  /**
   * 页面的初始数据
   */
  data: {
    user_account: "", //用户名
    user_pwd: "", //密码
  },
  // 校验用户输入
  checkUserInput() {
    const loginId = this.data.user_account;//用户名
    const password = this.data.user_pwd;//密码
    // 校验用户名
    if(!loginId) {
      wx.showToast({
        title: "请输入用户名",
        icon: "none",
        duration: 1000,
        mask: true,
      });
      return
    }
    // 校验密码
    if(!password) {
      wx.showToast({
        title: "请输入密码",
        icon: "none",
        duration: 1000,
        mask: true,
      });
      return
    }
    return true;//最后都校验通过返回true
  },
  // 点击按钮跳登录转到首页
  async handleToHome() {
    const that = this;
    // 校验
    if(!this.checkUserInput()) {
      return
    }
    try {
      let res = await cloudFunc("login", {
        loginId: that.data.user_account,
        password: that.data.user_pwd,
      });
      let result = JSON.parse(res.result);
      console.log(result, "JSON转换的result");
      // 密码错误
      if (result.Code !== 0) {
        wx.showToast({
          title: "登录失败",
          icon: "none",
          duration: 1000,
          mask: true,
        });
        return;
      } else {
        //保存token
        setToken(result.Token);
        // 保存用户id
        setUserId(result.UserId);
        // 跳转到首页
        wx.redirectTo({
          url: "/pages/home/home",
        });
      }
    } catch (error) {
      wx.showToast({
        title: "登录失败",
        icon: "none",
        duration: 1000,
        mask: true,
      });
    }
  },
  // 用户输入输入事件
  accountInput(e) {
    let val = e.detail.value; //用户名
    this.setData({
      user_account: val,
    });
  },

  // 用户密码输入事件
  passwordInput(e) {
    let pwd = e.detail.value;
    this.setData({
      user_pwd: pwd,
    });
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {},

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {},

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {},

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {},

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {},
});
