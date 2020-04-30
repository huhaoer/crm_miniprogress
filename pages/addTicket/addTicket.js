const cloudFunc = require("../../api/index");
const regeneratorRuntime = require("../../utils/runtime"); //ES7 环境
import { getToken } from "../../utils/storage";
Page({

  /**
   * 页面的初始数据
   */
  data: {
      ticket_parse_show: '',//显示的开票阶段名称
      ticket_parse_id: '',//开票名称对应的阶段id
      ticket_parse_Arr: [],//开票阶段 原始数据
      ticket_parse_showArr: [],//用于显示的数组
      is_show_ticket: false,//是否显示开票菜单

      ticket_money: '',//开票金额

      code: '',//传递过来的合同code

  },

  // addInvoiceApply(String token, 
  //  String ContractCode, 
  //  String PhaseId, 
  //  double InvoiceApplyAmount

  // =====================开票阶段选择======================
  onTicket() {
    this.setData({
      is_show_ticket: true
    })
  },
  cancelTicket() {
    this.setData({
      is_show_ticket: false
    })
  },
  confirmTicket(e) {
    const { value, index } = e.detail;
    const ticket_parse_id = this.data.ticket_parse_Arr[index].parseId;//获取点击的阶段名称对应的id
    const ticket_money = this.data.ticket_parse_Arr[index].parseMoney;//获取点击阶段对应的金额
    this.setData({
      ticket_parse_show: value,//设置选择的显示值
      ticket_parse_id,//设置阶段id
      ticket_money,//设置阶段金额
      is_show_ticket: false
    })
  },

  // ==========================开票金额输入=================
  onMoneyInp(e) {
    const ticket_money = e.detail;//输入的金额
    this.setData({
      ticket_money
    })
  },
  // =======================开票按钮=====================
  handleSubmit() {
    if(!this.data.ticket_parse_show) {
      wx.showToast({
        title: '请选择阶段',
        icon: 'none',
        duration: 1000,
        mask: true,
      });
      return
    }

    // 调用开票申请
    this.addInvoiceApply();
  },

  // ========================开票函数 api========================
  async addInvoiceApply() {
    const that = this;
    try {
      const token = getToken();//获取Token
      const ContractCode = that.data.code;//合同code
      const PhaseId = that.data.ticket_parse_id;//阶段id
      const InvoiceApplyAmount = parseInt(that.data.ticket_money);//开票金额
      let res = await cloudFunc("addInvoiceApply", {
        token,
        ContractCode,
        PhaseId,
        InvoiceApplyAmount
      });
      console.log(res,'开票结果  哈哈哈哈')
      if(res.result.toString().length > 0) {
        wx.showToast({
          title: '开票成功',
          icon: 'success',
          duration: 1000,
          mask: true
        });
        // 返回上一页
        setTimeout(_ => {
          wx.navigateBack();
        },1000)
      }
    } catch (error) {
      console.log(error)
      wx.showToast({
        title: '开票失败',
        icon: 'none',
        duration: 1000,
        mask: true
      });
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let { code, parseArr } = options;//从上一个页面 传入的合同code  和阶段数组
    parseArr = JSON.parse(parseArr);
    // 生成一个 原始数据的数组
    const ticket_parse_Arr = parseArr.length > 0 && parseArr.map(item => {//原始数据数组
      return {
        parseName: item.PhaseDescribe,//阶段名称
        parseId: item.PhaseId,//阶段名称对应的id,
        parseMoney: item.PhaseAmount.replace(/\,/g,'').replace(/\￥/g,'')//阶段对应的金额  去除toLocaleString显示
      }
    })

    // 生成一个选择的显示数组
    const ticket_parse_showArr = parseArr.length > 0 && parseArr.map(item => item.PhaseDescribe)//显示数组
    this.setData({
      code,
      ticket_parse_Arr,
      ticket_parse_showArr
    })
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