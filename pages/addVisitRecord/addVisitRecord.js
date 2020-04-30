import parseTime from '../../utils/parseTime'
const cloudFunc  = require('../../api/index')
const regeneratorRuntime  = require('../../utils/runtime')
import { getToken } from "../../utils/storage";
let proid = '';
Page({
  data: {
    currentDate: new Date().getTime(),
    // minDate: new Date().getTime(),
    formatter(type, value) {
      if (type === "year") {
        return `${value}年`;
      } else if (type === "month") {
        return `${value}月`;
      }
      return value;
    },
    show_picker: false,//是否显示data-picker
    picker_value: '',//显示选择的时间值
    remark_mes: '',//备注初始信息
    content_mes: '',//内容初始信息
    remark_err: '',//备注是否有错误信息
    content_err: '',//内容是否有错误信息
    visitid: null,//如果是完成拜访计划 需要传递当前点击的拜访id
  },

  // 1.点击展示data-picker
  showPicker() {
    this.setData({
      show_picker: true
    })
  },
  // 2.点击选中当前时间的确定按钮
  onConfirm(e) {
    const t = parseTime(e.detail/1000);//选择的时间
    console.log(parseTime(e.detail/1000),'选中时间值')
    this.setData({
      picker_value:t,//当前选择时间显示
      show_picker: false,//隐藏时间选择框
    })
  },
  // 3.点击取消按钮时触发的事件
  onCancel(e) {
    const nowVal = this.data.picker_value;//点击取消按钮之前的data-picker的值
    this.setData({
      picker_value: nowVal,//点击取消按钮设置为当前的值
      show_picker: false,//隐藏时间选择框
    })
  },
  // 4.备注输入框失焦事件
  remark_blur(e) {
    console.log(e,'备注')
    const res = e.detail;//失焦时获取的备注数据
    this.setData({
      remark_mes: res
    })
  },
  // 5.内容输入框失焦事件
  content_blur(e) {
    console.log(e,'内容')
    const res = e.detail;//失焦时获取的内容数据
    this.setData({
      content_mes: res
    })
  },
  // 点击提交按钮
  handleSubmit() {
    // 判断备注值是否为空 进行错误信息校验
    // if(this.data.remark_mes === '') {//备注信息为空
    //   this.setData({
    //     remark_err: "请输入备注信息"
    //   })
    //   return
    // }else{
    //   this.setData({
    //     remark_err: ""
    //   })
    // }
    // 判断内容值是否为空 进行错误信息校验
    if(!this.data.content_mes.trim()) {//内容信息为空
      wx.showToast({
        title: '实际内容不能为空',
        icon: 'none',
        duration: 1000,
        mask: true
      })
      return
    }
    // 判断data-picker是否为空
    if(!this.data.picker_value) {
      wx.showToast({
        title: '实际时间不能为空',
        icon: 'none',
        duration: 1000,
        mask: true
      })
      return
    }

    // 提交数据
    this.btnSubmit()
  },
  // 点击按钮提交
  btnSubmit() {
    const that = this;
    console.log(proid,this.data.remark_mes,this.data.content_mes,this.data.picker_value,'===')
    console.log(this.data.visitid,'我是拜访的idddddddddddddddddddddd')
    // 根据是否有拜访id判断 是添加拜访记录还是完成当前拜访计划
    if(this.data.visitid) {//存在visitid  说明是完成拜访计划
      this.getCompletePlan();//调用完成当前计划
    }else {
      this.getRealRecord();//调用直接添加记录结果
    }
  },

  // 获取直接添加记录接口
  async getRealRecord() {
    const that = this;
    //获取结果
    try {
      const Token = getToken();//获取缓存
      let res = await cloudFunc('addVisit',{
        proid,//项目id
        remark_mes: that.data.remark_mes,//备注信息
        content_mes:that.data.content_mes,//内容信息
        picker_value:that.data.picker_value,//选择时间
        Token,
        VisitPlanTime: '',
        VisitPlanContent: '',
      })
      console.log(res,'这是添加拜访结果00000000000000000000000')
      const result = res.result && JSON.parse(res.result);
      if(result.VisitId === 0) {
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
      }else if(result[0].error_respone.errCode === 303) {
        wx.showToast({
          title: '添加记录时间错误',
          icon: 'none',
          duration: 1000,
          mask: true,
        });
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

  // 获取完成拜访计划数据接口
  async getCompletePlan() {
    const that = this;
    const Token = getToken();//获取token
    try {
      let res = await cloudFunc('updateVisit',{
        Token,
        VisitId: that.data.visitid,
        VisitPlanTime: '',
        VisitPlanContent: '',
        VisitFactTime: that.data.picker_value,
        VisitFactContent: that.data.content_mes,
        VisitRemark: that.data.remark_mes
      })
      console.log(res,'我市完成计划完成计划///////////////////////')
      wx.showToast({
        title: '完成计划',
        icon: 'success',
        duration: 1000,
        mask: true
      });

      // 返回上一页
      setTimeout(_ => {
        wx.navigateBack();
      },1000)
    } catch (error) {
      console.log(error,'失败原因')
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
  onLoad: function(options) {
    proid = options.proid;//获取的项目id
    console.log(proid,'from two ways and show proid')
    const planData = options.planData;//从填写计划页面跳转过来的传递参数
    if(planData) {
      const newData = JSON.parse(planData);//JSON化
      this.setData({
        picker_value: newData.plantime.replace(/\./g,"-"),//处理时间
        remark_mes: newData.planremark,
        content_mes: newData.plancontent,
        visitid: newData.visitid
      })
    }
    console.log(this.data.picker_value)
    console.log(this.data.remark_mes)
    console.log(this.data.content_mes)
    console.log(this.data.visitid)
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {},

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {},

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {},

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {},

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {},

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {},

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {}
});
