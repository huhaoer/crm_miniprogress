const cloudFunc  = require('../../api/index')
const regeneratorRuntime  = require('../../utils/runtime')
import { getToken } from "../../utils/storage";
let proid = '';
let proname = '';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    projectDetail: {},//项目详情
    connectName: '',//联系人的名字
    connectTel: '',//联系人的电话
    connectDuty: '',//联系人的职务
  },

  // 联系人输入监听
  projectConnameInp(e) {
    const connectName = e.detail;//改变当前输入的联系人
    this.setData({
      connectName,
    })
  },

  // 联系人电话输入监听
  projectContelInp(e) {
    const connectTel = e.detail;//改变当前输入的联系人
    this.setData({
      connectTel,
    })
  },

  // 联系人职务输入监听
  projectCondutyInp(e) {
    const connectDuty = e.detail;//改变当前输入的联系人
    this.setData({
      connectDuty,
    })
  },


  // 点击按钮提交表单信息
  handleSubmit() {
    // 判断修改后的信息 校验
    if(!this.data.connectName) {
      wx.showToast({
        title: '联系人不能为空',
        icon: 'none',
        duration: 1000,
        mask: true
      });
      return
    }
    if(!this.data.connectTel) {
      wx.showToast({
        title: '电话不能为空',
        icon: 'none',
        duration: 1000,
        mask: true
      });
      return
    }
    if(!this.data.connectDuty) {
      wx.showToast({
        title: '职务不能为空',
        icon: 'none',
        duration: 1000,
        mask: true
      });
      return
    }

    console.log(this.data.connectName)
    console.log(this.data.connectTel)
    console.log(this.data.connectDuty)
    this.updateItem();//调用更新项目信息接口
  },

  // 点击按钮修改项目的信息
  async updateItem() {
    const that = this;
    const Token = getToken();//获取token
    try {
      let res = await cloudFunc('updateProjectContact',{
        Token,
        ProjectCode: proid,
        ContactName: that.data.connectName,
        ContactTel: that.data.connectTel,
        ContactDuty: that.data.connectDuty
      })
      console.log(res,'///////////////////////////////////////////')
      if(res.result === '1') {//返回1 修改成功
        wx.showToast({
          title: '更新成功',
          icon: 'success',
          duration: 1000,
          mask: true
        });
      }
      // 返回上一页
      setTimeout(_ => {
        wx.navigateBack();
      },1000)
    } catch (error) {
      console.log(error,'失败原因')
      wx.showToast({
        title: '更新失败',
        icon: 'none',
        duration: 1000,
        mask: true
      });
    }
  },

  // 根据id获取项目的所有信息
  async getProjectDetail() {
    const that = this;
    try {
      const Token = getToken();
      let res = await cloudFunc("getProjectDetail", {
        ProjectCode: proid, //上一个页面传递的项目id
        Option: 0,
        Token,
      });
      const result = res.result && JSON.parse(res.result); //将数据转换为JSON
      // ...详情信息处理
      let proDetail = result.projectDetail;
      proDetail && (proDetail.ProjectCreateTime = proDetail.ProjectCreateTime ? proDetail.ProjectCreateTime.split("T")[0].replace(/\-/g, ".") : "暂无")
      console.log(result.projectDetail,';;;;;;;;;;;;;;;;')
      that.setData({
        projectDetail: result.projectDetail,//项目  ==> 详情信息
        connectName: result.projectDetail.ContactName,
        connectTel: result.projectDetail.ContactTel,
        connectDuty: result.projectDetail.ContactDuty,
      });
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
    proid = options.proid;
    proname = options.proname;

    this.getProjectDetail()
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