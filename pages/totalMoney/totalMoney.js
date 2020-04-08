const cloudFunc  = require('../../api/index')
Page({
  /**
   * 页面的初始数据
   */
  data: {
    activeNames: "", //手风琴页面默认显示的一条,数组形式
    active: "", //tab页面显示的选项页面 根据传递的name值判断显示哪一个页面
    totalNameData: [],//项目总金额列表数据
    willPayNameData: [],//暂未回款金额列表数据
    waitPayNameData: [],//待回款金额列表数据
    projectNameData: [],//我的项目列表数据
    contractNameData: [],//我的合同列表数据
  },
  // 1.折叠面板方法
  onChangeColl(event) {
    console.log(event);
    this.setData({
      activeNames: event.detail
    });
  },

  // 2.tab切换方法
  onChangeTab(event) {
    console.log(event);
    // 切换tab页时 先返回顶部
    wx.pageScrollTo({
      scrollTop: 0
    });

    // 改变时先切换到加载状态和修改当前激活的name
    this.setData({
      active: event.detail.name
    });

    console.log(this.data.active,'当前选择的tab')
    this.getCheckedTab(this.data.active);// 调用switch case方法  获取当前改变的tab选项的数据
  },

  // 3.返回顶部
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
  // 4.点击跳转到项目详情
  handleToItemdetail() {
    wx.navigateTo({
      url: '/pages/itemDetail/itemDetail'
    });
  },

  // 5.点击添加项目按钮
  addItem() {
    wx.navigateTo({
      url: '/pages/addItem/addItem'
    });
  },

  // 6.switch case选择当前tab选项获取数据
  getCheckedTab(tabName) {
    // 数据请求
    switch (tabName) {
      case 'total':
        // 请求total数据
        break;
      case 'hasPay':
        // 请求willPay数据
        break;
      case 'noPay':
        // 请求waitPay数据
        break;
      case 'project':
        // 请求project数据
        this.getOwnProjectList();
        break;
      case 'contract':
        // 请求contract数据
        break;
      default:
        break;
    }
  },

  // 生命周期函数  ==  获取我的项目
  getOwnProjectList() {
    const that = this;
    const Token = wx.getStorageSync('token');
    const UserId = JSON.parse(wx.getStorageSync('user')).userId;//缓存中读取用户id
    const Option = 0;//Option为0获取全部数据
    cloudFunc('getOwnProjectList',{
      Token,
      UserId,
      Option
    })
      .then(res => {
        let result = JSON.parse(res.result);//转换为JSON
        console.log(result,'转换后的结果')
        result.forEach(item => {
          item.ProjectCreateTime = item.ProjectCreateTime && item.ProjectCreateTime.split('T')[0].replace(/\-/g,".");//处理时间
        });
        that.setData({
          projectNameData: result,//设置返回渲染的数据
        })
      })
      .catch(err => {
        console.log(err,'错误')
        wx.showToast({
          title: '请求错误',
          icon: 'none',
          duration: 1500,
          mask: true,
        });
      })
  },

  // 生命周期函数  ==  获取我的合同
  // 生命周期函数  ==  获取项目总额
  // 生命周期函数  ==  获取已收款
  // 生命周期函数  ==  获取未收款
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    const name = options.name || "total"; //获取跳转页面传递的tab页name名 默认为total
    console.log(name);
    this.setData({
      active: name,
    });

    this.getCheckedTab(this.data.active);//传入初始化加载的那个tab页面的name值，请求数据
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {},

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

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
