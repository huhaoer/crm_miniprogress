const AppID = "wx3186c10ca59e1b79";
const AppSecret = "8f78943af083115f3153f5fa160a6da2";
const cloudFunc  = require('../../api/index')
Page({
  /**
   * 页面的初始数据
   */
  data: {
    showScroll: false, //是否显示回到顶部按钮
    recent_visit: [], //近期拜访的数据列表
    recent_project: [], //近期展示的项目
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
  },

  // 点击进入拜访详情
  handleToVisit(e) {
    const proid = e.currentTarget.dataset.proid; //当前点击项目的id
    const proname = e.currentTarget.dataset.proname; 
    const procontact = e.currentTarget.dataset.procontact; 
    const protime = e.currentTarget.dataset.protime; 
    const protel = e.currentTarget.dataset.protel; 
    const visitid = e.currentTarget.dataset.visitid; 
    const detail = {//当前项目展示详情 传递到visitDetail页面
      proname,
      procontact,
      protime,
      protel
    }
    wx.navigateTo({
      url: "/pages/visitDetail/visitDetail?proid=" + proid + "&detail=" + JSON.stringify(detail) + '&visitid=' + visitid
    });
  },

  // 点击首页的添加拜访图标进入添加拜访页面
  gotoAddVisit() {
    wx.navigateTo({
      url: "/pages/addVisit/addVisit"
    });
  },
  // 生命周期 === 获取近期拜访列表
  getRecentList() {
    const that = this;
    cloudFunc('getRecentVisitList',{Token:"123",Option:0})
      .then(res => {
        let result = JSON.parse(res.result);//转换为JSON
        console.log(result,'44444444444444')
        result.forEach(item => {
          item.VisitPlanTime = ('' + item.VisitPlanTime).split("T")[0].replace(/\-/g,".");//遍历处理时间
        })
        that.setData({
          recent_visit: result//将获取的数据赋值渲染
        });
        wx.stopPullDownRefresh();//下拉刷新成功
      })
      .catch(err => {
        console.log(err,'错误')
        wx.showToast({
          title: '请求错误',
          icon: 'none',
          duration: 1500,
          mask: true,
        });
        wx.stopPullDownRefresh();//下拉刷新成功
      })
  },
  // 获取项目信息  ===  生命周期
  getContractList() {
    const that = this;
    const token = wx.getStorageSync('token');;
    console.log(token,'tokentokentoken')
    cloudFunc('getContractList',{
      token,
      Option: 0
    })
      .then(res => {
        console.log(res,'0000000000000','项目11111')
        let result = JSON.parse(res.result)._Items;//转换为JSON
        console.log(result,'结果++++++++++++++++++++++++ 项目')
        that.setData({
          recent_project: result//将获取的数据赋值渲染
        });
        wx.stopPullDownRefresh();//下拉刷新成功
      })
      .catch(err => {
        console.log(err,'错误')
        wx.showToast({
          title: '请求错误',
          icon: 'none',
          duration: 1500,
          mask: true,
        });
        wx.stopPullDownRefresh();//下拉刷新成功
      })
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
    if (wx.canIUse("hideHomeButton")) {
      wx.hideHomeButton();
    }
    // 调用初始化请求函数  因为在提交计划成功后要返回该页面  onShow重新刷新 自动更新计划
    this.getRecentList();//获取近期拜访列表
    this.getContractList();//获取首页项目情况
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
  onPullDownRefresh: function() {
    this.getRecentList();//获取近期拜访列表
    this.getContractList();//获取首页项目情况
  },
});
