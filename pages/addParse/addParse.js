import parseTime from '../../utils/parseTime';
const cloudFunc = require("../../api/index");
const regeneratorRuntime = require("../../utils/runtime"); //ES7 环境
import { getToken } from "../../utils/storage";
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
    code: '',//合同code
    desc: '',//阶段描述
    time: '',//阶段开始时间
    type: '',//阶段类型  显示的名称
    total: '',//阶段总金额
    id: '',//阶段id

    // 阶段类型选择
    show_parse_type: false,//是否显示项目类型菜单
    parse_type_arr: [
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
    ],//原始保存的 类型名称和对应的id值
    parse_type_showArr: [],//在列表中显示的数据
    type_id: '',//上传的类型对应的id

    // 阶段计划时间
    show_parse_plantime: false,//是否显示阶段计划时间菜单

    // 实际时间
    show_parse_facttime: false,//是否显示阶段实际时间
  },

  // 转换阶段类型
  _transformType (type) {
    switch (type) {
      case '1':
        return '类型一';
      case '2':
        return '类型二';
      case '3':
        return '类型三';
      case '4':
        return '类型四';
    }
  },
  // 转换金额
  _transformTotal(total) {
    return total
  },
  // ======================阶段描述input===================
  onDescInp(e) {
    const inpVal = e.detail;
    this.setData({
      desc: inpVal
    })
  },
  // ========================阶段总金额input================
  onTotalInp(e) {
    const total = e.detail;
    this.setData({
      total,
    })
  },
  // =========================阶段类型选择=================
  onParseType() {
    const newArr = this.data.parse_type_arr.map(item => item.name)
    this.setData({
      parse_type_showArr: newArr,
      show_parse_type: true
    })
  },
  cancelParseType() {
    this.setData({
      show_parse_type: false
    })
  },
  confirmParseType(e) {
    console.log(e,'当前选择的阶段')
    const {value,index} = e.detail;
    const type_id = this.data.parse_type_arr[index].id;//获取id
    this.setData({
      type: value,//设置显示的类型名称
      type_id,
      show_parse_type: false
    })

  },

  // ========================阶段计划时间===================
  onPlanTime() {  
    this.setData({
      show_parse_plantime: true
    })
  },
  cancelPlanTime() {
    this.setData({
      show_parse_plantime:false
    })
  },
  confirmPlanTime(e) {
    let time = e.detail;
    time = parseTime(time / 1000);//转换时间
    this.setData({
      time,
      show_parse_plantime: false
    })
  },

  // ========================点击按钮提交表单==========================
  handleSubmit() {
    // 输入校验
    if(!this.data.desc) {
      wx.showToast({
        title: '阶段名称不能为空',
        icon: 'none',
        duration: 1000,
        mask: true,
      });
      return
    }
    if(!this.data.total) {
      wx.showToast({
        title: '阶段金额不能为空',
        icon: 'none',
        duration: 1000,
        mask: true,
      });
      return
    }
    if(!this.data.type_id) {
      wx.showToast({
        title: '阶段类型不能为空',
        icon: 'none',
        duration: 1000,
        mask: true,
      });
      return
    }
    if(!this.data.time) {
      wx.showToast({
        title: '阶段时间不能为空',
        icon: 'none',
        duration: 1000,
        mask: true,
      });
      return
    }
    this.changeParseInfo();
  },

  
  // 修改阶段信息  方法
  async changeParseInfo() {
    const that = this;
    try {
      const token = getToken();//获取Token
      const ContractCode = this.data.code;//合同code 
      const PhaseDescribe = this.data.desc; //阶段描述
      let PhasePlanTime = this.data.time; //计划时间
      PhasePlanTime = PhasePlanTime.replace(/\./g,'-') + ' 00:00:00';
      const PhaseType = parseInt(this.data.type_id); //类型id
      let PhaseAmount = this.data.total.replace(/\,/g,'').replace(/\￥/g,''); 
      PhaseAmount = parseInt(PhaseAmount);//转为数字
      // 添加阶段信息
      let res = await cloudFunc("addPhase", {
        token,
        ContractCode,
        PhaseDescribe,
        PhasePlanTime,
        PhaseType,
        PhaseAmount
      });
      console.log(res,'添加阶段结果')
      const result = res.result && JSON.parse(res.result);
      // 超出了合同金额
      if(Array.isArray(result) && result[0].error_respone.errCode === 902) {
        wx.showToast({
          title: '不能超出合同金额',
          icon: 'none',
          duration: 1000,
          mask: true,
        });
      }else {
        wx.showToast({
          title: '添加成功',
          icon: 'success',
          duration: 1000,
          mask: true,
        });
        // 返回上一页
        setTimeout(_ => {
          wx.navigateBack();
        },1000)
      }
    } catch (error) {
      console.log(error)
      console.log(error.errCode)
      console.log(error.errMsg)
      wx.showToast({
        title: '添加失败',
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
    const { code } = options;
    this.setData({
      code,
    })
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