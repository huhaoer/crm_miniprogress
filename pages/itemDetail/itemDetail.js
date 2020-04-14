const cloudFunc = require("../../api/index");
const regeneratorRuntime = require("../../utils/runtime"); //ES7 环境
import { getToken, getUserId } from "../../utils/storage";
Page({

  /**
   * 页面的初始数据
   */
  data: {
    proid: '',//从上一个页面点击传递的项目code
    proname: '',//项目的名字
    contractList: [],//项目 ==> 合同列表
    aloneVisit: [],//项目 ==> 拜访记录列表
    projectDetail: {},//项目  ==> 详情信息
    visitListPlan: [],//项目  ==>  拜访计划
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
      console.log(result, "The item detail datas!!!!!!!!!!");
      // 1.计划拜访列表  处理时间戳 转换为正常时间
      result.visitListPlan && result.visitListPlan.forEach((item) => {
        item.VisitPlanTime = item.VisitPlanTime ? item.VisitPlanTime.split("T")[0].replace(/\-/g, ".") : "暂无"
      });
      // 2.已经拜访列表  处理时间戳 转换为正常时间
      result.aloneVisit && result.aloneVisit.forEach((item) => {
        item.VisitFactTime = item.VisitFactTime ? item.VisitFactTime.split("T")[0].replace(/\-/g, ".") : "暂无"
        item.VisitPlanTime = item.VisitPlanTime ? item.VisitPlanTime.split("T")[0].replace(/\-/g, ".") : "暂无" //时间处理
      });
      // 3.合同列表时间处理  处理合同总额
      result.contractList && result.contractList.forEach((item) => {
        item.ContractCreateTime = item.ContractCreateTime ? item.ContractCreateTime.split("T")[0].replace(/\-/g, ".") : "暂无"
        item.ContractEndTime = item.ContractEndTime ? item.ContractEndTime.split("T")[0].replace(/\-/g, ".") : "暂无" //时间处理
        item.ContractSignTime = item.ContractSignTime ? item.ContractSignTime.split("T")[0].replace(/\-/g, ".") : "暂无" //时间处理
        item.ContractAlreadyRec = item.ContractAlreadyRec ? item.ContractAlreadyRec.toLocaleString() : "暂无" //金额处理
        item.ContractAmount = item.ContractAmount ? item.ContractAmount.toLocaleString() : "暂无" //金额处理
      });
      // 4.详情信息处理
      let proDetail = result.projectDetail;
      proDetail && (proDetail.ProjectCreateTime = proDetail.ProjectCreateTime ? proDetail.ProjectCreateTime.split("T")[0].replace(/\-/g, ".") : "暂无")
      // 重新赋值渲染的数据
      console.log(
        result,
        "处理过后的数据  时间"
      );
      that.setData({
        contractList: result.contractList,//项目 ==> 合同列表
        aloneVisit: result.aloneVisit,//项目 ==> 拜访记录列表
        projectDetail: result.projectDetail,//项目  ==> 详情信息
        visitListPlan: result.visitListPlan,//项目  ==>  拜访计划
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