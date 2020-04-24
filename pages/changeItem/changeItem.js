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

    ProjectName: '',//项目名

    ProjectDescribe: '',//项目描述

    ProjectType: '',//项目类型
    ProjectTypeId: '',//项目类型对应的id
    is_show_type: false,//是否显示项目分类菜单
    ProjectTypeArr: [
      {
        name: '类型一',
        id: 1
      },
      {
        name: '类型二',
        id: 2
      },
      {
        name: '类型三',
        id: 3
      },
      {
        name: '类型四',
        id: 4
      },
    ],//类型数据的原始数据
    ProjectTypeShowArr: [],//类型 显示的数据


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
        name: '未进行',
        id: 1
      },
      {
        name: '进行中',
        id: 2
      },
      {
        name: '结束',
        id: 3
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
  // ==========================项目类型选择===========================
  onProjectType() {
    const showData = this.data.ProjectTypeArr.map(item => item.name)
    this.setData({
      is_show_type: true,
      ProjectTypeShowArr: showData
    })
  },
  cancelProjectType() {
    this.setData({
      is_show_type: true,
    })
  },
  confirmProjectType(e) {
    const { value,index } = e.detail;
    const ProjectTypeId = this.data.ProjectTypeArr[index].id;
    this.setData({
      ProjectType: value,
      ProjectTypeId,
      is_show_type: false
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
    const ProjectPLevelShowArr = this.data.ProjectPLevelArr.map(item => item.name)
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
    const ProjectPLevelId = this.data.ProjectPLevelArr[index].id;
    this.setData({
      ProjectPLevel: value,
      ProjectPLevelId,
      is_show_pLevel: false
    })
  },

  // ==============================项目状态选择===============================
  onStatus() {
    const ProjectStatusShowArr = this.data.ProjectStatusArr.map(item => item.name);
    this.setData({
      ProjectStatusShowArr,
      is_show_status: true
    })
  },
  cancelStatus() {
    this.setData({
      is_show_status: false0
    })
  },
  confirmStatus(e) {
    console.log(e,'当前点击的')
    const { value, index } = e.detail;
    const ProjectStatusId = this.data.ProjectStatusArr[index].id;
    this.setData({
      ProjectStatus: value,
      ProjectStatusId,
      is_show_status: false
    })
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
        title: '项目名不能为空',
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
    if(!this.data.ProjectType) {
      wx.showToast({
        title: '项目类型不能为空',
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
    if(!this.data.ContactName) {
      wx.showToast({
        title: '联系人不能为空',
        icon: 'none',
        duration: 1000,
        mask: true
      });
      return
    }
    if(!this.data.ContactTel) {
      wx.showToast({
        title: '联系电话不能为空',
        icon: 'none',
        duration: 1000,
        mask: true
      });
      return
    }
    // this.updateItem();//调用更新项目信息接口
    const sendData = {
      ProjectCode: proid,
      ProjectName: this.data.ProjectName,
      ProjectDescribe: this.data.ProjectDescribe,
      ProjectType: this.data.ProjectTypeId,
      ProjectRemark: this.data.ProjectRemark,
      ProjectPLevel: this.data.ProjectPLevelId,
      ProjectStatus: this.data.ProjectStatusId,
      ContactName: this.data.ContactName,
      ContactTel: this.data.ContactTel,
      ContactDuty: this.data.ContactDuty,
    }
    console.log(sendData,'sendDatasendDatasendData')
    // 调用更新项目函数  传入数据
    this.updateItem(sendData);
  },

  // 点击按钮修改项目的信息
  async updateItem(data) {
    const that = this;
    const Token = getToken();//获取token
    try {
      let res = await cloudFunc('updateProjectContact',{
        Token,
        ...data
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
      function _transformType(type) {
        switch (type) {
          case 1:
            return '类型一';
          case 2:
            return '类型二';
          case 3:
            return '类型三';
          case 4:
            return '类型四';
        }
      }
      function _transformLevel(level) {
        switch (level) {
          case 0:
            return 'P0';
          case 1:
            return 'P1';
          case 2:
            return 'P2';
          case 3:
            return 'P3';
          case 4:
            return 'P4';
          case 5:
            return 'P5';
        }
      }
      function _transformStatus(status) {
        switch (status) {
          case 1:
            return '未进行';
          case 2:
            return '进行中';
          case 3:
            return '结束';
        }
      }
      that.setData({
        ProjectName: detail.ProjectName,//获取数据后 设置数据给data渲染
        ProjectDescribe: detail.ProjectDescribe,
        ProjectType: _transformType(detail.ProjectType),//显示的类型名 要用转换函数转换name
        ProjectTypeId: detail.ProjectType,
        ProjectRemark: detail.ProjectRemark,
        ProjectPLevel: _transformLevel(detail.ProjectPLevel),
        ProjectPLevelId: detail.ProjectPLevel,
        ProjectStatus: _transformStatus(detail.ProjectStatus),
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