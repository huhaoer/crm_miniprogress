import parseTime from '../../utils/parseTime';
const cloudFunc  = require('../../api/index');
const regeneratorRuntime  = require('../../utils/runtime');
import { getToken,getUserId } from "../../utils/storage";
Page({

  /**
   * 页面的初始数据
   */
  data: {
    currentDate: new Date().getTime(),
    minDate: new Date().getTime(),
    formatter(type, value) {
      if (type === 'year') {
        return `${value}年`;
      } else if (type === 'month') {
        return `${value}月`;
      }
      return value;
    },//时间选择器组件 时间格式化
    project_item_show: false,//是否展示项目选择框
    nowProjectValue: '',//当前展示的选中项目的值
    nowProjectCode: '',//当前动态选择项目的code
    projectList: [],//点击后展开的项目列表
    nowPlanContent: '',//当前计划内容填写的值
    nowPlanContentErr: '',//当前计划内容错误检验提醒
    nowPlanRemark: '',//当前计划备注填写的值
    nowPlanRemarkErr: '',//当前计划备注错误检验提醒
    nowPlanTime: '',//当前计划时间填写的值
    time_show: false,//是否展开时间选择
    proid: '',//通过项目详情页面跳转并传递的proid参数
    proname: '',//通过项目详情页面跳转并传递的proname参数
  },
  // 1.点击项目分类 展开当前项目选项框
  async showChooseProject() {
    // 判断如果有proid或者是proname 则禁用选择项目 因为是从项目详情跳转的 项目名字固定
    if(this.data.proid || this.data.proname) {
      return
    }
    this.setData({
      project_item_show: true
    })
    try {
      let res = await this.getOwnProjectList();
      console.log(res,'项目列表')
      const list = JSON.parse(res.result);
      const pList = list.map(item => {
        return {
          name: item.ProjectName,
          code: item.ProjectCode
        } 
      })
      this.setData({
        projectList: pList
      })
    } catch (error) {
      console.log(error)
      wx.showToast({
        title: '查询失败',
        icon: 'none',
        duration: 1000,
        mask: true
      });
    } 
  },
  //2.选择某个具体的项目值
  selectNowProject(item) {
    console.log(item,'当前选择项目')
    const nowProjectValue = item.detail.name;//获取当前选择的项目值
    const nowProjectCode = item.detail.code;//获取当前选择的项目值的code值
    this.setData({
      nowProjectValue,
      nowProjectCode
    })
  },
  // 3.点击取消按钮之后 隐藏当前项目选择
  quitNowProject() {
    this.setData({
      project_item_show: false
    })
  },
  // 4.填写当前计划时监控的数据
  planContentInput(e) {
    const nowPlanContent = e.detail;//当前填写的计划内容的值
    this.setData({
      nowPlanContent
    })
  },
  // 5.填写当前计划备注监控的数据
  planRemarkInput(e) {
    const nowPlanRemark = e.detail;
    this.setData({
      nowPlanRemark
    })
  },

  // 6.点击展开选择时间
  showChooseTime() {
    this.setData({
      time_show: true
    })
  },
  // 7.确定选择时间
  confirmChooseTime(time) {
    const t = parseTime(time.detail/1000);//选择的时间
    console.log(parseTime(time.detail/1000),'选中时间值')
    this.setData({
      nowPlanTime:t,//当前选择时间显示
      time_show: false,//隐藏时间选择框
    })
  },
  // 8.取消选择时间
  cancelChooseTime() {
    console.log("取消了")
    this.setData({
      time_show: false,//隐藏时间选择框
    })
  },
  // 9.提交表单 创建拜访
  handleSubmit() {
    // 校验计划内容属性值正确性
    if(this.data.nowPlanContent.trim() == "") {//计划内容为空
      this.setData({
        nowPlanContentErr: "计划内容错误，请检验"
      })
      return
    }else {
      this.setData({
        nowPlanContentErr: ""
      })
    }
    // 校验计划备注属性值正确性
    if(this.data.nowPlanRemark.trim() == "") {//计划内容为空
      this.setData({
        nowPlanRemarkErr: "计划备注错误，请检验"
      })
      return
    }else {
      this.setData({
        nowPlanRemarkErr: ""
      })
    }
    // 校验计划时间值正确性
    if(this.data.nowPlanTime == "") {
      wx.showToast({
        title: '选择时间',
        icon: 'none',
        duration: 1000,
        mask: true
      })
      return
    }
    // 校验项目值正确性
    if(this.data.nowProjectValue == "") {
      wx.showToast({
        title: '选择项目',
        icon: 'none',
        duration: 1000,
        mask: true
      })
      return
    }

    // 全部校验成功 调用接口
    this.addVisit();
  },
  // 10.请求接口  创建一个拜访计划
  async addVisit() {
    const that = this;
    const Token = getToken();
    //获取结果
    try {
      let res = await cloudFunc('addVisit',{
        proid: that.data.nowProjectCode,//项目code
        remark_mes: that.data.nowPlanRemark,//备注信息
        Token,
        VisitPlanTime: that.data.nowPlanTime,//选择时间
        VisitPlanContent: that.data.nowPlanContent,//内容信息
      })
      console.log(res,'这是添加拜访结果00000000000000000000000')
      if(JSON.parse(res.result).toString() == "[object Object]") {//成功添加记录时 返回当前添加的对象
        wx.showToast({
          title: '添加成功',
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
      console.log(err,'失败原因')
      wx.showToast({
        title: '添加失败',
        icon: 'none',
        duration: 1000,
        mask: true
      });
    }
  },
  // 11.查询该销售的所有项目列表  用于选择
  async getOwnProjectList() {
    const Token = getToken();
    const UserId = getUserId();//缓存中读取用户id
    const Option = 1;//Option为0获取全部数据
    try {
      let res = await cloudFunc('getOwnProjectList',{
        Token,
        UserId,
        Option
      })
      return res;
    } catch (error) {
      console.log(error)
      wx.showToast({
        title: '查询失败',
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
    console.log(options,'项目详情页面添加  计划+++++++')
    const proid = options.proid && options.proid;//传递的项目code
    const proname = options.proname && options.proname;//传递的项目名字
    // 如果有proid或者是proname说明是项目详情传递的 此时项目不能自己选是固定的
    if(proid || proname) {
      this.setData({
        proid,
        proname,//上面两个是给初始化data赋值
        nowProjectValue: proname,
        nowProjectCode: proid//下面是给显示的内容赋值
      })
    }
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

})