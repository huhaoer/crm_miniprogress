const cloudFunc  = require('../../api/index');
const regeneratorRuntime  = require('../../utils/runtime');//ES7 环境
import { getToken,getUserId } from "../../utils/storage";
Page({
  /**
   * 页面的初始数据
   */
  data: {
    activeNames: "", //手风琴页面默认显示的一条,数组形式
    active: "", //tab页面显示的选项页面 根据传递的name值判断显示哪一个页面
    // totalNameData: [],//项目总金额列表数据
    // willPayNameData: [],//暂未回款金额列表数据
    // waitPayNameData: [],//待回款金额列表数据
    projectNameData: [],//我的项目列表数据
    contractNameData: [],//我的合同列表数据

    disableStyle: 'background:#ccc;color:#bbb',// 禁用样式
    activeStyle: 'background:#108ee9;color:#fff',
    normalStyle: '',// 禁用样式
  },
  // 1.折叠面板方法
  onChangeColl(event) {
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
  handleToItemdetail(e) {
    const proid = e.currentTarget.dataset.proid;//获取当前点击的项目id
    const proname = e.currentTarget.dataset.proname;//获取当前点击的项目名字
    wx.navigateTo({
      url: '/pages/itemDetail/itemDetail?proid=' + proid + '&proname=' + proname
    });
  },
  // 5.点击按钮添加项目
  addItem() {
    wx.navigateTo({
      url: '/pages/addItem/addItem'
    });
  },
  // 6.点击跳转到合同详情
  handleToContractdetail(e) {
    const conid = e.currentTarget.dataset.conid;//点击每个合同获取的合同id
    // 点击每一个合同跳转到合同详情
    wx.navigateTo({
      url: '/pages/contractDetail/contractDetail?conid=' + conid 
    });
  },
  // 7.点击按钮添加合同
  addContract() {
    console.log("添加合同")
    wx.navigateTo({
      url: '/pages/addContract/addContract'
    });
  },

  // 6.switch case选择当前tab选项获取数据
  getCheckedTab(tabName) {
    // 数据请求
    switch (tabName) {
      // case 'total':
      //   // 请求total数据
      //   break;
      // case 'hasPay':
      //   // 请求willPay数据
      //   break;
      // case 'noPay':
      //   // 请求waitPay数据
      //   break;
      case 'project':
        // 请求project数据
        this.getOwnProjectList();
        break;
      case 'contract':
        // 请求contract数据
        this.getOwnContractList();
        break;
    }
  },
  // 7.点击项目添加进收藏 主页显示
  async addCollect(item) {
    const Token = getToken();
    const UserId = getUserId();//缓存中读取用户id
    console.log(item,'收藏了')
    const ProjectCode = item.currentTarget.dataset.item.ProjectCode;//点击按钮时 传递的项目id
    const AttentionId = item.currentTarget.dataset.item.AttentionId;//点击按钮时 传递的收藏项目AttentionId
    const isCollected = item.currentTarget.dataset.item.AttentionId !== 0;//不为0就是已经收藏    判断是否收藏
    console.log(ProjectCode,isCollected)
    // 已经收藏了 ****
    if(isCollected) {
      try {
        let res = await cloudFunc('deleteAttention',{
          Token,
          AttentionId
        })
        console.log(res,'取消收藏======================')
        if(res.result === "1") {//取消收藏成功
          this.getOwnProjectList();
          wx.showToast({
            title: '取消收藏',
            icon: 'none',
            duration: 1000,
            mask: true,
          });
        }
        console.log(res,'取消收藏')
      } catch (error) {
        console.log(error,'错误')
        wx.showToast({
          title: '请求错误',
          icon: 'none',
          duration: 1500,
          mask: true,
        });
      }
    }else {//没有收藏
      try {
        let res = await cloudFunc('addAttentionProject',{
          Token,
          UserId,
          ProjectCode
        })
        console.log(res,'原始结果')
        if(res.result.toString().length > 0) {//添加完成返回的不是对象
          this.getOwnProjectList();
          wx.showToast({
            title: '收藏成功',
            icon: 'none',
            duration: 1500,
            mask: true,
          });
        }
      } catch (error) {
        console.log(error,'错误')
        wx.showToast({
          title: '请求错误',
          icon: 'none',
          duration: 1500,
          mask: true,
        });
      }
    }
    
  },
  // 生命周期函数  ==  获取我的项目
  async getOwnProjectList() {
    try {
      const that = this;
      const Token = getToken();
      const UserId = getUserId();//缓存中读取用户id
      const Option = 0;//Option为0获取全部项目列表信息  加上attention
      let res = await cloudFunc('getOwnProjectList',{
        Token,
        UserId,
        Option
      })
      console.log(res,'转换前的结果','xxxxxxxxxxxxxxx')
      let result = res.result && JSON.parse(res.result);//转换为JSON
      // console.log(result,'转换后的结果','xxxxxxxxxxxxxxxxx')
      const newRes = result.filter(item => item.ProjectCode);//处理过滤有项目id的数据
      // console.log(newRes,'...')
      newRes.length > 0 && newRes.forEach(item => {
        item.ProjectCreateTime = item.ProjectCreateTime && item.ProjectCreateTime.split('T')[0].replace(/\-/g,".")
        item.ProjectCreateTime = item.ProjectCreateTime && item.ProjectCreateTime.split('T')[0].replace(/\-/g,".")
      })
      // console.log(newRes,'...？？？')
      that.setData({
        projectNameData: newRes,//设置返回渲染的数据
      })
    } catch (error) {
      console.log(error,'错误')
      wx.showToast({
        title: '请求错误',
        icon: 'none',
        duration: 1500,
        mask: true,
      });
    }
  },

  // 生命周期函数  ==  获取我的合同
  async getOwnContractList() {
    try {
      const that = this;
      const token = getToken();
      const Option = 0;
      const skipNum = 0;
      const sizeNum = 100;//默认为翻页查询100条合同  合同数量不可能为100
      let res = await cloudFunc('getOwnContractList',{
        token,
        Option,
        skipNum,
        sizeNum
      })
      console.log(res,'show my contract list string','String????????????????')
      let result = res.result && JSON.parse(res.result);//转换为JSON
      // 处理时间 
      result._Items.length > 0 && result._Items.forEach(item => {
        item.ContractCreateTime = item.ContractCreateTime && item.ContractCreateTime.split('T')[0].replace(/\-/g,".");//处理创建时间
        item.ContractEndTime = item.ContractEndTime && item.ContractEndTime.split('T')[0].replace(/\-/g,".");//处理创建时间
        item.ContractAmount = item.ContractAmount && (+item.ContractAmount).toLocaleString();//处理总金额
        item.ContractAlreadyRec = item.ContractAlreadyRec && (+item.ContractAlreadyRec).toLocaleString();//处理已收金额

        // 处理发票 JSON
        item.InvoiceList = item.InvoiceList && JSON.parse(item.InvoiceList);
        // 处理阶段 JSON
        item.phaseList = item.phaseList && JSON.parse(item.phaseList);
        // 处理收款 JSON
        item.ReceivableList = item.ReceivableList && JSON.parse(item.ReceivableList);
      })
      console.log(result,'show data with handle')
      that.setData({
        contractNameData: result,//设置返回渲染的数据
      })
    } catch (error) {
      console.log(error,'错误')
      wx.showToast({
        title: '请求错误',
        icon: 'none',
        duration: 1500,
        mask: true,
      });
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    const name = options.name || "project"; //获取跳转页面传递的tab页name名 默认为project
    console.log(name);
    this.setData({
      active: name,
    });
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    this.getCheckedTab(this.data.active);//传入初始化加载的那个tab页面的name值，请求数据
  },


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
