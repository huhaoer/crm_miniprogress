let proid = ""; //项目id
const cloudFunc = require("../../api/index");
import parseTime from "../../utils/parseTime";
const regeneratorRuntime = require("../../utils/runtime"); //ES7 环境
import { getToken, getUserId } from "../../utils/storage";
Page({
  /**
   * 页面的初始数据
   */
  data: {
    topDetail: {}, //详情页面渲染顶部信息是通过上个页面点击进来时传递的数据渲染
    visitRecordList: [], //历史拜访记录列表
    visitListPlan: [], //计划拜访列表
    aloneVisit: [], //已经拜访列表
    visitid: null, //点击进来的那一条计划
  },

  // 1.点击跳转到addVisitRecord
  gotoAddRecord() {
    wx.navigateTo({
      url: "/pages/addVisitRecord/addVisitRecord?proid=" + proid,
    });
  },
  // 2.点击填写计划 跳转到addVisitRecord  自动填充当时的内容
  gotoAddPlan(e) {
    console.log(e, "sakdsidjasoibn ");
    const plancontent = e.currentTarget.dataset.plancontent; //计划的内容
    const planremark = e.currentTarget.dataset.planremark; //计划的备注
    const plantime = e.currentTarget.dataset.plantime; //计划的时间
    const visitid = e.currentTarget.dataset.visitid; //拜访的id
    const planData = {
      plancontent,
      planremark,
      plantime,
      visitid,
    };
    wx.navigateTo({
      url:
        "/pages/addVisitRecord/addVisitRecord?proid=" +
        proid +
        "&planData=" +
        JSON.stringify(planData), //传递数据到 要提交计划
    });
  },
  // 3.生命周期  ===  请求下面拜访记录列表数据
  async getVisitList() {
    const that = this;
    try {
      const Token = getToken();
      let res = await cloudFunc("getProjectDetail", {
        ProjectCode: proid, //上一个页面传递的项目id
        Option: 1,
        Token,
      });
      const result = JSON.parse(res.result); //将数据转换为JSON
      console.log(result, "!!!!!!!!!!");
      // 计划拜访列表  处理时间戳 转换为正常时间
      result.visitListPlan.forEach((item) => {
        item.VisitPlanTime =
          item.VisitPlanTime &&
          item.VisitPlanTime.split("T")[0].replace(/\-/g, "."); //时间处理
      });
      // 已经拜访列表  处理时间戳 转换为正常时间
      result.aloneVisit.forEach((item) => {
        item.VisitFactTime =
          item.VisitFactTime &&
          item.VisitFactTime.split("T")[0].replace(/\-/g, "."); //时间处理
        item.VisitPlanTime =
          item.VisitPlanTime &&
          item.VisitPlanTime.split("T")[0].replace(/\-/g, "."); //时间处理
      });
      // 重新赋值渲染的数据
      console.log(
        result.visitListPlan,
        result.aloneVisit,
        "处理过后的数据  时间"
      );
      that.setData({
        visitListPlan: result.visitListPlan,
        aloneVisit: result.aloneVisit,
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
    console.log(options);
    proid = options.proid; //通过跳转赋值
    const translateDetail = JSON.parse(options.detail); //将传递的数据JSON化
    const visitid = options.visitid; //获取上一页传递的visitid 提醒的那一条计划
    this.setData({
      topDetail: translateDetail,
      visitid: visitid,
    });
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {},

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.getVisitList(); //调用函数请求列表参数
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {},

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {},
});
