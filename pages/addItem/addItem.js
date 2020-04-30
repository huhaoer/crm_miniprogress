const cloudFunc = require("../../api/index");
const regeneratorRuntime = require("../../utils/runtime"); //ES7 环境
import { getToken, getUserId } from "../../utils/storage";
const { _projectStatus, _projectLevel, _projectLevel2Number } = require('../../utils/project')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    project_name_val:'',//项目名称  需要校验
    project_desc_val:'',//项目描述  需要校验

    project_remark_val:'',//项目备注  需要校验
    project_customer_val: '',//客户名称 需要校验
    project_customer_id: '',//客户id
    project_customer_arr: '',//动态获取的客户数据列表
    project_conname_val: '',//联系人名字
    project_contel_val: '',//联系人电话
    project_conduty_val: '',//联系人职务

    ProjectPLevel: '',//项目P等级  显示的名称
    ProjectPLevelId: '',//p等级 对应的id值
    is_show_pLevel: false,//是否显示选择p等级 菜单

    ProjectPLevelShowArr: [],//显示出来的P等级

    ProjectStatus: '',//项目状态 显示的名称
    ProjectStatusId: '',//项目的状态对应的 id值
    is_show_status: false,//是否显示 展开状态选择栏
    ProjectStatusShowArr: [],//显示出来的状态 列表

    show_kind_item: false,//'是否展示项目分类选项'
    show_user_item: false,//'是否展示客户分类选项'
    

    columns:[],
    loading: true,//是否加载中

  },
  // 4.点击选择弹出客户分类菜单
  async showUserMenu() {
    const that = this;
    this.setData({
      show_user_item: true,
      loading: true
    })

    // 调用接口获取客户列表
    let res = await this.getCustomerList()
    let newRes = res.result && JSON.parse(res.result);
    newRes && newRes.forEach(item => item.name = item.CustName);
    const data = newRes && newRes.map(item => item.CustName)
    this.setData({
      columns: data || [],
      project_customer_arr: newRes,//设置该值 便于下面选择根据索引查询用户id
      loading: false//取消加载
    })
    
  },
  // 5.点击关闭客户选择
  cancelUserMenu() {
    this.setData({
      show_user_item: false
    })
  },
  // 6.点击选中某一个项目等级  确定按钮
  confirmUserMenu(e) {
    const custName = e.detail.value;//点击的客户名字
    const index = e.detail.index;//点击客户的索引值
    const custId = this.data.project_customer_arr[index].CustId;//根据索引获取id
    this.setData({
      project_customer_val: custName,//客户姓名值
      project_customer_id: custId,//客户id
      show_user_item: false
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
    const { value, index } = e.detail;
    const ProjectStatusId = _projectStatus[index].id;
    this.setData({
      ProjectStatus: value,
      ProjectStatusId,
      is_show_status: false
    })
    console.log(value,ProjectStatusId)
  },


  // 项目名称监听输入事件
  projectNameInp(e) {
    this.setData({
      project_name_val: e.detail
    })
  },
  // 项目描述监听
  projectDescInp(e) {
    this.setData({
      project_desc_val: e.detail
    })
  },
  // 项目备注监听事件
  projectRemarkInp(e) {
    this.setData({
      project_remark_val: e.detail
    })
  },
  // 联系人姓名监听事件
  projectConnameInp(e) {
    this.setData({
      project_conname_val: e.detail
    })
  },
  // 联系人电话监听事件
  projectContelInp(e) {
    this.setData({
      project_contel_val: e.detail
    })
  },
  // 联系人职务监听事件
  projectCondutyInp(e) {
    this.setData({
      project_conduty_val: e.detail
    })
  },

  // 提交项目表单
  handleSubmit() {
    // 校验 项目名称必填
    if(!this.data.project_name_val) {
      wx.showToast({
        title: '项目名称不能为空',
        icon: 'none',
        duration: 1000,
        mask: true
      });
      return
    }
    // 校验 项目描述必填
    if(!this.data.project_desc_val) {
      wx.showToast({
        title: '项目描述不能为空',
        icon: 'none',
        duration: 1000,
        mask: true
      });
      return
    }
    // 校验 客户名称必填
    if(!this.data.project_customer_val) {
      wx.showToast({
        title: '客户名称不能为空',
        icon: 'none',
        duration: 1000,
        mask: true
      });
      return
    }
    // 校验 项目等级必填
    if(!this.data.ProjectPLevel) {
      wx.showToast({
        title: '项目等级不能为空',
        icon: 'none',
        duration: 1000,
        mask: true
      });
      return
    }
    // 校验 项目状态必填
    if(!this.data.ProjectStatus) {
      wx.showToast({
        title: '项目状态不能为空',
        icon: 'none',
        duration: 1000,
        mask: true
      });
      return
    }
    // 发送的数据

    let sendData = {
      ProjectName: this.data.project_name_val,
      ProjectDescribe: this.data.project_desc_val,
      ProjectRemark: this.data.project_remark_val,
      ContactName: this.data.project_conname_val,
      ContactTel: this.data.project_contel_val,
      ContactDuty: this.data.project_conduty_val,
      CustId: this.data.project_customer_id, //读取客户的id
      ProjectPLevel: this.data.ProjectPLevelId,//项目等级
      ProjectStatus: this.data.ProjectStatusId,//项目状态
    }
    this.addProject(sendData)

  },
  // 点击按钮 - 添加项目
  async addProject(data) {
    try {
      const that = this;
      const Token = getToken();//获取Token
      const UserId = getUserId(); //缓存中读取用户id
      let res = await cloudFunc("addProject", {
        Token,
        UserId,
        ...data
      });
      console.log(res,'添加项目的结构？？？？？？？？？？？')
      const result = res.result && JSON.parse(res.result);//转换为JSON
      if(Array.isArray(result) && result[0].error_respone.errCode === 403) {//是数组
        wx.showToast({
          title: result[0].error_respone.errMsg,
          icon: 'none',
          duration: 1000,
          mask: true
        });
        // 返回上一页
        setTimeout(_ => {
          wx.navigateBack();
        },1000)
      }else {
        wx.showToast({
          title: "添加成功",
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
        title: '添加失败',
        icon: 'none',
        duration: 1000,
        mask: true
      });
    }
  },

  // 获取客户列表
  async getCustomerList() {
    const that = this;
    try {
      const token = getToken();//获取Token
      const Option = 1; //
      let res = await cloudFunc("getCustomerList", {
        token,
        Option,
        skipNum: 0,
        sizeNum: -1
      });
      return res
    } catch (error) {
      console.log(error)
      wx.showToast({
        title: '获取失败',
        icon: 'none',
        duration: 1000,
        mask: true
      });
      that.setData({
        loading: false,//请求失败也取消加载
      })
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // wx.showLoading({
    //   title: '提交中',
    //   mask: true,
    //   success(e) {
    //     console.log(e)
    //   }
    // })

    // setTimeout(() => {
    //   wx.hideLoading();
    // }, 2000);
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