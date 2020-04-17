const cloudFunc = require("../../api/index");
import parseTime from '../../utils/parseTime'
const regeneratorRuntime = require("../../utils/runtime"); //ES7 环境
import { getToken, getUserId } from "../../utils/storage";
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 时间选择器
    currentDate: new Date().getTime(),
    minDate: new Date().getTime(),
    formatter(type, value) {
      if (type === 'year') {
        return `${value}年`;
      } else if (type === 'month') {
        return `${value}月`;
      }
      return value;
    },
    contract_name_val:'',//合同名称  需要校验
    contract_item_val:'',//所属项目  需要校验
    contract_item_id:'',//项目对应的id
    contract_item_arr: [],//要展示的选择项目的列表
    contract_id_val:'',//合同编号   
    contract_parent_val:'',//父合同编号名称   
    contract_parent_id:'',//父合同编号code   
    contract_parent_arr:'',//父合同列表选择数据  
    contract_kind_val: '',//合同类型
    contract_kind_id: '',//合同类型对应的字段id
    contract_kind_arr: [//动态获取的项目类型数组列表 
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
    ], 
    contract_price_val: '',//合同金额
    contract_start_val: '',//合同开始时间
    contract_stop_val: '',//合同结束时间
    contract_remark_val: '',//合同备注

    is_show_item: false,//是否展示弹出选择项目
    is_show_type: false,//是否展示弹出合同分类
    is_show_start: false,//是否展示选择开始时间
    is_show_stop: false,//是否展示选择结束时间
    is_show_parent: false,//是否展示选择父合同

  },

/*************************点击弹出菜单**********************/
  // 1.点击选择弹出项目分类菜单
  async showItemMenu() {
    this.setData({
      is_show_item: true
    })

    let res = await this.getItemsList();//获取要选择的项目
    let result = res.result && JSON.parse(res.result);
    // 处理数据
    result.length > 0 && result.forEach(item => {
      item.name = item.ProjectName;
      item.code = item.ProjectCode
    })
    this.setData({
      contract_item_arr: result
    })
  },
  // 2.点击关闭项目选择
  closeItemMenu(e) {
    this.setData({
      is_show_item: false
    })
  },
  // 3.点击选中某一个项目
  selectItemMenu(e) {
    console.log(e,'当前选择的项目')
    const name = e.detail.name;//name
    const code = e.detail.code;//code
    this.setData({
      contract_item_val: name,
      contract_item_id: code
    })
  },
  // 4.点击展示合同分类的菜单
  showTypeMenu() {
    this.setData({
      is_show_type: true
    })
  },
  // 5.点击关闭合同分类的菜单
  closeTypeMenu() {
    this.setData({
      is_show_type: false
    })
  },
  // 6.点击选中某一个合同分类
  selectTypeMenu(e) {
    const name = e.detail.name;
    const type = e.detail.type;
    this.setData({
      contract_kind_val: name,//选择的合同类型
      contract_kind_id: type//选择的合同类型对应的字段id
    })
  },

  // 7.点击弹出选择开始时间
  showStartMenu() {
    this.setData({
      is_show_start: true
    })
  },
  // 8.点击确定按钮
  confirmStart(e) {
    // 处理为Date 格式
    const t = parseTime(e.detail/1000);
    // const newTime = `${t} 00:00:00`;
    this.setData({
      contract_start_val: t,
      is_show_start: false
    })
  },
  // 9.点击取消按钮
  cancelStart() {
    this.setData({
      is_show_start: false
    })
  },
  // 10.点击弹出选择开始时间
  showStopMenu() {
    this.setData({
      is_show_stop: true
    })
  },
  // 11.点击确定按钮
  confirmStop(e) {
    // 处理为Date 格式
    const t = parseTime(e.detail/1000);
    // const newTime = `${t} 00:00:00`;
    this.setData({
      contract_stop_val: t,
      is_show_stop: false
    })
  },
  // 12.点击取消按钮
  cancelStop() {
    this.setData({
      is_show_stop: false
    })
  },
  // 13.点击弹出选择父合同编号
  async showParentMenu() {
    this.setData({
      is_show_parent: true
    })

    let res = await this.getParentLists();//获取要选择的父合同
    console.log(res,'获取的结果oooooooooooooooooooooo')
    
    let result = res.result && JSON.parse(res.result);//转换为JSON
    // 处理数据 获取合同名和合同code
    let newArr = result._Items && result._Items.length > 0 && result._Items.map(item => {
      return {
        name: item.ContractName,
        code: item.ContractCode
      }
    })
    // console.log(newArr,'show data with handle**********************')
    this.setData({
      contract_parent_arr: newArr,//设置返回渲染的数据
    })
  },
  // 14.关闭选择父合同
  closeParentMenu() {
    this.setData({
      is_show_parent: false
    })
  },
  // 15.点击选择一个父合同
  selectParentMenu(e) {
    //将当前的选择合同的id  赋值
    const code = e.detail.code;
    const name = e.detail.name;
    this.setData({
      contract_parent_id: code,
      contract_parent_val: name
    })
  },

  /******************输入事件监听****************/
  // 合同名称监听输入事件
  contractNameInp(e) {
    this.setData({
      contract_name_val: e.detail
    })
  },
  // 合同编号输入监听
  contractIdInp(e) {
    this.setData({
      contract_id_val: e.detail
    })
  },
  // 合同金额输入监听
  contractPriceInp(e) {
    this.setData({
      contract_price_val: e.detail
    })
  },
  // 合同备注输入监听
  contractRemarkInp(e) {
    this.setData({
      contract_remark_val: e.detail
    })
  },
 
  
/******************点击提交按钮*******************/
  // 提交项目表单
  handleSubmit() {
    // 校验 合同名不能为空
    if(!this.data.contract_name_val) {
      wx.showToast({
        title: '合同名不能为空',
        icon: 'none',
        duration: 1000,
        mask: true
      });
      return
    }
    // 校验 项目不能为空
    if(!this.data.contract_item_val) {
      wx.showToast({
        title: '项目不能为空',
        icon: 'none',
        duration: 1000,
        mask: true
      });
      return
    }
    // 校验 合同编号不能为空
    if(!this.data.contract_id_val) {
      wx.showToast({
        title: '合同编号不能为空',
        icon: 'none',
        duration: 1000,
        mask: true
      });
      return
    }
    // 校验 合同分类不能为空
    if(!this.data.contract_kind_id) {
      wx.showToast({
        title: '合同分类不能为空',
        icon: 'none',
        duration: 1000,
        mask: true
      });
      return
    }
    // 校验 合同金额不能为空
    if(!this.data.contract_price_val) {
      wx.showToast({
        title: '合同金额不能为空',
        icon: 'none',
        duration: 1000,
        mask: true
      });
      return
    }
    // 校验 签订时间不能为空
    if(!this.data.contract_start_val) {
      wx.showToast({
        title: '签订时间不能为空',
        icon: 'none',
        duration: 1000,
        mask: true
      });
      return
    }
    // 校验 到期时间不能为空
    if(!this.data.contract_stop_val) {
      wx.showToast({
        title: '到期时间不能为空',
        icon: 'none',
        duration: 1000,
        mask: true
      });
      return
    }
    

    // 发送的数据
    let sendData = {
      ContractName: this.data.contract_name_val,
      ProjectCode: this.data.contract_item_id,
      ContractCode: this.data.contract_id_val,
      ContractType: this.data.contract_kind_id,
      ContractAmount: parseInt(this.data.contract_price_val),
      ContractSignTime: `${this.data.contract_start_val} 00:00:00`,//处理为后端的Date格式
      ContractEndTime: `${this.data.contract_stop_val} 00:00:00`,
      ContractRemark: this.data.contract_remark_val,
      ContractParentCode: this.data.contract_parent_id,//父合同的id
    }
    console.log(sendData,'????????????????')
    //调用创建合同接口
    this.addContract(sendData)

  },
  // 点击按钮 - 添加合同
  async addContract(data) {
    try {
      const that = this;
      const Token = getToken();//获取Token
      let res = await cloudFunc("addContract", {
        Token,
        ...data
      });
      console.log(res,'添加合同的结构？？？？？？？？？？？')
      if(res.result.toString().length > 0) {
        wx.showToast({
          title: '添加成功',
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
      console.log(error)
      wx.showToast({
        title: '添加失败',
        icon: 'none',
        duration: 1000,
        mask: true
      });
    }
  },

  // 获取项目列表
  async getItemsList() {
    try {
      const that = this;
      const Token = getToken();//获取Token
      const UserId = getUserId(); //缓存中读取用户id
      const Option = 1; 
      let res = await cloudFunc("getOwnProjectList", {
        Token,
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

  // 获取选择的父合同列表
  async getParentLists() {
    try {
      const that = this;
      const token = getToken();
      const Option = 0;
      const skipNum = 0;
      const sizeNum = 100;//默认为翻页查询100条合同  合同数量不可能为100
      let res = await cloudFunc('getOwnContractList',{
        token,
        Option,
        skipNum,
        sizeNum
      })
      return res
    } catch (error) {
      console.log(error,'错误')
      wx.showToast({
        title: '请求错误',
        icon: 'none',
        duration: 1500,
        mask: true,
      });
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {},

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