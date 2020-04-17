let conid = '';//保存传递的合同id
const cloudFunc = require("../../api/index");
const regeneratorRuntime = require("../../utils/runtime"); //ES7 环境
import { getToken, getUserId } from "../../utils/storage";
Page({

  /**
   * 页面的初始数据
   */
  data: {
      contractData: {},//所有的合同详情信息
  },

  // 点击按钮修改合同信息
  handleUpdateContract() {
    wx.navigateTo({
      url: '/pages/changeContract/changeContract?contractData=' + JSON.stringify(this.data.contractData)//跳转到修改合同页面  将详情页面获取的当前项目的数据传递过去
    });
  },


  // 生命周期函数 === 根据合同id 发送请求获取点击合同的详情
  async getContractDetail () {
    //处理时间
    function _transformTime (time) {
      // 2020-03-05T01:53:00
      return time ? time.split("T")[0].replace(/\-/g, ".") : "暂无"; 
    }
    // 处理价格
    function _transformPrice (price) {
      return price ? price.toLocaleString() + "￥" : "暂无";
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
      // 处理详情数据
      result.ContractAlreadyRec = _transformPrice(result.ContractAlreadyRec);//已收金额
      result.ContractAmount = _transformPrice(result.ContractAmount);//总金额
      result.ContractCreateTime = _transformTime(result.ContractCreateTime);//创建时间
      result.ContractEndTime = _transformTime(result.ContractEndTime);//结束时间
      result.ContractSignTime = _transformTime(result.ContractEndTime);//ContractSignTime
      
      // 处理发票数据
      result.InvoiceList = result.InvoiceList ? result.InvoiceList : "暂无发票";
      // // 发票里面的数据
      result.InvoiceList._Items && result.InvoiceList._Items.length > 0 && result.InvoiceList._Items.forEach(item => {
        item.InvoiceAmount = _transformPrice(item.InvoiceAmount)
        item.InvoiceTime = _transformTime(item.InvoiceTime)
      })

      // 处理已收列表
      result.ReceivableList = result.ReceivableList ? result.ReceivableList : "暂无收款";
      // 已收里面的数据
      result.ReceivableList._Items && result.ReceivableList._Items.length > 0 && result.ReceivableList._Items.forEach(item => {
        item.RecAmount = _transformPrice(item.RecAmount)
        item.RecTime = _transformTime(item.RecTime)
      })

      // 处理阶段信息
      result.PhaseList = result.PhaseList ? result.PhaseList : "暂无阶段";
      // 已收里面的数据
      result.PhaseList._Items && result.PhaseList._Items.length > 0 && result.PhaseList._Items.forEach(item => {
        item.PhaseAmount = _transformPrice(item.PhaseAmount)
        item.PlanTime = _transformTime(item.PlanTime)
      })
      console.log(result,'handle with data')
      that.setData({
        contractData: result
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
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    conid = options.conid;//传递的合同id
    // 调用生命周期函数获取合同详情
    this.getContractDetail();
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