const cloudFunc = require("../../api/index");
const regeneratorRuntime = require("../../utils/runtime"); //ES7 环境
import { getToken, getUserId } from "../../utils/storage";
import parseTime from '../../utils/parseTime'
const { _contractType, _contractType2Number } = require('../../utils/contract')
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
      token: '', 
      ContractCode: '',
      contract_parent_val:'',//补充同编号名称   
      contract_parent_id:'',//补充同编号code   
      contract_parent_arr:'',//补充同列表选择数据  
      is_show_parent: false,//是否展示选择父合同
      columns2: [],//父合同列表
      ContractEffectTime: '',
      ContractNoEffectTime: '',
      ContractName: '',
      ContractType: '',
      ContractTypeMap: '',//合同类型对应的映射显示名字
      PartyA: '',//甲方名字
      // PartyB: '',
      PartyC: '',
      ContractAmount: '',
      ContractParentCode: '',
      ContractSignTime: '',
      ContractEndTime: '',
      ContractRemark: '',
      ProjectCode: '',
      loading: true,//是否在加载中
      columns: [],//项目选择的列表
      ProjectCodeMap: '',//项目code对应映射名字

      is_show_type: false,//是否显示合同分类菜单
      contract_kind_arr: _contractType,

      is_show_item: false,//是否显示项目选择的菜单
      contract_item_arr: [],//项目选择的列表

      is_show_start: false,//是否显示选择开始时间
      start_time_temp: '',//开始时间戳

      is_show_stop: false,//是否显示选择结束时间
      stop_time_temp: '',//结束时间戳
  },
  // 输入===========================监听
  // onNameInp
  onNameInp(e) {
    const ContractName = e.detail;
    this.setData({
      ContractName
    })
  },
  // onContractIdInp
  onContractIdInp(e) {
    const ContractCode = e.detail;
    this.setData({
      ContractCode
    })
  },
  // onRemarkInp
  onRemarkInp(e) {
    const ContractRemark = e.detail;
    this.setData({
      ContractRemark
    })
  },
  // onBINGInp
  onBINGInp(e) {
    const PartyC = e.detail;
    this.setData({
      PartyC
    })
  },
  // onTotalInp
  onTotalInp(e) {
    let ContractAmount = e.detail
    console.log(ContractAmount)
    this.setData({
      ContractAmount,
    })
  },
  // onNewContractIdInp
  // onNewContractIdInp(e) {
  //   const ContractNewCode = e.detail;
  //   this.setData({
  //     ContractNewCode
  //   })
  // },


  // 显示==================================菜单
  // 点击合同分类
  showTypeMenu() {
    this.setData({
      is_show_type: true
    })
  },
  closeTypeMenu() {
    this.setData({
      is_show_type: false
    })
  },
  selectTypeMenu(e) {
    const ContractTypeMap = e.detail.name;
    const ContractType = e.detail.id;
    this.setData({
      ContractType,
      ContractTypeMap
      
    })
    console.log(ContractTypeMap,ContractType)
  },

  // ==============================父合同========================================
  // 13.点击弹出选择父合同编号
  async showParentMenu() {
    
    this.setData({
      is_show_parent: true,
      loading2: true
    })
    let res = await this.getParentLists();//获取要选择的父合同
    let result = res.result && JSON.parse(res.result);//转换为JSON
    // 处理数据 获取合同名和合同code
    let newArr = result._Items && result._Items.length > 0 && result._Items.map(item => {
      return {
        name: item.ContractName,
        code: item.ContractCode
      }
    })
    const columns2Data = newArr.map(item => item.name);//处理渲染的列表
    this.setData({
      contract_parent_arr: newArr,//设置返回渲染的数据
      columns2: columns2Data,
      loading2: false
    })
  },
  // 14.关闭选择父合同
  cancelParentMenu() {
    this.setData({
      is_show_parent: false
    })
  },
  // 15.点击选择一个父合同
  confirmParentMenu(e) {
    //将当前的选择合同的id  赋值
    const parentName = e.detail.value;//点击的项目名字
    const index = e.detail.index;//点击项目的索引值
    const parentId = this.data.contract_parent_arr[index].code;//根据索引获取项目id
    this.setData({
      contract_parent_val: parentName,
      contract_parent_id: parentId,
      is_show_parent: false
    })
    console.log(parentName,'补充合同')
    console.log(parentId,'补充合同num')
  },

  // 获取选择的父合同列表
  async getParentLists() {
    const that = this;
    try {
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
    that.setData({
      loading2: false,
      is_show_parent: false
    })
  },


  // 点击项目类
  async showItemMenu() {
    this.setData({
      is_show_item: true
    })
    let res = await this.getItemsList();//获取要选择的项目
    let result = res.result && JSON.parse(res.result);
    console.log(result,'选择的项目*****************************')
    // 处理数据
    result.length > 0 && result.forEach(item => {
      item.name = item.ProjectName;
      item.code = item.ProjectCode
      item.cname = item.CustomerName//甲方  即客户的名字
    })

    const columnsData = result.length > 0 && result.map(item => item.name)
    
    this.setData({
      contract_item_arr: result,
      loading: false,//取消加载
      columns: columnsData
    })
  },
  cancelItemMenu() {
    this.setData({
      is_show_item: false
    })
  },
  confirmItemMenu(e) {
    const proName = e.detail.value;//当前点击选项的名称
    const index = e.detail.index;//索引
    const proId = this.data.contract_item_arr[index].code;//根据索引获取当前点击项目的对应code值
    const PartyA = this.data.contract_item_arr[index].cname;//根据索引获取当前点击项目的对应甲方的名字
    this.setData({
      ProjectCode: proId,//设置项目id
      ProjectCodeMap: proName,//设置项目对应的名称
      PartyA: PartyA,//设置甲方对应的名字
      is_show_item: false//取消显示picker
    })
  },

  //点击开始时间
  showStartMenu() {
    this.setData({
      is_show_start: true
    })
  },
  confirmStart(e) {
    const t = parseTime(e.detail / 1000);
    this.setData({
      ContractSignTime: t,
      is_show_start: false,
      start_time_temp: e.detail,//设置开始的时间戳 和结束作比较，结束时间戳必须大于开始
    })
  },
  cancelStart() {
    this.setData({
      is_show_start: false
    })
  },

  // 点击结束时间
  showstopMenu() {
    this.setData({
      is_show_stop: true
    })
  },
  confirmStop(e) {
    const t = parseTime(e.detail / 1000);
    this.setData({
      ContractEndTime: t,
      is_show_stop: false,
      stop_time_temp: e.detail,//结束时间戳
    })
  },
  cancelStop() {
    this.setData({
      is_show_stop: false
    })
  },
  // 点击===================================提交信息表单
  handleSubmit() {
    // 校验 合同名不能为空
    if(!this.data.ContractName) {
      wx.showToast({
        title: '合同名称不能为空',
        icon: 'none',
        duration: 1000,
        mask: true
      });
      return
    }
    // 校验 项目不能为空
    if(!this.data.ProjectCode) {
      wx.showToast({
        title: '所属项目不能为空',
        icon: 'none',
        duration: 1000,
        mask: true
      });
      return
    }
    // 校验 合同编号不能为空
    if(!this.data.ContractCode) {
      wx.showToast({
        title: '合同编号不能为空',
        icon: 'none',
        duration: 1000,
        mask: true
      });
      return
    }
    // 校验 合同分类不能为空
    if(!this.data.ContractType) {
      wx.showToast({
        title: '合同类型不能为空',
        icon: 'none',
        duration: 1000,
        mask: true
      });
      return
    }
    // 校验 合同金额不能为空
    if(!this.data.ContractAmount) {
      wx.showToast({
        title: '合同金额不能为空',
        icon: 'none',
        duration: 1000,
        mask: true
      });
      return
    }
    // 校验 签订时间不能为空
    if(!this.data.ContractSignTime) {
      wx.showToast({
        title: '签订时间不能为空',
        icon: 'none',
        duration: 1000,
        mask: true
      });
      return
    }
    // 校验 到期时间不能为空
    if(!this.data.ContractEndTime) {
      wx.showToast({
        title: '到期时间不能为空',
        icon: 'none',
        duration: 1000,
        mask: true
      });
      return
    }
    
    // 判断时间戳大小
    if(this.data.stop_time_temp < this.data.start_time_temp) {
      wx.showToast({
        title: '到期时间必须大于签订时间',
        icon: 'none',
        duration: 1000,
        mask: true,
      });
      return
    }

    const subData = {
      ContractName: this.data.ContractName,
      ContractCode: this.data.ContractCode,
      ContractRemark: this.data.ContractRemark,
      ContractType: this.data.ContractType,
      ProjectCode: this.data.ProjectCode,
      PartyA: this.data.PartyA,
      ContractAmount: this.data.ContractAmount,
      ContractAmount: parseInt(this.data.ContractAmount.replace(/\,/g,'').replace(/\￥/g,'')),//去掉字符串
      ContractSignTime: this.data.ContractSignTime.replace(/\./g,'-') + ' 00:00:00',
      ContractEndTime: this.data.ContractEndTime.replace(/\./g,'-') + ' 00:00:00',
      ContractEffectTime: '',
      ContractNoEffectTime: '',
      ContractParentCode: this.data.contract_parent_id,//补充合同编号
    }
    console.log(subData)
    // 调用更新接口
    this.updateContract(subData);
  },
  // 请求===================================异步请求
  // 获取选择的项目菜单
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
      this.setData({
        loading: false,//取消加载
      })
    }
  },

  // 提交信息修改表单
  async updateContract(subData) {
    const that = this;
    try {
      const token = getToken();
      let res = await cloudFunc("updateContract", {
        token,
        ...subData,
      });
      console.log(res,'改变的结果')
      if(res.result === '0') {
        wx.showToast({
          title: "新合同编号不存在",
          icon: "none",
          duration: 1000,
          mask: true,
        });
      }else {
        wx.showToast({
          title: "更新成功",
          icon: "none",
          duration: 1000,
          mask: true,
        });
        // 返回上一页
        setTimeout(_ => {
          wx.navigateBack();
        },1000)
      }
    } catch (error) {
      console.log(error, "错误");
      wx.showToast({
        title: "请求错误",
        icon: "none",
        duration: 1000,
        mask: true,
      });
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const contractData = JSON.parse(options.contractData);
    function _transformTemp(temp) {
      return new Date(temp).getTime();//将时间转换为时间戳返回
    }
    this.setData({
      ContractName: contractData.ContractName,
      ContractCode: contractData.ContractCode,
      ContractRemark: contractData.ContractRemark,
      ContractType: _contractType2Number(contractData.ContractType),//将传递的类型名称转换为数字
      ContractTypeMap: contractData.ContractType,//合同类型 显示的value
      ProjectCode: contractData.ProjectCode,
      ProjectCodeMap: contractData.ProjectName,
      PartyA: contractData.PartyA,
      ContractAmount: contractData.ContractAmount.replace(/\,/g,'').replace(/\￥/g,''),
      ContractSignTime: contractData.ContractSignTime,
      ContractEndTime: contractData.ContractEndTime,
      PartyA: contractData.PartyA,//甲方
      PartyC: contractData.PartyC,//丙方
      
      start_time_temp: contractData.ContractSignTime && _transformTemp(contractData.ContractSignTime.replace(/\./g,'-')),// 设置开始时间戳
      stop_time_temp: contractData.ContractEndTime && _transformTemp(contractData.ContractEndTime.replace(/\./g,'-')),// 设置结束时间戳

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