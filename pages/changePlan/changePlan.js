import parseTime from '../../utils/parseTime'
const cloudFunc  = require('../../api/index')
const regeneratorRuntime  = require('../../utils/runtime')
import { getToken } from "../../utils/storage";
Page({

  /**
   * 页面的初始数据
   */
  data: {
      currentDate: new Date().getTime(),
      minDate: new Date().getTime(),
      formatter(type, value) {
        if (type === "year") {
          return `${value}年`;
        } else if (type === "month") {
          return `${value}月`;
        }
        return value;
      },

      VisitId: '',//当前计划的id
      VisitPlanContent: '',//计划内容
      VisitRemark: '',//计划备注
      
      VisitPlanTime: '',//当前计划的时间
      isShowPicker: false,//是否展示 时间选择器
  },


  // =========================计划备注 输入事件====================
  onVisitRemarkInp(e) {
    const VisitRemark = e.detail;
    this.setData({
      VisitRemark
    })
  },

  // ========================计划内容 输入事件======================
  onVisitPlanContentInp(e) {
    const VisitPlanContent = e.detail;
    this.setData({
      VisitPlanContent
    })
  },
  // =======================点击 显示隐藏 时间选择器====================
  onChangeShowPicker() {
    this.setData({
      isShowPicker: true
    })
  },
  onCancelShowPicker() {
    this.setData({
      isShowPicker: false
    })
  },
  onConfirmShowPicker(e) {
    let time = e.detail;
    const VisitPlanTime = parseTime(time /  1000);//处理时间
    this.setData({
      VisitPlanTime,
      isShowPicker: false
    })
  },

  // ==========================点击按钮提交修改计划申请======================
  handleSubmit() {
    const data = {
      VisitId: this.data.VisitId,//当前计划的id
      VisitPlanContent: this.data.VisitPlanContent,//计划内容
      VisitRemark: this.data.VisitRemark,//计划备注
      VisitPlanTime: this.data.VisitPlanTime,//当前计划的时间
    }
    // 数据非空校验
    if(!this.data.VisitPlanContent || !this.data.VisitRemark || !this.data.VisitPlanTime) {
      wx.showToast({
        title: '计划信息错误',
        icon: 'none',
        duration: 1000,
        mask: true,
      });
      return
    }
    this.changePlan(data);
  },

  // 修改计划的接口
  async changePlan(data) {
    const that = this;
    try {
      const Token = getToken();//获取Token
      let res = await cloudFunc("updateVisit", {
        Token,
        ...data,
        VisitFactContent: '',
        VisitFactTime: '',
      });
      if(res.result === '1') {
        wx.showToast({
          title: '更新成功',
          icon: 'success',
          duration: 1000,
          mask: true,
        });
        // 返回上一页
        setTimeout(_ => {
          wx.navigateBack();
        },1000)
      }

    } catch (error) {
      wx.showToast({
        title: '更新失败',
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
    const { time, remark, content, id } = options;//解构传递的数据
    this.setData({
      VisitId: id,
      VisitPlanTime: time,
      VisitPlanContent: content,
      VisitRemark: remark,
    })
        /**
     *   const Token = event.Token;
        const VisitId = event.VisitId;
        const VisitPlanTime = event.VisitPlanTime;
        const VisitPlanContent = event.VisitPlanContent;
        const VisitRemark = event.VisitRemark;
        const VisitFactTime = event.VisitFactTime;
        const VisitFactContent = event.VisitFactContent;
     */
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