let conid = '';//保存传递的合同id
const cloudFunc = require("../../api/index");
const regeneratorRuntime = require("../../utils/runtime"); //ES7 环境
import { getToken, getUserId } from "../../utils/storage";
const { _contractType2Word } = require('../../utils/contract')
// 转换为千分位金额
function getLocaleString(num) {
  return num.toString().split('').reverse().reduce((total, value, index, array) => {
      return ((index % 3) ? value : value + ',') + total
  })
}
Page({

  /**
   * 页面的初始数据
   */
  data: {
    activeNames: [],//折叠面板数据

    contractData: {},//所有的合同详情信息

    lastInvoiceList: {},//显示的最近一条发票数据
    lastReceivableList: {},//显示最近一条已收款数据
    lastPhaseList: {},//显示最近一条阶段信息

    InvoiceList: [],//发票列表
    ReceivableList: [],//收款列表
    PhaseList: [],//阶段列表
    theOneInvoiceList: false,//是否有第一条发票列表数据
    theOneReceivableList: false,//是否有第一条收款列表数据
    theOnePhaseList: false,//是否有第一条阶段列表数据
  },

  onChange(event) {
    this.setData({
      activeNames: event.detail
    });
  },


  // 点击按钮修改合同信息
  handleUpdateContract() {
    console.log(this.data.contractData,'contractDatacontractData')
    wx.navigateTo({
      url: '/pages/changeContract/changeContract?contractData=' + JSON.stringify(this.data.contractData)//跳转到修改合同页面  将详情页面获取的当前项目的数据传递过去
    });
  },

  // 点击每一个阶段详情  修改阶段信息
  changeParseInfo(e) {
    if(e.currentTarget.dataset.fact) {
      // 传递的实际时间有的话 就不能开票和修改阶段信息
      wx.showToast({
        title: '该阶段已完成',
        icon: 'none',
        duration: 1000,
        mask: true,
      });
      return
    }
    const { code, desc, id, time, total, type } = e.currentTarget.dataset
    wx.navigateTo({
      url: `/pages/changeParse/changeParse?code=${code}&id=${id}&time=${time}&total=${total}&type=${type}&desc=${desc}`,
    });
  },

  // 点击按钮添加阶段信息
  addParseInfo(e) {
    const { code } = e.currentTarget.dataset
    wx.navigateTo({
      url: `/pages/addParse/addParse?code=${code}`,
    });
  },

  // 点击按钮  我要开票
  addTicket(e) {
    const PhaseList = this.data.contractData.PhaseList;
    if(!(PhaseList._Items && PhaseList._Items.length > 0)) {
      wx.showToast({
        title: '暂无开票阶段',
        icon: 'none',
        duration: 1000,
        mask: true,
      });
      return
    }
    const { code } = e.currentTarget.dataset;//传递的项目code
    let parseArr = this.data.contractData.PhaseList._Items;//传递的当前阶段的数组
    parseArr = JSON.stringify(parseArr);
    wx.navigateTo({
      url: `/pages/addTicket/addTicket?code=${code}&parseArr=${parseArr}`,
    });
  },

  // 生命周期函数 === 根据合同id 发送请求获取点击合同的详情
  async getContractDetail () {
    //处理时间
    function _transformTime (time) {
      // 2020-03-05T01:53:00
      return time ? time.split("T")[0].replace(/\-/g, ".") : "暂无";
    }

    const that = this;
    try {
      const token = getToken();
      const ContractCode = conid;
      const Option = 0;
      let res = await cloudFunc("getContractDetail", {
        token,
        ContractCode,
        Option
      });
      console.log(res,'合同详情结果OOOOOOOOOOOOOOOOOOOOOOO')
      let result = res.result && JSON.parse(res.result); //转换为JSON
      console.log(result,'JSON  合同详情')
      // // 处理详情数据
      result.ContractAlreadyRec = result.ContractAlreadyRec && getLocaleString(result.ContractAlreadyRec);//已收金额
      result.ContractAmount =  result.ContractAmount && getLocaleString(result.ContractAmount);//总金额
      result.ContractSignTime = result.ContractSignTime && _transformTime(result.ContractSignTime);//创建时间
      result.ContractEndTime = result.ContractEndTime &&_transformTime(result.ContractEndTime);//结束时间 
      result.ContractType = result.ContractType && _contractType2Word(parseInt(result.ContractType));//合同类型 

      // 处理发票记录数据
      result.InvoiceApplyList = result.InvoiceApplyList ? result.InvoiceApplyList : [];
      // // 发票里面的数据
      result.InvoiceApplyList._Items && result.InvoiceApplyList._Items.length > 0 && result.InvoiceApplyList._Items.forEach(item => {
        item.InvoiceApplyAmount = getLocaleString(item.InvoiceApplyAmount)
        item.InvoiceApplyTime = _transformTime(item.InvoiceApplyTime)
        // 设置第一条发票数据
        that.setData({
          // lastInvoiceList: {...result.InvoiceList._Items[result.InvoiceList._Items.length - 1]},
          lastInvoiceList: {...result.InvoiceApplyList._Items[0]},
          theOneInvoiceList: true,
        })
      })

      // 处理已收列表
      result.ReceivableList = result.ReceivableList ? result.ReceivableList : [];
      // 已收里面的数据
      result.ReceivableList._Items && result.ReceivableList._Items.length > 0 && result.ReceivableList._Items.forEach(item => {
        item.RecAmount = getLocaleString(item.RecAmount)
        item.RecTime = _transformTime(item.RecTime)
        // 设置第一条收款数据
        that.setData({
          // lastReceivableList: {...result.ReceivableList._Items[result.ReceivableList._Items.length - 1]},
          lastReceivableList: {...result.ReceivableList._Items[0]},
          theOneReceivableList: true,
        })
      })

      // 处理阶段信息
      result.PhaseList = result.PhaseList ? result.PhaseList : [];
      // 已收里面的数据
      result.PhaseList._Items && result.PhaseList._Items.length > 0 && result.PhaseList._Items.forEach(item => {
        item.PhaseAmount = getLocaleString(item.PhaseAmount)
        item.PlanTime = _transformTime(item.PlanTime)
        // 设置第一条阶段数据
        that.setData({
          // lastPhaseList: {...result.PhaseList._Items[result.PhaseList._Items.length - 1]},
          lastPhaseList: {...result.PhaseList._Items[0]},
          theOnePhaseList: true,
        })
      })
      console.log(result,'resultresultresult')
      that.setData({
        contractData: result,
        InvoiceList: result.InvoiceApplyList._Items && result.InvoiceApplyList._Items.slice(1),//设置发票列表,除去第一条
        ReceivableList: result.ReceivableList._Items && result.ReceivableList._Items.slice(1),//设置收款列表,除去第一条
        PhaseList: result.PhaseList._Items && result.PhaseList._Items.slice(1),//设置阶段列表,除去第一条
      });
      console.log(this.data,'this.datadatadata')
    } catch (error) {
      console.log(error, "错误");
      wx.showToast({
        title: "请求错误",
        icon: "none",
        duration: 1500,
        mask: true,
      });
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    conid = options.conid;//传递的合同id
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
    // 调用生命周期函数获取合同详情
    this.getContractDetail();
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