const cloudFunc  = require('../../api/index')
const regeneratorRuntime  = require('../../utils/runtime')
import { getToken,getUserId } from "../../utils/storage";
const { _projectStatus, _projectStatus2Word, _projectLevel, _projectLevel2Word } = require('../../utils/project')
let proid = '';
let proname = '';
let CustId = '';//客户id
Page({

  /**
   * 页面的初始数据
   */
  data: {
    projectDetail: {},//项目详情

    ProjectName: '',//项目名

    ProjectDescribe: '',//项目描述

    ProjectRemark: '',//项目备注

    ProjectPLevel: '',//项目P等级  显示的名称
    ProjectPLevelId: '',//p等级 对应的id值
    is_show_pLevel: false,//是否显示选择p等级 菜单
    ProjectPLevelArr: [
      {
        name: 'P0',
        id: 0
      },
      {
        name: 'P1',
        id: 1
      },
      {
        name: 'P2',
        id: 2
      },
      {
        name: 'P3',
        id: 3
      },
      {
        name: 'P4',
        id: 4
      },
      {
        name: 'P5',
        id: 5
      },
    ],//p等级的原始数据
    ProjectPLevelShowArr: [],//显示出来的P等级

    ProjectStatus: '',//项目状态 显示的名称
    ProjectStatusId: '',//项目的状态对应的 id值
    is_show_status: false,//是否显示 展开状态选择栏
    ProjectStatusArr: [
      {
        name: '刚开始',
        id: 0
      },
      {
        name: '进行中',
        id: 1
      },
      {
        name: '已完成',
        id: 2
      }
    ],//状态的原始数据
    ProjectStatusShowArr: [],//显示出来的状态 列表

    CustomerName: '',//客户名称
    
    ContactName: '',//联系人名称
    ContactTel: '',//联系人电话
    ContactDuty: '',//联系人职务
  },

  // =============================项目名输入=====================
  ProjectNameInp(e) {
    const ProjectName = e.detail;
    this.setData({
      ProjectName
    })
  },
  // ===========================项目描述输入========================
  ProjectDescribeInp(e) {
    const ProjectDescribe = e.detail;
    this.setData({
      ProjectDescribe
    })
  },
  // ==========================项目备注输入==============================
  ProjectRemarkInp(e) { 
    const ProjectRemark = e.detail;
    this.setData({
      ProjectRemark
    })
  },

  // ===========================p等级的选择==============================
  onPLevel() {
    const ProjectPLevelShowArr = _projectLevel.map(item => item.name)
    this.setData({
      is_show_pLevel: true,
      ProjectPLevelShowArr
    })
  },
  cancelPLevel() {
    this.setData({
      is_show_pLevel: false
    })
  },
  confirmPLevel(e) {
    const { value, index } = e.detail;
    const ProjectPLevelId = _projectLevel[index].id;
    this.setData({
      ProjectPLevel: value,
      ProjectPLevelId,
      is_show_pLevel: false
    })
    console.log(value,ProjectPLevelId,'等级')
  },

  // ==============================项目状态选择===============================
  onStatus() {
    const ProjectStatusShowArr = _projectStatus.map(item => item.name);
    this.setData({
      ProjectStatusShowArr,
      is_show_status: true
    })
  },
  cancelStatus() {
    this.setData({
      is_show_status: false
    })
  },
  confirmStatus(e) {
    console.log(e,'当前点击的')
    const { value, index } = e.detail;
    const ProjectStatusId = _projectStatus[index].id;
    this.setData({
      ProjectStatus: value,
      ProjectStatusId,
      is_show_status: false
    })
    console.log(value,ProjectStatusId,'状态')
  },

  // ============================联系人姓名输入===================================
    // 联系人输入监听
    projectConnameInp(e) {
      const ContactName = e.detail;//改变当前输入的联系人
      this.setData({
        ContactName,
      })
    },
  
  // ===========================联系人电话输入====================================
    // 联系人电话输入监听
    projectContelInp(e) {
      const ContactTel = e.detail;//改变当前输入的联系人
      this.setData({
        ContactTel,
      })
    },
  // ========================联系人 职务输入=====================================
    // 联系人职务输入监听
    projectCondutyInp(e) {
      const ContactDuty = e.detail;//改变当前输入的联系人
      this.setData({
        ContactDuty,
      })
    },

  // ============================点击按钮提交表单信息============================
  handleSubmit() {
    // 判断修改后的信息 校验
    if(!this.data.ProjectName) {
      wx.showToast({
        title: '项目名称不能为空',
        icon: 'none',
        duration: 1000,
        mask: true
      });
      return
    }
    if(!this.data.ProjectDescribe) {
      wx.showToast({
        title: '项目描述不能为空',
        icon: 'none',
        duration: 1000,
        mask: true
      });
      return
    }
    if(!this.data.ProjectPLevel) {
      wx.showToast({
        title: '项目等级不能为空',
        icon: 'none',
        duration: 1000,
        mask: true
      });
      return
    }
    if(!this.data.ProjectStatus) {
      wx.showToast({
        title: '项目状态不能为空',
        icon: 'none',
        duration: 1000,
        mask: true
      });
      return
    }
    const sendData = {
      ProjectCode: proid,
      ProjectName: this.data.ProjectName,
      ProjectDescribe: this.data.ProjectDescribe,
      ProjectRemark: this.data.ProjectRemark,
      ProjectPLevel: this.data.ProjectPLevelId,
      ProjectStatus: this.data.ProjectStatusId,
      ContactName: this.data.ContactName,
      ContactTel: this.data.ContactTel,
      ContactDuty: this.data.ContactDuty,
      CustId,
    }
    // 调用更新项目函数  传入数据
    this.updateItem(sendData);
  },

  // 点击按钮修改项目的信息
  async updateItem(data) {
    const Token = getToken();//获取token
    const UserId = getUserId();//获取userId
    try {
      let res = await cloudFunc('updateProjectContact',{
        Token,
        UserId,
        ...data
      })
      if(res.result === '1') {//返回1 修改成功
        wx.showToast({
          title: '更新成功',
          icon: 'success',
          duration: 1000,
          mask: true
        });
      }
      // // 返回上一页
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
      console.log(result,'获取的项目详情信息=================')
      // ...详情信息处理
      const detail = result.projectDetail;
      // 设置客户id
      CustId = detail.CustId

      that.setData({
        ProjectName: detail.ProjectName,//获取数据后 设置数据给data渲染
        ProjectDescribe: detail.ProjectDescribe,
        ProjectRemark: detail.ProjectRemark,
        ProjectPLevel: _projectLevel2Word(parseInt(detail.ProjectPLevel)),
        ProjectPLevelId: detail.ProjectPLevel,
        ProjectStatus: _projectStatus2Word(detail.ProjectStatus),
        ProjectStatusId: detail.ProjectStatus,
        ContactName: detail.ContactName,
        ContactTel: detail.ContactTel,
        ContactDuty: detail.ContactDuty,
        CustomerName: detail.CustomerName//客户名
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