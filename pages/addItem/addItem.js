const cloudFunc = require("../../api/index");
const regeneratorRuntime = require("../../utils/runtime"); //ES7 环境
import { getToken, getUserId } from "../../utils/storage";
Page({

  /**
   * 页面的初始数据
   */
  data: {
    project_name_val:'',//项目名称  需要校验
    project_desc_val:'',//项目描述  需要校验
    project_kind_val:'',//项目分类值  
    project_kind_id: '',//项目分类值对应的id
    project_kind_arr: [
      {
        name: '种类一',
        type: 1
      },
      {
        name: '种类二',
        type: 2
      },
      {
        name: '种类三',
        type: 3
      },
      {
        name: '种类四',
        type: 4
      },
    ],//动态获取的项目类型数组列表  
    project_remark_val:'',//项目备注  需要校验
    project_customer_val: '',//客户名称 需要校验
    project_customer_id: '',//客户id
    project_customer_arr: '',//动态获取的客户数据列表
    project_conname_val: '',//联系人名字
    project_contel_val: '',//联系人电话
    project_conduty_val: '',//联系人职务

    show_kind_item: false,//'是否展示项目分类选项'
    show_user_item: false,//'是否展示客户分类选项'
    

  },

  // 1.点击选择弹出项目分类菜单
  showKindMenu() {
    this.setData({
      show_kind_item: true
    })
  },
  // 2.点击关闭项目等级选择
  closeKindMenu(e) {
    this.setData({
      show_kind_item: false
    })
  },
  // 3.点击选中某一个项目等级
  selectKindMenu(e) {
    const typeId = e.detail.type;//点击的项目类型id
    this.setData({
      project_kind_val: e.detail.name,
      project_kind_id: typeId
    })
  },
  // 4.点击选择弹出客户分类菜单
  async showUserMenu() {
    this.setData({
      show_user_item: true
    })
    // 调用接口获取客户列表
    let res = await this.getCustomerList()
    let newRes = JSON.parse(res.result);
    newRes && newRes.forEach(item => item.name = item.CustName);
    console.log(newRes,'新的数据')
    this.setData({
      project_customer_arr: newRes
    })
    
  },
  // 5.点击关闭客户选择
  closeUserMenu() {
    this.setData({
      show_user_item: false
    })
  },
  // 6.点击选中某一个项目等级
  selectUserMenu(e) {
    const CustId = e.detail.CustId;//点击的客户id
    this.setData({
      project_customer_val: e.detail.name,//客户姓名值
      project_customer_id: CustId//客户id
    })
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
        title: '项目名不能为空',
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
    // 校验 项目备注必填
    if(!this.data.project_remark_val) {
      wx.showToast({
        title: '项目备注不能为空',
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
    // 发送的数据

    let sendData = {
      ProjectName: this.data.project_name_val,
      ProjectDescribe: this.data.project_desc_val,
      ProjectRemark: this.data.project_remark_val,
      ContactName: this.data.project_conname_val,
      ContactTel: this.data.project_contel_val,
      ContactDuty: this.data.project_conduty_val
    }
    this.addProject(sendData)

  },
  // 生命周期函数 - 添加项目
  async addProject(data) {
    try {
      const that = this;
      const Token = getToken();//获取Token
      const UserId = getUserId(); //缓存中读取用户id
      const CustId = +this.data.project_customer_id; //读取客户的id
      const ProjectType = +this.data.project_kind_id; //读取项目类型对应的id
      let res = await cloudFunc("addProject", {
        Token,
        UserId,
        CustId,
        ProjectType,
        ...data
      });
      // console.log(res,'添加项目的结构？？？？？？？？？？？')
      if(res.result.toString().length > 0) {
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

    try {
      const that = this;
      const token = getToken();//获取Token
      const UserId = getUserId(); //缓存中读取用户id
      const Option = 0; //
      let res = await cloudFunc("getCustomerList", {
        token,
        UserId,
        Option
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
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.showLoading({
      title: '提交中',
      mask: true,
      success(e) {
        console.log(e)
      }
    })

    setTimeout(() => {
      wx.hideLoading();
    }, 2000);
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