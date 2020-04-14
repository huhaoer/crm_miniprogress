const AppID = "wx3186c10ca59e1b79";
const AppSecret = "8f78943af083115f3153f5fa160a6da2";
const cloudFunc = require("../../api/index");
const regeneratorRuntime = require("../../utils/runtime"); //ES7 环境
import { getToken, getUserId } from "../../utils/storage";
import parseTime from '../../utils/parseTime'
Page({
  /**
   * 页面的初始数据
   */
  data: {
    showScroll: false, //是否显示回到顶部按钮
    activeNames: '',//折叠面板显示展开的name值
    show_header: {}, //首页头部数据渲染
    recent_visit: [], //近期拜访的数据列表
    recent_project: [], //近期展示的项目
  },

  // 返回顶部
  handleTop() {
    if (wx.pageScrollTo) {
      wx.pageScrollTo({
        scrollTop: 0,
      });
    } else {
      wx.showModal({
        title: "提示",
        content:
          "当前微信版本过低，无法使用该功能，请升级到最新微信版本后重试。",
      });
    }
  },

  // 点击进入拜访详情
  handleToVisit(e) {
    const proid = e.currentTarget.dataset.proid; //当前点击项目的id
    const proname = e.currentTarget.dataset.proname;
    const procontact = e.currentTarget.dataset.procontact;
    const protime = e.currentTarget.dataset.protime;
    const protel = e.currentTarget.dataset.protel;
    const visitid = e.currentTarget.dataset.visitid;
    const detail = {
      //当前项目展示详情 传递到visitDetail页面
      proname,
      procontact,
      protime,
      protel,
    };
    wx.navigateTo({
      url:
        "/pages/visitDetail/visitDetail?proid=" +
        proid +
        "&detail=" +
        JSON.stringify(detail) +
        "&visitid=" +
        visitid,
    });
  },
  // 点击切换显示合同的折叠面板  返回的参数是当前点击展开的activeNames
  onChangeColl(activeNames) {
    if(activeNames.detail) {
      this.setData({
        activeNames:activeNames.detail
      })
    }else {
      this.setData({
        activeNames:""
      })
    }
  },
  // 点击首页的添加拜访图标进入添加拜访页面
  gotoAddVisit() {
    wx.navigateTo({
      url: "/pages/addVisit/addVisit",
    });
  },
  // 生命周期 === 获取近期拜访列表
  async getRecentList() {
    const that = this;
    const Token = getToken();
    try {
      let res = await cloudFunc("getRecentVisitList", {
        Token,
        Option: 0,
      });
      let result = JSON.parse(res.result); //转换为JSON
      console.log(result,'44444444444444')
      result.forEach((item) => {
        item.VisitPlanTime = ("" + item.VisitPlanTime)
          .split("T")[0]
          .replace(/\-/g, "."); //遍历处理时间
      });
      that.setData({
        recent_visit: result, //将获取的数据赋值渲染
      });
      wx.stopPullDownRefresh(); //下拉刷新成功
    } catch (error) {
      console.log(error, "错误");
      wx.showToast({
        title: "请求错误",
        icon: "none",
        duration: 1500,
        mask: true,
      });
      wx.stopPullDownRefresh(); //下拉刷新成功
    }
  },
  // 获取项目信息(我的收藏)  ===  生命周期
  async getAttentionList() {
    const that = this;
    try {
      const Token = getToken();
      const UserId = getUserId();
      let res = await cloudFunc("getAttentionList", {
        Token,
        UserId,
      });
      console.log(res,'关注结果')
      let result = JSON.parse(res.result); //转换为JSON
      // 处理项目创建时间
      result.forEach(item => {
        item.ProjectCreateTime = item.ProjectCreateTime && parseTime(item.ProjectCreateTime / 1000);
        
      })
      that.setData({
        recent_project: result, //将获取的数据赋值渲染
      });
      wx.stopPullDownRefresh(); //下拉刷新成功
    } catch (error) {
      console.log(error, "错误");
      wx.showToast({
        title: "请求错误",
        icon: "none",
        duration: 1500,
        mask: true,
      });
      wx.stopPullDownRefresh(); //下拉刷新成功
    }
  },
  // 获取首页头部数据信息
  async appFirstPageCount() {
    try {
      const that = this;
      const Token = getToken();
      const UserId = getUserId(); //缓存中读取用户id
      let res = await cloudFunc("appFirstPageCount", {
        Token,
        UserId,
      });
      let result = JSON.parse(res.result); //转换为JSON
      console.log(result, "GGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGG");
      const renderResult = this.filterMoney(result);//重新处理数据
      console.log(renderResult,'。。。。。。。。。。。。。')
      that.setData({
        show_header: renderResult, //将获取的数据赋值渲染
      });
      wx.stopPullDownRefresh(); //下拉刷新成功
    } catch (error) {
      console.log(error);
      wx.showToast({
        title: "查询失败",
        icon: "none",
        duration: 1000,
        mask: true,
      });
      wx.stopPullDownRefresh(); //下拉刷新成功
    }
  },

  // 处理金钱价格 转换为万为单位
  filterMoney(money = {}) {
    let obj = {};
    for (const key in money) {
      let item = money[key];//每一项数据
      if(key === "contractTotal" || key === "projectNumber") {//合同数量属性 项目数量属性 跳过
        obj[key] = item
        continue
      }
      obj[key] = Math.round((parseInt(item) / 10000)) + '万'
    }
    return obj
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
  onShow: function () {
    // 取消首页导航
    if (wx.canIUse("hideHomeButton")) {
      wx.hideHomeButton();
    }
    // 调用初始化请求函数  因为在提交计划成功后要返回该页面  onShow重新刷新 自动更新计划
    this.getRecentList(); //获取近期拜访列表
    this.getAttentionList(); //获取首页项目情况(我的收藏)
    this.appFirstPageCount(); //获取首页头部数据信息
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {},

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {},

  // 获取滚动条当前位置
  onPageScroll: function (e) {
    // 判断回到顶部按钮是显示还是隐藏
    if (e.scrollTop > 150) {
      this.setData({
        showScroll: true,
      });
    } else {
      this.setData({
        showScroll: false,
      });
    }
  },
  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    this.getRecentList(); //获取近期拜访列表
    this.getAttentionList(); //获取首页项目情况
    this.appFirstPageCount(); //获取首页头部数据信息
  },
});
