const cloudFunc = require("../../api/index");
const regeneratorRuntime = require("../../utils/runtime"); //ES7 环境
import { getToken, getUserId } from "../../utils/storage";
const { _projectStatus2Word, _projectLevel2Word } = require('../../utils/project')
// 千分位转换
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
    proid: '',//从上一个页面点击传递的项目code
    proname: '',//项目的名字
    contractList: [],//项目 ==> 合同列表
    lastContractList: {},//显示最近的一条合同数据
    aloneVisit: [],//项目 ==> 拜访记录列表
    lastAloneVisit: {},//显示查询的一条记录
    projectDetail: {},//项目  ==> 详情信息
    visitListPlan: [],//项目  ==>  拜访计划
    lastVisitPlan: {},//显示的查询的一条计划
    theOnecontractList: false,//是否有第一条合同列表显示
    theOnealoneVisit: false,//是否有第一条拜访记录显示
    theOnevisitListPlan: false,//是否有第一条拜访计划显示

    activeNames: []
  },

  onChange(event) {
    this.setData({
      activeNames: event.detail
    });
  },


  // 生命周期函数  -- 获取项目详情的所有信息
  async getProjectDetail () {
    const that = this;
    try {
      const Token = getToken();
      let res = await cloudFunc("getProjectDetail", {
        ProjectCode: that.data.proid, //上一个页面传递的项目id
        Option: 0,
        Token,
      });
      const result = res.result && JSON.parse(res.result); //将数据转换为JSON
      console.log(result, "The item detail datas!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!");
      // 1.计划拜访列表  处理时间戳 转换为正常时间
      result.visitListPlan && result.visitListPlan.length > 0 && result.visitListPlan.forEach((item,index) => {
        item.VisitPlanTime = item.VisitPlanTime ? item.VisitPlanTime.split("T")[0].replace(/\-/g, ".") : "暂无"
        that.setData({
          lastVisitPlan: {...result.visitListPlan[0]},
          theOnevisitListPlan: true,//设置已经有第一条计划了
        })
      });
      // 2.已经拜访列表  处理时间戳 转换为正常时间
      result.aloneVisit && result.aloneVisit.length > 0 && result.aloneVisit.forEach((item) => {
        item.VisitFactTime = item.VisitFactTime ? item.VisitFactTime.split("T")[0].replace(/\-/g, ".") : "暂无"
        item.VisitPlanTime = item.VisitPlanTime ? item.VisitPlanTime.split("T")[0].replace(/\-/g, ".") : "暂无" //时间处理
        that.setData({
          lastAloneVisit: {...result.aloneVisit[0]},
          theOnealoneVisit: true,//设置已经有第一条记录了
        })
      });
      // 3.合同列表时间处理  处理合同总额
      result.contractList && result.contractList.forEach((item) => {
        item.ContractCreateTime = item.ContractCreateTime ? item.ContractCreateTime.split("T")[0].replace(/\-/g, ".") : "暂无"
        item.ContractEndTime = item.ContractEndTime ? item.ContractEndTime.split("T")[0].replace(/\-/g, ".") : "暂无" //时间处理
        item.ContractSignTime = item.ContractSignTime ? item.ContractSignTime.split("T")[0].replace(/\-/g, ".") : "暂无" //时间处理
        item.ContractAlreadyRec = item.ContractAlreadyRec ? getLocaleString(item.ContractAlreadyRec) : 0 //金额处理
        item.ContractAmount = item.ContractAmount ? getLocaleString(item.ContractAmount) : 0 //金额处理
        that.setData({
          lastContractList: {...result.contractList[0]},
          theOnecontractList: true,//设置有第一条合同显示了
        })
      });
      // 4.详情信息处理
      let proDetail = result.projectDetail;
      // 处理总金额
      proDetail && (proDetail.ContractTotal = proDetail.ContractTotal === 0 ? 0 : getLocaleString(proDetail.ContractTotal))
      // 处理已收金额
      proDetail && (proDetail.ReceiveTotal = proDetail.ReceiveTotal === 0 ? 0 : getLocaleString(proDetail.ReceiveTotal))
      // 处理状态
      proDetail && (proDetail.ProjectStatus = _projectStatus2Word(proDetail.ProjectStatus))
      // 处理等级
      proDetail && (proDetail.ProjectPLevel = _projectLevel2Word(proDetail.ProjectPLevel))
      // 重新赋值渲染的数据
      that.setData({
        contractList: result.contractList.slice(1),//项目 ==> 合同列表
        aloneVisit: result.aloneVisit.slice(1),
        projectDetail: result.projectDetail,//项目  ==> 详情信息
        visitListPlan: result.visitListPlan.slice(1),//项目  ==>  拜访计划
      });
      console.log(result,'处理后的数据 展示showshowshowshow')
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

  // 1.点击进入添加计划页面
  handleAddPlan() {
    wx.navigateTo({
      url: '/pages/addVisit/addVisit?proid=' + this.data.proid + '&proname=' + this.data.proname
    });
  },

  // 2.点击进入添加记录页面
  handleAddRecoed() {
    wx.navigateTo({
      url: '/pages/addVisitRecord/addVisitRecord?proid=' + this.data.proid//跳转到添加记录页面 传递当前的项目id
    });
  },

  // 3.点击进入修改项目信息页面
  handleChangeItem() {
    wx.navigateTo({
      url: '/pages/changeItem/changeItem?proid=' + this.data.proid + '&proname=' + this.data.proname
    });
  },

  // 4.点击进入 修改拜访计划页面
  goToChangePlan(e) {
    const { time, content, remark, id } = e.currentTarget.dataset;//解构出传递给修改页面的数据
    wx.navigateTo({
      url: `/pages/changePlan/changePlan?time=${time}&content=${content}&remark=${remark}&id=${id}`,
    });
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 1.获取传递的项目code
    const proid = options.proid;
    const proname = options.proname;
    this.setData({
      proid,
      proname
    });
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
      // 2.调用获取项目详情数据
      this.getProjectDetail();
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

  }
})